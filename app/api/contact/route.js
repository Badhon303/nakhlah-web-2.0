import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        {
            message:
                "Online contact submissions are currently unavailable. Please email support@nakhlah.net.",
        },
        { status: 410 },
    );
}
