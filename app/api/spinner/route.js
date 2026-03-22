import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import VisitedTopic from "@/models/VisitedTopic";
import { STELLAR_TOPICS } from "@/lib/stellarTopics";

export const GET = withAuth(async (req, { user }) => {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        // 1. Get visited topics for this couple
        const visited = await VisitedTopic.find({ coupleId: user.coupleId }).lean();
        const visitedIds = new Set(visited.map((v) => v.topicId));

        // 2. Filter pool based on category (if provided) and visited status
        let pool = [];
        if (category && STELLAR_TOPICS[category]) {
            pool = STELLAR_TOPICS[category].filter((t) => !visitedIds.has(t.id));
        } else {
            // Aggregate all categories if no specific one requested
            Object.values(STELLAR_TOPICS).forEach((catList) => {
                pool.push(...catList.filter((t) => !visitedIds.has(t.id)));
            });
        }

        // 3. Fallback: If no new topics left, reset visited list (or just return random from all)
        if (pool.length === 0) {
            // Option A: Just return random from all
            const all = [];
            Object.values(STELLAR_TOPICS).forEach(cat => all.push(...cat));
            const random = all[Math.floor(Math.random() * all.length)];
            return NextResponse.json({ topic: random, reset: true });
        }

        // 4. Return random from available pool
        const selected = pool[Math.floor(Math.random() * pool.length)];

        return NextResponse.json({ topic: selected });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch topic" }, { status: 500 });
    }
});

export const POST = withAuth(async (req, { user }) => {
    try {
        const { topicId } = await req.json();
        if (!topicId) return NextResponse.json({ error: "Topic ID required" }, { status: 400 });

        await VisitedTopic.findOneAndUpdate(
            { coupleId: user.coupleId, topicId },
            { coupleId: user.coupleId, topicId },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Failed to mark as visited" }, { status: 500 });
    }
});
