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

export async function claimGiftBoxTask(taskId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry(`/api/globals/questionnaires/gift-box/${taskId}`, {
            method: "GET",
            token,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || data?.message || "Failed to claim gift box");
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Claim gift box error:", error);
        return {
            success: false,
            error: error.message || "Unable to claim gift box",
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

export async function fetchTaskExamQuestions(taskId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry(`/api/globals/questionnaires/tasks/${taskId}/exam-questions`, {
            method: "GET",
            token,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Failed to load exam questions");
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Fetch task exam questions error:", error);
        return {
            success: false,
            error: error.message || "Unable to load exam questions",
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

export async function reportFullMarks(lessonId, token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry(`/api/globals/questionnaires/full-marks/${lessonId}`, {
            method: "GET",
            token,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data?.error || data?.message || "Failed to submit full marks");
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Report full marks error:", error);
        return {
            success: false,
            error: error.message || "Unable to submit full marks",
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

function normalizeBadgesPayload(payload) {
    const badgesObject = payload?.badges || payload?.data?.badges || payload || {};

    if (!badgesObject || typeof badgesObject !== "object" || Array.isArray(badgesObject)) {
        return [];
    }

    return Object.entries(badgesObject)
        .map(([key, value]) => ({
            key,
            target: Number(value?.target) || 0,
            icon: value?.icon || null,
        }))
        .sort((a, b) => a.target - b.target);
}

function normalizeAchievementsPayload(payload) {
    const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.docs)
                ? payload.docs
                : [];

    return list.map((item) => ({
        id: item?.id,
        title: item?.title || "",
        unitIcon: item?.unitIcon || null,
        unitDescription: item?.unitDescription || null,
        levelOrder: Number(item?.levelOrder) || 0,
        unitOrder: Number(item?.unitOrder) || 0,
        achievementTitle: item?.achievementTitle || "",
        achieved: Boolean(item?.achieved),
    }));
}

function normalizeDailyQuestPayload(payload) {
    const dailyQuestObject = payload?.dailyQuest || payload?.data?.dailyQuest || {};

    if (!dailyQuestObject || typeof dailyQuestObject !== "object" || Array.isArray(dailyQuestObject)) {
        return [];
    }

    return Object.entries(dailyQuestObject).map(([key, value]) => ({
        key,
        required: Number(value?.required) || 0,
        reward: Number(value?.reward) || 0,
        icon: value?.icon || null,
    }));
}

export async function fetchGamificationBadges(token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry("/api/globals/gamification?select[badges]=true", {
            method: "GET",
            token,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data?.message || "Failed to load badges");
        }

        return {
            success: true,
            badges: normalizeBadgesPayload(data),
            data,
        };
    } catch (error) {
        console.error("Fetch gamification badges error:", error);
        return {
            success: false,
            error: error.message || "Unable to load badges",
        };
    }
}

export async function fetchQuestionnaireAchievements(token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry("/api/globals/questionnaires/get-achievements", {
            method: "GET",
            token,
        });

        const data = await response.json().catch(() => ([]));

        if (!response.ok) {
            throw new Error(data?.message || "Failed to load achievements");
        }

        return {
            success: true,
            achievements: normalizeAchievementsPayload(data),
            data,
        };
    } catch (error) {
        console.error("Fetch questionnaire achievements error:", error);
        return {
            success: false,
            error: error.message || "Unable to load achievements",
        };
    }
}

export async function fetchGamificationDailyQuest(token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetchWithAuthRetry("/api/globals/gamification?select[dailyQuest]=true", {
            method: "GET",
            token,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data?.message || "Failed to load daily quests");
        }

        return {
            success: true,
            dailyQuest: normalizeDailyQuestPayload(data),
            data,
        };
    } catch (error) {
        console.error("Fetch gamification daily quest error:", error);
        return {
            success: false,
            error: error.message || "Unable to load daily quests",
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
