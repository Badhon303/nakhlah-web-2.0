/**
 * Client-side helper for the Contact Us form. Unlike the other services in
 * this folder, this hits our own Next.js route (app/api/contact/route.js)
 * rather than the external Nakhlah API, since the Resend integration lives
 * inside this app.
 */
export async function submitContactForm({ name, email, subject, message }) {
    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, subject, message }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data?.message || "Failed to send your message.");
        }

        return {
            success: true,
            message: data?.message || "Your message has been sent.",
        };
    } catch (error) {
        console.error("submitContactForm error:", error);
        return {
            success: false,
            error: error.message || "Failed to send your message.",
        };
    }
}
