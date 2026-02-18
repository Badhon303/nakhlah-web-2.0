import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data?.message || "Authentication failed");
                    }

                    if (data.token && data.user) {
                        return {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.name,
                            role: data.user.role,
                            accessToken: data.token,
                            exp: data.exp,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    throw new Error(error.message || "Authentication failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    exp: user.exp,
                    userId: user.id,
                    role: user.role,
                };
            }

            // Check if token has expired
            if (token.exp && Date.now() / 1000 > token.exp) {
                // Token expired - user needs to re-authenticate
                return {
                    ...token,
                    error: "TokenExpired",
                };
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.userId;
                session.user.role = token.role;
                session.accessToken = token.accessToken;
                session.error = token.error;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 2 hours (matching API session duration)
    },
    secret: process.env.NEXTAUTH_SECRET,
};
