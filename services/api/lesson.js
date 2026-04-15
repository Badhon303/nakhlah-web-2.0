import { fetchCurrentUser, refreshAccessToken } from "./auth";
import { buildApiUrl } from "@/lib/api-config";

const withApiUrl = (path) => buildApiUrl(path);

async function fetchWithAuthRetry(path, { method = "GET", token, body } = {}) {
    const endpoint = withApiUrl(path);

    const execute = (accessToken) =>
        fetch(endpoint, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            ...(body !== undefined ? { body } : {}),
            credentials: "include",
        });

    let response = await execute(token);

    if (response.status !== 401) {
        return response;
    }

    const refreshed = await refreshAccessToken(token);
    if (!refreshed.success) {
        return response;
    }

    const me = await fetchCurrentUser(refreshed.token || token);
    const retriedToken = me.success ? me.token : refreshed.token || token;

    if (!retriedToken) {
        return response;
    }

    response = await execute(retriedToken);
    return response;
}

export async function fetchJourneyStructure(token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry("/api/globals/questionnaires/journey-structure", {
            method: "GET",
            token,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Failed to load journey structure");
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Fetch journey structure error:", error);
        return {
            success: false,
            error: error.message || "Unable to load journey structure",
        };
    }
}

export async function fetchTaskLessons(taskId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry(`/api/globals/questionnaires/tasks/${taskId}/lessons`, {
            method: "GET",
            token,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Failed to load task lessons");
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Fetch task lessons error:", error);
        return {
            success: false,
            error: error.message || "Unable to load task lessons",
        };
    }
}


export async function fetchLessonQuestions(lessonId, token) {
    try {
        const response = await fetchWithAuthRetry(`/api/globals/questionnaires/lessons/${lessonId}`, {
            method: "GET",
            token,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Failed to load lesson");
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Fetch lesson error:", error);
        return {
            success: false,
            error: error.message || "Unable to load lesson",
        };
    }
}

export async function makeLearnerProgress(lessonId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry(`/api/globals/questionnaires/make-learner-progress/${lessonId}`, {
            method: "GET",
            token,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data?.message || "Failed to update learner progress");
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Make learner progress error:", error);
        return {
            success: false,
            error: error.message || "Unable to update learner progress",
        };
    }
}

export async function reportWrongAnswer(token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry("/api/globals/questionnaires/wrong-answer", {
            method: "GET",
            token,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data?.message || "Failed to record wrong answer");
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Report wrong answer error:", error);
        return {
            success: false,
            error: error.message || "Unable to record wrong answer",
        };
    }
}


export async function submitLessonCompletion(lessonId, score, token) {
    try {
        const response = await fetchWithAuthRetry(`/api/globals/questionnaires/lessons/${lessonId}/complete`, {
            method: "POST",
            token,
            body: JSON.stringify({ score }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Failed to submit lesson");
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Submit lesson error:", error);
        return {
            success: false,
            error: error.message || "Unable to submit lesson",
        };
    }
}
