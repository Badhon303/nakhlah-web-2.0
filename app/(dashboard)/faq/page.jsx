"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, Search } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getSessionToken } from "@/lib/authUtils";
import { fetchHelpCenter } from "@/services/api/globals";
import HighlightedText from "@/components/nakhlah/HighlightedText";
import DocumentLoadingSkeleton from "@/components/nakhlah/DocumentLoadingSkeleton";

export default function FaqPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = getSessionToken(session);
  const [faqs, setFaqs] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return undefined;
    let cancelled = false;

    const loadFaq = async () => {
      const result = await fetchHelpCenter({ faq: true }, token);
      if (cancelled) return;
      if (result.success) {
        setFaqs(result.data?.faq ?? []);
      }
      setIsLoading(false);
    };

    loadFaq();
    return () => {
      cancelled = true;
    };
  }, [status, token]);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase();
    return faqs.filter(
      (item) =>
        item.question?.toLowerCase().includes(q) ||
        item.answer?.toLowerCase().includes(q),
    );
  }, [faqs, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="w-full max-w-4xl rounded-none border-0 bg-transparent p-0 shadow-none lg:rounded-3xl lg:border lg:border-border lg:bg-card lg:p-6 lg:shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">FAQ</h1>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-muted/20 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
          />
        </div>

        {isLoading ? (
          <DocumentLoadingSkeleton />
        ) : filteredFaqs.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            {searchQuery
              ? "No FAQs match your search."
              : "No FAQs available at the moment."}
          </p>
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
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
                >
                  <span className="text-left font-medium text-foreground">
                    <HighlightedText text={faq.question} query={searchQuery} />
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
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
