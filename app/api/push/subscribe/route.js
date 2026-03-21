import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import User from "@/models/User";

// POST — save or update push subscription for current user
export const POST = withAuth(async (req, { user }) => {
    try {
        const { subscription } = await req.json();

        if (!subscription) {
            return NextResponse.json({ error: "Subscription object is required" }, { status: 400 });
        }

        await User.findByIdAndUpdate(user.id, {
            pushSubscription: subscription
        });

        return NextResponse.json({ message: "Subscription saved successfully" });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
});
