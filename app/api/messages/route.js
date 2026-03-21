import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import Message from "@/models/Message";

// GET — fetch recent messages for the couple
export const GET = withAuth(async (req, { user }) => {
    const messages = await Message.find({ coupleId: user.coupleId })
        .sort({ createdAt: -1 })
        .limit(10);
    
    return NextResponse.json({ messages });
});

// POST — send a new quick message
export const POST = withAuth(async (req, { user }) => {
    try {
        const { content } = await req.json();
        
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const newMessage = await Message.create({
            content,
            userId: user.id,
            authorName: user.name,
            coupleId: user.coupleId
        });

        return NextResponse.json({ message: newMessage }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
});
