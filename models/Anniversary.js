import mongoose from "mongoose";

const AnniversarySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title for the anniversary"],
            trim: true,
        },
        date: {
            type: Date,
            required: [true, "Please provide a date"],
        },
        type: {
            type: String,
            enum: ["yearly", "once", "monthly"],
            default: "yearly",
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coupleId: {
            type: String,
            required: true,
        },
        isImportant: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

AnniversarySchema.index({ coupleId: 1, date: 1 });

export default mongoose.models.Anniversary || mongoose.model("Anniversary", AnniversarySchema);
