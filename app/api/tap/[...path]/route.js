// Temporary Tap sandbox proxy for frontend-only R&D demos (USE_TAP_SANDBOX_MOCK).
// api.tap.company sends no CORS headers, so browsers can't call it directly.
// The mock service layer calls /api/tap/* instead; this route forwards the
// request server-side and injects the sandbox secret key from
// TAP_SANDBOX_SECRET_KEY (falls back to the client's Authorization header).
// Delete this file once the real /api/payments/tap/* backend routes ship.
const TAP_API_BASE = "https://api.tap.company/v2";

async function handler(request, { params }) {
    const { path = [] } = await params;
    const url = `${TAP_API_BASE}/${path.join("/")}`;

    const serverKey = process.env.TAP_SANDBOX_SECRET_KEY;
    const authorization = serverKey
        ? `Bearer ${serverKey}`
        : request.headers.get("authorization") || "";

    const init = {
        method: request.method,
        headers: {
            "Content-Type": "application/json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
        init.body = await request.text();
    }

    const response = await fetch(url, init);
    const body = await response.text();

    return new Response(body, {
        status: response.status,
        headers: {
            "Content-Type":
                response.headers.get("content-type") || "application/json",
        },
    });
}

export { handler as GET, handler as POST };
