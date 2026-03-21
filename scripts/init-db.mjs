/**
 * Database Initialization Script
 * ─────────────────────────────────
 * Connects to MongoDB Atlas, creates the database and all collections
 * with their indexes defined in the Mongoose models.
 *
 * Usage:  node scripts/init-db.mjs
 */

import mongoose from "mongoose";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dns from "dns";
import dnsPromises from "dns/promises";

// Use Google DNS for the script to bypass local DNS issues
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ── Load .env.local ──────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local");
    process.exit(1);
}

async function connectWithRetry(uri) {
    console.log("🔌 Connecting to MongoDB Atlas...");
    console.log(`   URI: ${uri.replace(/\/\/.*@/, "//***:***@")}`);

    const opts = {
        serverSelectionTimeoutMS: 15000,
        family: 4,
    };

    try {
        await mongoose.connect(uri, opts);
        console.log("✅ Connected to MongoDB Atlas successfully!\n");
        return true;
    } catch (err) {
        if (err.message.includes("ECONNREFUSED") && uri.startsWith("mongodb+srv")) {
            console.warn("⚠️  SRV resolution failed. Attempting manual shard resolution...");
            try {
                // Extract cluster name from SRV URI
                const hostPart = uri.split("@")[1].split("/")[0].split("?")[0];
                const srvRecords = await dnsPromises.resolveSrv(`_mongodb._tcp.${hostPart}`);
                
                if (srvRecords && srvRecords.length > 0) {
                    const shards = srvRecords.map(r => `${r.name}:${r.port}`).join(",");
                    const authAndOptions = uri.replace("mongodb+srv://", "").replace(hostPart, "");
                    const directUri = `mongodb://${authAndOptions.includes("@") ? uri.split("@")[0].split("//")[1] + "@" : ""}${shards}${authAndOptions.includes("/") ? "/" + authAndOptions.split("/")[1] : ""}`;
                    
                    console.log(`🔗 Retrying with direct shard URI...`);
                    // We need to add some options for direct connection to Atlas
                    const finalDirectUri = directUri.includes("?") 
                        ? `${directUri}&ssl=true&authSource=admin`
                        : `${directUri}?ssl=true&authSource=admin`;

                    await mongoose.connect(finalDirectUri, opts);
                    console.log("✅ Connected via direct shard URI successfully!\n");
                    return true;
                }
            } catch (dnsErr) {
                console.error("❌ Manual shard resolution also failed.");
                
                // Final desperation: Hardcoded fallback to verified shards with IP resolution
                console.log("🛠️  Attempting hardcoded shard-to-IP fallback...");
                const shardHosts = [
                    "ac-qpjhywt-shard-00-00.8htve0z.mongodb.net",
                    "ac-qpjhywt-shard-00-01.8htve0z.mongodb.net",
                    "ac-qpjhywt-shard-00-02.8htve0z.mongodb.net"
                ];
                
                try {
                    const shardIps = [];
                    for (const host of shardHosts) {
                        try {
                            const addrs = await dnsPromises.lookup(host, { family: 4 });
                            shardIps.push(`${addrs.address}:27017`);
                        } catch (e) {
                            console.warn(`   ⚠️  Could not resolve ${host}: ${e.message}`);
                        }
                    }
                    
                    if (shardIps.length === 0) throw new Error("Could not resolve any shard IPs");

                    const authAndOptions = uri.replace("mongodb+srv://", "").split("@")[0];
                    const finalDirectUri = `mongodb://${authAndOptions}@${shardIps.join(",")}/myuniverse?ssl=true&replicaSet=atlas-qpjhywt-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;
                    
                    console.log(`🔗 Connecting to IPs: ${shardIps.join(", ")}`);
                    await mongoose.connect(finalDirectUri, opts);
                    console.log("✅ Connected via IP fallback successfully!\n");
                    return true;
                } catch (hardErr) {
                    console.error("❌ IP fallback also failed:");
                    console.error(`   ${hardErr.message}`);
                }
            }
        }
        
        console.error("❌ Failed to connect to MongoDB Atlas:");
        console.error(`   ${err.message}`);
        
        if (err.message.includes("ENOTFOUND") || err.message.includes("getaddrinfo") || err.message.includes("ECONNREFUSED")) {
            console.error("\n💡 TIP: This is often a DNS or Network issue.");
            console.error("   1. Check if your IP is whitelisted in Atlas (Network Access).");
            console.error("   2. Check if your firewall/VPN is blocking port 27017.");
        }
        return false;
    }
}

// ── Main logic ──
if (!await connectWithRetry(MONGODB_URI)) {
    process.exit(1);
}

// ── Define all schemas / models (inline to avoid import alias issues) ────────
const db = mongoose.connection.db;
const dbName = db.databaseName;

console.log(`📦 Database name: "${dbName}"\n`);
console.log("🏗️  Creating collections and indexes...\n");

// We need to register all models. The easiest portable way is to define
// them inline, mirroring the project's model files exactly.

// 1. User
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        partnerEmail: { type: String, lowercase: true, trim: true, default: "" },
        avatar: { type: String, default: "" },
        coupleId: { type: String, default: "" },
        anniversaryDate: { type: Date },
        milestoneName: { type: String, default: "Our Special Day" },
        togetherSince: { type: Date },
    },
    { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// 2. Memory
const MemorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        date: { type: Date, required: true },
        imageUrl: { type: String, default: "" },
        audioUrl: { type: String, default: "" },
        category: { type: String, enum: ["milestone", "date", "travel", "everyday", "special"], default: "everyday" },
        mood: { type: String, enum: ["❤️", "😊", "🥰", "✨", "🌟", "🎉", "🥺", "💫"], default: "❤️" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        coupleId: { type: String, required: true },
    },
    { timestamps: true }
);
MemorySchema.index({ coupleId: 1, date: -1 });
const Memory = mongoose.models.Memory || mongoose.model("Memory", MemorySchema);

// 3. Journal
const JournalSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        date: { type: Date, default: Date.now, required: true },
        mood: { type: String, enum: ["✨", "❤️", "😊", "🥰", "🌟", "🎉", "🥺", "💫", "🍃", "☁️"], default: "😊" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, required: true },
        coupleId: { type: String, required: true },
    },
    { timestamps: true }
);
JournalSchema.index({ coupleId: 1, date: -1 });
const Journal = mongoose.models.Journal || mongoose.model("Journal", JournalSchema);

// 4. Letter
const LetterSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        openDate: { type: Date, required: true },
        isOpened: { type: Boolean, default: false },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, required: true },
        coupleId: { type: String, required: true },
    },
    { timestamps: true }
);
LetterSchema.index({ coupleId: 1, openDate: 1 });
const Letter = mongoose.models.Letter || mongoose.model("Letter", LetterSchema);

// 5. LoveNote
const LoveNoteSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, required: true },
        coupleId: { type: String, required: true },
    },
    { timestamps: true }
);
const LoveNote = mongoose.models.LoveNote || mongoose.model("LoveNote", LoveNoteSchema);

// 6. BucketItem
const BucketItemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        isCompleted: { type: Boolean, default: false },
        completedDate: { type: Date },
        memoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Memory" },
        coupleId: { type: String, required: true },
    },
    { timestamps: true }
);
const BucketItem = mongoose.models.BucketItem || mongoose.model("BucketItem", BucketItemSchema);

// 7. Pulse
const PulseSchema = new mongoose.Schema(
    {
        fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        coupleId: { type: String, required: true },
        lastPulse: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
const Pulse = mongoose.models.Pulse || mongoose.model("Pulse", PulseSchema);

// 8. QuestionAnswer
const QuestionAnswerSchema = new mongoose.Schema(
    {
        questionId: { type: String, required: true },
        questionText: { type: String, required: true },
        answer: { type: String, required: true, maxlength: 2000 },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, required: true },
        coupleId: { type: String, required: true },
    },
    { timestamps: true }
);
QuestionAnswerSchema.index({ coupleId: 1, questionId: 1 });
const QuestionAnswer = mongoose.models.QuestionAnswer || mongoose.model("QuestionAnswer", QuestionAnswerSchema);

// 9. Reflection
const ReflectionSchema = new mongoose.Schema(
    {
        whatHurt: { type: String, required: true, maxlength: 3000 },
        whatLearned: { type: String, required: true, maxlength: 3000 },
        doDifferently: { type: String, required: true, maxlength: 3000 },
        mood: { type: String, default: "🤝" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, required: true },
        coupleId: { type: String, required: true },
        visibleAfter: { type: Date, required: true },
    },
    { timestamps: true }
);
ReflectionSchema.index({ coupleId: 1, createdAt: -1 });
const Reflection = mongoose.models.Reflection || mongoose.model("Reflection", ReflectionSchema);

// ── Sync indexes (creates collections if they don't exist) ───────────────────
const models = [User, Memory, Journal, Letter, LoveNote, BucketItem, Pulse, QuestionAnswer, Reflection];

for (const Model of models) {
    const collectionName = Model.collection.collectionName;
    try {
        await Model.createCollection();
        await Model.syncIndexes();
        console.log(`   ✅ ${collectionName}`);
    } catch (err) {
        console.error(`   ❌ ${collectionName} — ${err.message}`);
    }
}

// ── Verify ───────────────────────────────────────────────────────────────────
console.log("\n📋 Final collection list:");
const collections = await db.listCollections().toArray();
for (const col of collections) {
    console.log(`   • ${col.name}`);
}

console.log(`\n🎉 Database "${dbName}" is ready with ${collections.length} collections!`);

await mongoose.disconnect();
console.log("🔌 Disconnected from MongoDB Atlas.\n");
