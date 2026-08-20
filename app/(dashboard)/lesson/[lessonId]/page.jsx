"use client";

import { useParams } from "next/navigation";
import LessonPage from "../page";

export default function LessonWithIdPage() {
  const params = useParams();
  const lessonId = Array.isArray(params?.lessonId)
    ? params.lessonId[0]
    : params?.lessonId || "";

  return <LessonPage routeLessonId={decodeURIComponent(lessonId)} />;
}
