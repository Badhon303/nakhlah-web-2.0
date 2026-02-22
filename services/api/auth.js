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

export async function createUserProfile(profileData, token) {
    try {
        const response = await fetch(`${API_URL}/api/user-profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Profile creation failed");
        }

        return {
            success: true,
            profile: data.doc,
            message: data.message,
        };
    } catch (error) {
        console.error("Profile creation error:", error);
        return {
            success: false,
            error: error.message || "Profile creation failed",
        };
    }
}

export async function forgotPassword(email) {
    try {
        const response = await fetch(`${API_URL}/api/users/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Failed to send reset email");
        }

        return {
            success: true,
            message: data.message || "Reset code sent to your email",
        };
    } catch (error) {
        console.error("Forgot password error:", error);
        return {
            success: false,
            error: error.message || "Failed to send reset email",
        };
    }
}

export async function resetPassword(token, password) {
    try {
        const response = await fetch(`${API_URL}/api/users/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Failed to reset password");
        }

        return {
            success: true,
            message: data.message || "Password reset successfully",
        };
    } catch (error) {
        console.error("Reset password error:", error);
        return {
            success: false,
            error: error.message || "Failed to reset password",
        };
    }
}

export async function verifyOTP(email, otp) {
    try {
        const response = await fetch(`${API_URL}/api/users/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (!response.ok || data.errors) {
            throw new Error(data?.errors?.message || data?.message || "Invalid OTP code");
        }

        return {
            success: true,
            token: data.token || data.access_token,
            message: data.message || "OTP verified successfully",
        };
    } catch (error) {
        console.error("OTP verification error:", error);
        return {
            success: false,
            error: error.message || "Failed to verify OTP",
        };
    }
}

