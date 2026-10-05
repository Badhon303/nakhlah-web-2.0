"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import LexicalRenderer from "@/components/nakhlah/LexicalRenderer";
import { useHelpCenterStore } from "@/stores/useHelpCenterStore";
import { useSession } from "@/lib/auth-client";
import { getSessionToken } from "@/lib/authUtils";
import DocumentLoadingSkeleton from "@/components/nakhlah/DocumentLoadingSkeleton";

export default function PolicyDocumentPage({
  onBack,
  policyKey,
  title,
  standalone = false,
}) {
  const { data: session, status } = useSession();
  const token = getSessionToken(session);
  const helpCenterData = useHelpCenterStore((state) => state.data);
  const isLoading = useHelpCenterStore((state) => state.isLoading);
  const error = useHelpCenterStore((state) => state.error);
  const fetchHelpCenter = useHelpCenterStore((state) => state.fetchHelpCenter);
  const content = helpCenterData?.[policyKey] ?? null;

  useEffect(() => {
    if (status === "loading") return;
    fetchHelpCenter(token);
  }, [status, token, fetchHelpCenter]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div
        className={
          standalone
            ? "w-full bg-card rounded-3xl border border-border shadow-lg pt-10 px-5 pb-5 md:pt-12 md:px-6 md:pb-6"
            : "w-full bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
        }
      >
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </div>

        {isLoading || (!helpCenterData && !error) ? (
          <DocumentLoadingSkeleton />
        ) : error ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Failed to load content. Please try again later.
          </div>
        ) : content ? (
          <LexicalRenderer lexicalJson={content} />
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No content available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
