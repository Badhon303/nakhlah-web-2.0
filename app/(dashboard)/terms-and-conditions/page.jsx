"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { fetchLegalDocuments } from "@/services/api/globals";
import LexicalRenderer from "@/components/nakhlah/LexicalRenderer";
import DocumentLoadingSkeleton from "@/components/nakhlah/DocumentLoadingSkeleton";

export default function TermsAndConditionsRoutePage() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await fetchLegalDocuments({ termsAndConditions: true });
      if (cancelled) return;
      if (result.success) {
        setContent(result.data?.termsAndConditions ?? null);
      }
      setIsLoading(false);
    };
    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-lg md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {/* <FileText className="w-5 h-5 text-blue-500" /> */}
            <h1 className="text-3xl font-bold text-foreground">
              Terms &amp; Conditions
            </h1>
          </div>
        </div>

        {isLoading ? (
          <DocumentLoadingSkeleton />
        ) : content ? (
          <LexicalRenderer lexicalJson={content} className="text-base" />
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No content available.
          </p>
        )}
      </div>
    </div>
  );
}


