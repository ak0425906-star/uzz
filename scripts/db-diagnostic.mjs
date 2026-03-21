import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
}

// DNS fix
if (typeof dns.setServers === "function") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

async function testConnection() {
    console.log("🔍 Starting MongoDB connection diagnostic...");
    console.log(`📡 URI found: ${MONGODB_URI.split("@")[1] ? "Standard/SRV format" : "Check URI format"}`);

    try {
        const opts = {
            serverSelectionTimeoutMS: 10000,
            family: 4,
        };
        
        await mongoose.connect(MONGODB_URI, opts);
        console.log("✅ SUCCESS: Successfully connected to MongoDB Atlas!");
    } catch (error) {
        console.error("❌ ERROR: Failed to connect to MongoDB.");
        console.error("--------------------------------------------------");
        console.error(`Error Code: ${error.code || "N/A"}`);
        console.error(`Message: ${error.message}`);
        
        if (error.message.includes("whitelisted")) {
            console.error("\n💡 DIAGNOSIS: IP Whitelist issue detected.");
            console.error("Action Needed: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Add Current IP Address.");
        } else if (error.message.includes("getaddrinfo")) {
            console.error("\n💡 DIAGNOSIS: DNS resolution issue detected.");
        }
        console.error("--------------------------------------------------");
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

testConnection();
