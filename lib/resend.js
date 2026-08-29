import { Resend } from "resend";

/**
 * Lazily-created singleton Resend client for server-side email delivery.
 * Server-only: relies on process.env.RESEND_API_KEY, which must never be
 * exposed to the client bundle (no NEXT_PUBLIC_ prefix).
 */
let cachedClient = null;

export function getResendClient() {
    if (cachedClient) return cachedClient;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("RESEND_API_KEY is not configured");
    }

    cachedClient = new Resend(apiKey);
    return cachedClient;
}
