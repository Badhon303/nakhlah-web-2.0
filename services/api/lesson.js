const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchJourneyStructure(token) {
    try {
        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await fetch(
            `${API_URL}/api/globals/questionnaires/journey-structure`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

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

        const response = await fetch(
            `${API_URL}/api/globals/questionnaires/tasks/${taskId}/lessons`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

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
        const response = await fetch(
            `${API_URL}/api/globals/questionnaires/lessons/${lessonId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

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


export async function submitLessonCompletion(lessonId, score, token) {
    try {
        const response = await fetch(
            `${API_URL}/api/globals/questionnaires/lessons/${lessonId}/complete`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ score }),
            }
        );

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
