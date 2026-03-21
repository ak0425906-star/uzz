import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import User from "@/models/User";
import webpush from "web-push";

// Initialize web-push
webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:ak0425906@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// POST — trigger a push notification to the partner
export const POST = withAuth(async (req, { user }) => {
    try {
        const { type, customMessage } = await req.json();

        // 1. Find the partner
        const currentUser = await User.findById(user.id);
        const partner = await User.findOne({ 
            email: currentUser.partnerEmail,
            coupleId: user.coupleId 
        });

        if (!partner || !partner.pushSubscription) {
            return NextResponse.json({ 
                error: "Partner has not enabled notifications yet" 
            }, { status: 404 });
        }

        // 2. Prepare payload
        let title = "UZZ 🌕";
        let body = `${user.name} sent you a ping!`;
        let icon = "/icons/icon-192x192.png";

        if (type === "SOS") {
            title = "🚨 SOS FROM YOUR LOVE";
            body = `${user.name} NEEDS YOU RIGHT NOW!`;
        } else if (type === "LOVE") {
            title = "💖 A COSMIC KISS";
            body = `${user.name} is thinking about you...`;
        } else if (customMessage) {
            body = customMessage;
        }

        const payload = JSON.stringify({
            title,
            body,
            icon,
            data: { url: "/dashboard" }
        });

        // 3. Send Push
        await webpush.sendNotification(partner.pushSubscription, payload);

        return NextResponse.json({ message: "Notification sent to partner" });
    } catch (err) {
        console.error("Push Error:", err);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
});
