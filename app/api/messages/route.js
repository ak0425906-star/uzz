import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import Message from "@/models/Message";
import User from "@/models/User";
import { sendPushNotification } from "@/lib/push";

// GET — fetch recent messages for the couple
export const GET = withAuth(async (req, { user }) => {
    const messages = await Message.find({ coupleId: user.coupleId })
        .sort({ createdAt: -1 })
        .limit(50); // Increased limit for the full page
    
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

        // Trigger push notification to partner
        const currentUser = await User.findById(user.id);
        const partner = await User.findOne({ 
            email: currentUser.partnerEmail,
            coupleId: user.coupleId 
        });

        if (partner?.pushSubscription) {
            await sendPushNotification(partner.pushSubscription, {
                title: `💌 New Message from ${user.name}`,
                body: content.length > 50 ? `${content.substring(0, 50)}...` : content,
                icon: "/icons/icon-192x192.png",
                data: { url: "/messages" }
            });
        }

        return NextResponse.json({ message: newMessage }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
});
