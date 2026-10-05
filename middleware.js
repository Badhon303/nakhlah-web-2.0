import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
        const isOnboarding = req.nextUrl.pathname.startsWith("/onboarding");
        const isGetStarted = req.nextUrl.pathname.startsWith("/get-started");
        const isLegalDocument =
            req.nextUrl.pathname === "/privacy" ||
            req.nextUrl.pathname.startsWith("/privacy/") ||
            req.nextUrl.pathname === "/terms-and-conditions" ||
            req.nextUrl.pathname.startsWith("/terms-and-conditions/");

        // Allow auth pages, onboarding, get-started, and public legal pages
        if (isAuthPage || isOnboarding || isGetStarted || isLegalDocument) {
            return NextResponse.next();
        }

        // Redirect to login if not authenticated on protected routes
        if (!isAuth) {
            let from = req.nextUrl.pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }

            return NextResponse.redirect(
                new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
            );
        }

        // Check for expired / failed auth tokens
        if (
            token.error === "TokenExpired" ||
            token.error === "RefreshAccessTokenError" ||
            token.error === "SocialLoginFailed"
        ) {
            return NextResponse.redirect(
                new URL("/auth/login?error=SessionExpired", req.url)
            );
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: () => true, // Handle authorization in the middleware function above
        },
    }
);

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
