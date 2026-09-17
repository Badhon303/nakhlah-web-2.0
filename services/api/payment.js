import { buildApiUrl } from "@/lib/api-config";
import { fetchCurrentUser, refreshAccessToken } from "./auth";

const withApiUrl = (path) => buildApiUrl(path);

const toErrorMessage = (data, fallback) => {
    if (typeof data === "string" && data.trim()) return data;
    return data?.message || data?.error || (data?.errors?.message ?? fallback);
};

async function fetchWithAuthRetry(path, { method = "GET", token, headers = {}, body } = {}) {
    const endpoint = withApiUrl(path);

    const buildHeaders = (accessToken) => ({
        ...headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    });

    const execute = (accessToken) =>
        fetch(endpoint, {
            method,
            headers: buildHeaders(accessToken),
            ...(body !== undefined ? { body } : {}),
            credentials: "include",
        });

    let response = await execute(token);
    let resolvedToken = token || null;

    if (response.status !== 401) {
        return { response, token: resolvedToken };
    }

    if (!token) {
        return { response, token: resolvedToken };
    }

    const refreshed = await refreshAccessToken(token);
    if (!refreshed.success) {
        return { response, token: resolvedToken };
    }

    const me = await fetchCurrentUser(refreshed.token || token);
    const retriedToken = me.success ? me.token : refreshed.token || token;

    if (!retriedToken) {
        return { response, token: resolvedToken };
    }

    resolvedToken = retriedToken;
    response = await execute(retriedToken);
    return { response, token: resolvedToken };
}

const normalizeApprovalUrl = (data) => {
    if (data?.approvalUrl) return data.approvalUrl;
    if (data?.approval_url) return data.approval_url;
    if (data?.approveUrl) return data.approveUrl;
    if (data?.url) return data.url;

    const approveLink = Array.isArray(data?.links)
        ? data.links.find((link) => {
            const rel = String(link?.rel || "").toLowerCase();
            return rel === "approve" || rel === "approval_url";
        })
        : null;

    return approveLink?.href || "";
};

export async function createDatePaymentOrder(packageId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        if (!packageId) {
            throw new Error("Missing date package");
        }

        const { response } = await fetchWithAuthRetry("/api/payments/dates/create-order", {
            method: "POST",
            token,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ packageId }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to start PayPal checkout"));
        }

        const approvalUrl = normalizeApprovalUrl(data);

        if (!approvalUrl) {
            throw new Error("PayPal approval URL was not returned");
        }

        return {
            success: true,
            orderId: data?.orderId || data?.id || null,
            approvalUrl,
            data,
        };
    } catch (error) {
        console.error("Create date payment order error:", error);
        return {
            success: false,
            error: error.message || "Failed to start PayPal checkout",
        };
    }
}

export async function captureDatePaymentOrder(orderId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        if (!orderId) {
            throw new Error("Missing PayPal order token");
        }

        const { response } = await fetchWithAuthRetry("/api/payments/dates/capture-order", {
            method: "POST",
            token,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to confirm PayPal payment"));
        }

        return {
            success: true,
            data,
            message: data?.message || "Payment confirmed successfully",
        };
    } catch (error) {
        console.error("Capture date payment order error:", error);
        return {
            success: false,
            error: error.message || "Failed to confirm PayPal payment",
        };
    }
}

export async function createSubscriptionPayment(plan, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const planId = plan?.id || plan;

        if (!planId) {
            throw new Error("Missing subscription plan");
        }

        const { response } = await fetchWithAuthRetry("/api/payments/subscriptions/create", {
            method: "POST",
            token,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ planId }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to start PayPal subscription"));
        }

        const approvalUrl = normalizeApprovalUrl(data);

        if (!approvalUrl) {
            throw new Error("PayPal approval URL was not returned");
        }

        return {
            success: true,
            subscriptionId: data?.subscriptionId || data?.id || null,
            approvalUrl,
            data,
        };
    } catch (error) {
        console.error("Create subscription payment error:", error);
        return {
            success: false,
            error: error.message || "Failed to start PayPal subscription",
        };
    }
}

export async function fetchCurrentSubscription(token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const { response } = await fetchWithAuthRetry("/api/payments/me/subscription", {
            method: "GET",
            token,
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to load subscription"));
        }

        return {
            success: true,
            subscription: data?.subscription || null,
            data,
        };
    } catch (error) {
        console.error("Fetch current subscription error:", error);
        return {
            success: false,
            error: error.message || "Failed to load subscription",
        };
    }
}

export async function cancelSubscription(subscriptionId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        if (!subscriptionId) {
            throw new Error("Missing subscription ID");
        }

        const { response } = await fetchWithAuthRetry("/api/payments/subscriptions/cancel", {
            method: "POST",
            token,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subscriptionId }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to cancel subscription"));
        }

        return {
            success: true,
            data,
            message: data?.message || "Subscription canceled successfully",
        };
    } catch (error) {
        console.error("Cancel subscription error:", error);
        return {
            success: false,
            error: error.message || "Failed to cancel subscription",
        };
    }
}

export async function switchSubscription(
    newPlanId,
    token,
    { paymentMethod = "paypal", customer } = {},
) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        if (!newPlanId) {
            throw new Error("Missing new plan ID");
        }

        const method = String(paymentMethod || "paypal").toLowerCase();
        const payload = {
            newPlanId,
            paymentMethod: method,
        };

        if (method === "tap") {
            const resolvedCustomer = {
                firstName: String(customer?.firstName || "").trim(),
                lastName: String(customer?.lastName || "").trim(),
                phoneCountryCode: String(
                    customer?.phoneCountryCode || "",
                ).replace(/\D/g, ""),
                phoneNumber: String(customer?.phoneNumber || "").replace(/\D/g, ""),
            };

            if (
                !resolvedCustomer.firstName ||
                !resolvedCustomer.lastName ||
                !resolvedCustomer.phoneCountryCode ||
                !resolvedCustomer.phoneNumber
            ) {
                throw new Error(
                    "Your name and mobile number are required to switch with Tap.",
                );
            }

            payload.customer = resolvedCustomer;
        }

        const { response } = await fetchWithAuthRetry("/api/payments/subscriptions/switch", {
            method: "POST",
            token,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to switch subscription"));
        }

        return {
            success: true,
            data,
            message: data?.message || "Subscription switched successfully",
        };
    } catch (error) {
        console.error("Switch subscription error:", error);
        return {
            success: false,
            error: error.message || "Failed to switch subscription",
        };
    }
}

const parseResponseBody = async (response) => {
    const raw = await response.text().catch(() => "");
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return { raw };
    }
};

export async function fetchTapConfig(token) {
    try {
        const { response } = await fetchWithAuthRetry("/api/payments/tap/config", {
            method: "GET",
            token,
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await parseResponseBody(response);

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to load Tap configuration"));
        }

        return {
            success: true,
            publicKey: data?.publicKey || "",
            merchantId: data?.merchantId || "",
            currency: data?.currency || "SAR",
            data,
        };
    } catch (error) {
        console.error("Fetch Tap config error:", error);
        return {
            success: false,
            error: error.message || "Failed to load Tap configuration",
        };
    }
}

const normalizeSaudiMobile = (value) =>
    String(value || "")
        .replace(/\D/g, "")
        .replace(/^966/, "")
        .replace(/^0/, "");

const buildTapDateChargePayload = (
    packageId,
    { paymentMethod = "card", phoneNumber } = {},
) => {
    const method = String(paymentMethod || "card").toLowerCase();

    // STC Pay (dates) — restore this branch with Card/STC UI later.
    // if (method === "stcpay") {
    //     const number = normalizeSaudiMobile(phoneNumber);
    //     if (!number) {
    //         throw new Error("A valid STC Pay mobile number is required");
    //     }
    //     const phone = {
    //         country_code: "966",
    //         number,
    //     };
    //
    //     return {
    //         packageId,
    //         currency: "SAR",
    //         source: {
    //             id: "src_sa.stcpay",
    //             phone,
    //         },
    //         phone,
    //         phoneNumber: number,
    //         phoneCountryCode: "966",
    //     };
    // }

    void method;
    void phoneNumber;

    return {
        packageId,
        source: "src_all",
        // source: "src_card",

    };
};

export async function createTapDateCharge(packageId, token, options = {}) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        if (!packageId) {
            throw new Error("Missing date package");
        }

        const tapConfig = await fetchTapConfig(token);
        if (!tapConfig.success) {
            throw new Error(tapConfig.error || "Failed to load Tap configuration");
        }

        const paymentMethod = String(options.paymentMethod || "card").toLowerCase();
        const payload = buildTapDateChargePayload(packageId, {
            ...options,
            paymentMethod: "card",
        });

        const { response } = await fetchWithAuthRetry(
            "/api/payments/dates/tap/create-charge",
            {
                method: "POST",
                token,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            },
        );

        const data = await parseResponseBody(response);

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to start Tap checkout"));
        }

        const chargeId =
            data?.chargeId ||
            data?.id ||
            data?.charge?.id ||
            data?.data?.chargeId ||
            data?.data?.id ||
            null;
        const approvalUrl = normalizeApprovalUrl(data);
        const status = String(
            data?.status || data?.data?.status || "INITIATED",
        ).toUpperCase();
        // STC Pay OTP (dates)
        // const needsOtp =
        //     paymentMethod === "stcpay" &&
        //     Boolean(chargeId) &&
        //     (status === "INITIATED" || !approvalUrl);
        const needsOtp = false;
        void paymentMethod;

        if (!needsOtp && !approvalUrl) {
            throw new Error("Tap approval URL was not returned");
        }

        return {
            success: true,
            chargeId,
            approvalUrl,
            needsOtp,
            status,
            tapConfig: tapConfig.data,
            data,
        };
    } catch (error) {
        console.error("Create Tap date charge error:", error);
        return {
            success: false,
            error: error.message || "Failed to start Tap checkout",
        };
    }
}

export async function confirmTapStcDateCharge(chargeId, otp, token) {
    // STC Pay (dates) — unused while Card/STC selection is disabled.
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        if (!chargeId) {
            throw new Error("Missing Tap charge id");
        }

        const otpCode = String(otp || "").trim();
        if (!otpCode) {
            throw new Error("Enter the OTP sent to the STC Pay number.");
        }

        const { response } = await fetchWithAuthRetry(
            "/api/payments/dates/tap/submit-otp",
            {
                method: "POST",
                token,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chargeId,
                    otp: otpCode,
                }),
            },
        );

        const data = await parseResponseBody(response);

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to confirm STC Pay"));
        }

        const status = String(data?.status || data?.data?.status || "").toUpperCase();
        if (status && status !== "CAPTURED") {
            throw new Error(
                toErrorMessage(data, `STC Pay was not captured (${status}).`),
            );
        }

        return {
            success: true,
            data,
            status: status || "CAPTURED",
            message: data?.message || "STC Pay confirmed successfully",
        };
    } catch (error) {
        console.error("Confirm STC Pay charge error:", error);
        return {
            success: false,
            error: error.message || "Failed to confirm STC Pay",
        };
    }
}

export async function captureTapDateCharge(chargeId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        if (!chargeId) {
            throw new Error("Missing Tap charge id");
        }

        const { response } = await fetchWithAuthRetry(
            "/api/payments/dates/tap/confirm-charge",
            {
                method: "POST",
                token,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chargeId }),
            },
        );

        const data = await parseResponseBody(response);

        if (!response.ok) {
            throw new Error(toErrorMessage(data, "Failed to confirm Tap payment"));
        }

        return {
            success: true,
            data,
            message: data?.message || "Payment confirmed successfully",
        };
    } catch (error) {
        console.error("Confirm Tap date charge error:", error);
        return {
            success: false,
            error: error.message || "Failed to confirm Tap payment",
        };
    }
}

export async function createTapSubscriptionCharge(
    planId,
    token,
    { source = "src_card", customer } = {},
) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const resolvedPlanId = planId?.id || planId;
        if (!resolvedPlanId) {
            throw new Error("Missing subscription plan");
        }

        const tapConfig = await fetchTapConfig(token);
        if (!tapConfig.success) {
            throw new Error(tapConfig.error || "Failed to load Tap configuration");
        }

        const resolvedCustomer = {
            firstName: String(customer?.firstName || "").trim(),
            lastName: String(customer?.lastName || "").trim(),
            phoneCountryCode: String(customer?.phoneCountryCode || "").replace(
                /\D/g,
                "",
            ),
            phoneNumber: String(customer?.phoneNumber || "").replace(/\D/g, ""),
        };

        if (
            !resolvedCustomer.firstName ||
            !resolvedCustomer.lastName ||
            !resolvedCustomer.phoneCountryCode ||
            !resolvedCustomer.phoneNumber
        ) {
            throw new Error(
                "Your name and mobile number are required to subscribe with Tap.",
            );
        }

        const { response } = await fetchWithAuthRetry(
            "/api/payments/subscriptions/tap/create",
            {
                method: "POST",
                token,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    planId: resolvedPlanId,
                    paymentMethod: "tap",
                    source: source || "src_card",
                    customer: resolvedCustomer,
                }),
            },
        );

        const data = await parseResponseBody(response);

        if (!response.ok) {
            throw new Error(
                toErrorMessage(data, "Failed to start Tap subscription"),
            );
        }

        const approvalUrl = normalizeApprovalUrl(data);
        if (!approvalUrl) {
            throw new Error("Tap approval URL was not returned");
        }

        return {
            success: true,
            chargeId: data?.chargeId || data?.id || null,
            approvalUrl,
            status: data?.status || "INITIATED",
            tapConfig: tapConfig.data,
            data,
        };
    } catch (error) {
        console.error("Create Tap subscription charge error:", error);
        return {
            success: false,
            error: error.message || "Failed to start Tap subscription",
        };
    }
}

export async function captureTapSubscriptionCharge(chargeId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        if (!chargeId) {
            throw new Error("Missing Tap charge id");
        }

        const { response } = await fetchWithAuthRetry(
            "/api/payments/subscriptions/tap/confirm",
            {
                method: "POST",
                token,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chargeId }),
            },
        );

        const data = await parseResponseBody(response);

        if (!response.ok) {
            throw new Error(
                toErrorMessage(data, "Failed to confirm Tap subscription"),
            );
        }

        return {
            success: true,
            data,
            message: data?.message || "Subscription confirmed successfully",
        };
    } catch (error) {
        console.error("Confirm Tap subscription charge error:", error);
        return {
            success: false,
            error: error.message || "Failed to confirm Tap subscription",
        };
    }
}
