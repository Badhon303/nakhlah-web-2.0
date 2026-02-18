const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/users/sign-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Registration failed");
        }

        return {
            success: true,
            token: data.token,
            user: data.user,
            exp: data.exp,
            message: data.message,
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            error: error.message || "Registration failed",
        };
    }
}


export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Login failed");
        }

        return {
            success: true,
            token: data.token,
            user: data.user,
            exp: data.exp,
            message: data.message,
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: error.message || "Login failed",
        };
    }
}
