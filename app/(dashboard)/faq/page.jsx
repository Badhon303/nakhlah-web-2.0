"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, ChevronLeft, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { getSessionToken } from "@/lib/authUtils";
import { useHelpCenterStore } from "@/stores/useHelpCenterStore";
import HighlightedText from "@/components/nakhlah/HighlightedText";
import DocumentLoadingSkeleton from "@/components/nakhlah/DocumentLoadingSkeleton";

export default function FaqPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const helpCenterData = useHelpCenterStore((state) => state.data);
  const isLoading = useHelpCenterStore((state) => state.isLoading);
  const fetchHelpCenter = useHelpCenterStore((state) => state.fetchHelpCenter);
  const faqs = helpCenterData?.faq ?? [];

  useEffect(() => {
    fetchHelpCenter(getSessionToken(session));
  }, [session, fetchHelpCenter]);

  const visibleFaqs = faqs;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-card rounded-3xl border border-border shadow-lg p-5 md:p-6"
      >
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
        ) : visibleFaqs.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No FAQs available at the moment.
          </p>
        ) : (
          <div className="space-y-2">
            {visibleFaqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="rounded-xl border border-border overflow-hidden"
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
      </motion.div>
    </div>
  );
}
