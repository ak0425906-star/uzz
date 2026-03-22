import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import Anniversary from "@/models/Anniversary";

export const GET = withAuth(async (req, { user }) => {
    try {
        const anniversaries = await Anniversary.find({ coupleId: user.coupleId })
            .sort({ date: 1 });
        return NextResponse.json({ anniversaries });
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch anniversaries" }, { status: 500 });
    }
});

export const POST = withAuth(async (req, { user }) => {
    try {
        const body = await req.json();
        const validated = validateBody(body, {
            title: { required: true, maxLength: 100 },
            date: { required: true },
            type: { required: false },
            description: { required: false, maxLength: 500 },
            isImportant: { required: false }
        });

        const anniversary = await Anniversary.create({
            ...validated,
            userId: user.id,
            coupleId: user.coupleId,
        });

        return NextResponse.json({ anniversary }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to create anniversary" }, { status: 500 });
    }
});

export const DELETE = withAuth(async (req, { user }) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const deleted = await Anniversary.findOneAndDelete({
            _id: id,
            coupleId: user.coupleId
        });

        if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
});
