import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import User from "@/models/User";

// GET — fetch shared milestone for the couple
export const GET = withAuth(async (req, { user }) => {
    // We can fetch from any user in the couple since they are kept in sync
    const milestoneData = await User.findOne({ coupleId: user.coupleId })
        .select("anniversaryDate milestoneName");

    return NextResponse.json(milestoneData);
});
