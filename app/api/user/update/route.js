import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import User from "@/models/User";

// PATCH — update user profile (anniversary, milestone name)
export const PATCH = withAuth(async (req, { user }) => {
    const body = await req.json();

    const validated = validateBody(body, {
        anniversaryDate: { type: "date" },
        milestoneName: { maxLength: 100 },
        togetherSince: { type: "date" },
    });

    const updateData = {};
    if (validated.anniversaryDate) updateData.anniversaryDate = validated.anniversaryDate;
    if (validated.milestoneName) updateData.milestoneName = validated.milestoneName;
    if (validated.togetherSince) updateData.togetherSince = validated.togetherSince;

    const updatedUser = await User.updateMany(
        { coupleId: user.coupleId },
        updateData
    );

    return NextResponse.json({ user: updatedUser });
});
