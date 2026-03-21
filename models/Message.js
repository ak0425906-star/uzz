import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please provide message content"],
            trim: true,
            maxlength: [200, "Message cannot exceed 200 characters"]
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        coupleId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
