"use client";
import { ChevronLeft, ChevronDown, Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { getSessionToken } from "@/lib/authUtils";
import { useHelpCenterStore } from "@/stores/useHelpCenterStore";
import HighlightedText from "@/components/nakhlah/HighlightedText";
import DocumentLoadingSkeleton from "@/components/nakhlah/DocumentLoadingSkeleton";

export default function HelpCenterPage({ onBack }) {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const token = getSessionToken(session);
  const helpCenterData = useHelpCenterStore((state) => state.data);
  const isLoading = useHelpCenterStore((state) => state.isLoading);
  const error = useHelpCenterStore((state) => state.error);
  const fetchHelpCenter = useHelpCenterStore((state) => state.fetchHelpCenter);
  const faqs = helpCenterData?.faq ?? [];

  useEffect(() => {
    if (status === "loading") return;
    fetchHelpCenter(token);
  }, [status, token, fetchHelpCenter]);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question?.toLowerCase().includes(q) ||
        f.answer?.toLowerCase().includes(q),
    );
  }, [faqs, searchQuery]);

  const showLoading = isLoading || (!helpCenterData && !error);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="w-full bg-transparent p-0 lg:rounded-3xl lg:border lg:border-border lg:bg-card lg:p-6 lg:shadow-lg">
        <div className="mb-6 flex items-center gap-3 md:mb-7">
          <button
            onClick={onBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/20 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {showLoading && !searchQuery ? (
          <DocumentLoadingSkeleton />
        ) : filteredFaqs.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {searchQuery
              ? "No FAQs match your search."
              : "No FAQs available at the moment."}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFaqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="overflow-hidden rounded-xl border border-border"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between p-4 transition-all hover:bg-muted/50"
                >
                  <span className="text-left font-medium text-foreground">
                    <HighlightedText text={faq.question} query={searchQuery} />
                  </span>
                  <ChevronDown
                    className={`ml-2 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                    <HighlightedText text={faq.answer} query={searchQuery} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
