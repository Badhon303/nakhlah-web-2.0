"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import LexicalRenderer from "@/components/nakhlah/LexicalRenderer";
import { useHelpCenterStore } from "@/stores/useHelpCenterStore";
import { useSession } from "next-auth/react";
import { getSessionToken } from "@/lib/authUtils";

export default function PolicyDocumentPage({
  onBack,
  policyKey,
  title,
  standalone = false,
}) {
  const { data: session } = useSession();
  const helpCenterData = useHelpCenterStore((state) => state.data);
  const isLoading = useHelpCenterStore((state) => state.isLoading);
  const error = useHelpCenterStore((state) => state.error);
  const fetchHelpCenter = useHelpCenterStore((state) => state.fetchHelpCenter);
  const content = helpCenterData?.[policyKey] ?? null;

  useEffect(() => {
    fetchHelpCenter(getSessionToken(session));
  }, [session, fetchHelpCenter]);

  return (
    <div
      className={
        standalone
          ? "min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-8"
          : "max-w-2xl mx-auto"
      }
    >
      <div
        className={
          standalone
            ? "w-full max-w-3xl bg-card rounded-3xl border border-border shadow-lg p-5 md:p-6"
            : "bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
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

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-4 bg-muted/50 rounded animate-pulse"
                style={{ width: `${85 - (index % 5) * 5}%` }}
              />
            ))}
          </div>
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
