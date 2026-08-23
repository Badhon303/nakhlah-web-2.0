import { NextResponse } from "next/server";
import { getResendClient } from "@/lib/resend";
import {
    buildContactFormEmailHtml,
    buildContactFormEmailText,
} from "@/lib/emails/contactFormEmail";

/**
 * POST /api/contact
 *
 * Receives Contact Us form submissions and relays them via Resend to the
 * inbox configured in CONTACT_EMAIL_TO. The submitter's email is set as the
 * `replyTo` address so replies from the inbox go straight back to them.
 *
 * Required env vars (see .env):
 *   RESEND_API_KEY     — Resend dashboard → API Keys
 *   CONTACT_EMAIL_TO   — inbox that should receive submissions
 *   CONTACT_EMAIL_FROM — verified sender, e.g. "Name <onboarding@resend.dev>"
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_FIELD_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { message: "Invalid request body." },
            { status: 400 },
        );
    }

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !subject || !message) {
        return NextResponse.json(
            { message: "Please fill in all fields before sending." },
            { status: 400 },
        );
    }

    if (name.length > MAX_FIELD_LENGTH || subject.length > MAX_FIELD_LENGTH) {
        return NextResponse.json(
            { message: "Name and subject must be under 150 characters." },
            { status: 400 },
        );
    }

    if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json(
            { message: "Enter a valid email address." },
            { status: 400 },
        );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json(
            { message: "Message must be under 5000 characters." },
            { status: 400 },
        );
    }

    const toAddress = process.env.CONTACT_EMAIL_TO;
    const fromAddress = process.env.CONTACT_EMAIL_FROM;

    if (!process.env.RESEND_API_KEY || !toAddress || !fromAddress) {
        console.error(
            "Contact form is missing configuration: RESEND_API_KEY, CONTACT_EMAIL_TO, or CONTACT_EMAIL_FROM.",
        );
        return NextResponse.json(
            {
                message:
                    "Contact form is temporarily unavailable. Please try again later.",
            },
            { status: 503 },
        );
    }

    try {
        const resend = getResendClient();
        const { error } = await resend.emails.send({
            from: fromAddress,
            to: toAddress,
            replyTo: email,
            subject: `[Nakhlah Contact] ${subject}`,
            html: buildContactFormEmailHtml({ name, email, subject, message }),
            text: buildContactFormEmailText({ name, email, subject, message }),
        });

        if (error) {
            console.error("Resend send error:", error);
            return NextResponse.json(
                {
                    message: "Failed to send your message. Please try again later.",
                },
                { status: 502 },
            );
        }

        return NextResponse.json({
            message: "Your message has been sent. We'll get back to you soon!",
        });
    } catch (error) {
        console.error("Contact form send error:", error);
        return NextResponse.json(
            { message: "Failed to send your message. Please try again later." },
            { status: 500 },
        );
    }
}
