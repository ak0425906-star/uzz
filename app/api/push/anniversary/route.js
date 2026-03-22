import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import User from "@/models/User";
import { sendPushNotification } from "@/lib/push";

// POST — trigger push notifications for an anniversary to BOTH partners
export const POST = withAuth(async (req, { user }) => {
    try {
        const { anniversaryTitle } = await req.json();

        // 1. Find the current user and their partner
        const currentUser = await User.findById(user.id);
        const partner = await User.findOne({ 
            email: currentUser.partnerEmail,
            coupleId: user.coupleId 
        });

        const notifyPartner = partner && partner.pushSubscription;
        const notifySelf = currentUser && currentUser.pushSubscription;

        const payload = {
            title: "UZZ 🌕 Anniversary",
            body: `Today is your special day: ${anniversaryTitle}! ✨`,
            icon: "/icons/icon-192x192.png",
            data: { url: "/dashboard" }
        };

        const pushPromises = [];
        if (notifyPartner) {
            pushPromises.push(sendPushNotification(partner.pushSubscription, payload));
        }
        if (notifySelf) {
            pushPromises.push(sendPushNotification(currentUser.pushSubscription, payload));
        }

        await Promise.all(pushPromises);

        return NextResponse.json({ message: "Anniversary notifications sent" });
    } catch (err) {
        console.error("Push Error:", err);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
});
