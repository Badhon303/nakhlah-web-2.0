"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import LexicalRenderer from "@/components/nakhlah/LexicalRenderer";
import { useLegalDocumentsStore } from "@/stores/useLegalDocumentsStore";
import { useSession } from "next-auth/react";
import { getSessionToken } from "@/lib/authUtils";
import DocumentLoadingSkeleton from "@/components/nakhlah/DocumentLoadingSkeleton";

export default function PrivacyPolicyPage({ onBack }) {
  const { data: session } = useSession();
  const legalData = useLegalDocumentsStore((state) => state.data);
  const isLoading = useLegalDocumentsStore((state) => state.isLoading);
  const error = useLegalDocumentsStore((state) => state.error);
  const fetchLegalDocuments = useLegalDocumentsStore(
    (state) => state.fetchLegalDocuments,
  );
  const content = legalData?.privacyPolicy ?? null;

  useEffect(() => {
    fetchLegalDocuments(getSessionToken(session));
  }, [session, fetchLegalDocuments]);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
      >
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <LexicalRenderer lexicalJson={content} />
          </motion.div>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">
            <p>No content available at the moment.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
