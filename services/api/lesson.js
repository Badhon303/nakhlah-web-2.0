const API_URL = process.env.NEXT_PUBLIC_API_URL;


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
