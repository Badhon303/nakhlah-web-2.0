"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import LexicalRenderer from "@/components/nakhlah/LexicalRenderer";
import { useLegalDocumentsStore } from "@/stores/useLegalDocumentsStore";
import { useSession } from "@/lib/auth-client";
import { getSessionToken } from "@/lib/authUtils";

export default function PolicyDocumentPage({
  onBack,
  policyKey,
  title,
  standalone = false,
}) {
  const { data: session } = useSession();
  const legalData = useLegalDocumentsStore((state) => state.data);
  const isLoading = useLegalDocumentsStore((state) => state.isLoading);
  const error = useLegalDocumentsStore((state) => state.error);
  const fetchLegalDocuments = useLegalDocumentsStore(
    (state) => state.fetchLegalDocuments,
  );
  const content = legalData?.[policyKey] ?? null;

  useEffect(() => {
    fetchLegalDocuments(getSessionToken(session));
  }, [session, fetchLegalDocuments]);

  return (
    <div className={"max-w-2xl mx-auto py-6"}>
      <div
        className={
          "w-full bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
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
