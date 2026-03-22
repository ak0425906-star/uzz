import mongoose from "mongoose";

const VisitedTopicSchema = new mongoose.Schema(
    {
        coupleId: {
            type: String,
            required: true,
        },
        topicId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

VisitedTopicSchema.index({ coupleId: 1, topicId: 1 }, { unique: true });

export default mongoose.models.VisitedTopic || mongoose.model("VisitedTopic", VisitedTopicSchema);
