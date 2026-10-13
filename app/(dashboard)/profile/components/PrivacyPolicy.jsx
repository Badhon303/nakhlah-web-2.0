"use client";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import LexicalRenderer from "@/components/nakhlah/LexicalRenderer";
import { fetchLegalDocuments } from "@/services/api/globals";
import DocumentLoadingSkeleton from "@/components/nakhlah/DocumentLoadingSkeleton";

export default function PrivacyPolicyPage({ onBack }) {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await fetchLegalDocuments({ privacyPolicy: true });
      if (cancelled) return;
      if (result.success) {
        setContent(result.data?.privacyPolicy ?? null);
        setError(null);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    };
    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="rounded-none border-0 bg-transparent p-0 shadow-none lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:p-6 lg:shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
        </div>

        {/* Content */}
        {isLoading ? (
          <DocumentLoadingSkeleton />
        ) : error ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            <p>Failed to load content. Please try again later.</p>
          </div>
        ) : content ? (
          <div>
            <LexicalRenderer lexicalJson={content} />
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">
            <p>No content available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
