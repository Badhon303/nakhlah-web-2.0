"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import LexicalRenderer from "@/components/nakhlah/LexicalRenderer";
import { getSessionToken } from "@/lib/authUtils";
import { useAboutStore } from "@/stores/useAboutStore";

const SECTION_CONFIG = [
  { key: "about", title: "About" },
  { key: "jobVacancy", title: "Job Vacancy" },
  { key: "fees", title: "Fees" },
  { key: "developers", title: "Developers" },
  { key: "partners", title: "Partners" },
];

const hasTextContent = (node) => {
  if (!node) return false;
  if (typeof node.text === "string" && node.text.trim().length > 0) {
    return true;
  }
  if (Array.isArray(node.children)) {
    return node.children.some(hasTextContent);
  }
  return false;
};

const isRichText = (value) =>
  value?.root?.type === "root" && hasTextContent(value.root);

export default function AboutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const aboutData = useAboutStore((state) => state.data);
  const isLoading = useAboutStore((state) => state.isLoading);
  const fetchAbout = useAboutStore((state) => state.fetchAbout);

  useEffect(() => {
    fetchAbout(getSessionToken(session));
  }, [session, fetchAbout]);

  const sections = SECTION_CONFIG.filter((section) =>
    isRichText(aboutData?.[section.key]),
  );

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-card rounded-3xl border border-border shadow-lg p-5 md:p-6"
      >
        <div className="flex items-center gap-3 mb-7">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">About Nakhlah</h1>
        </div>

        <div className="flex justify-center mb-6">
          <FreshDateMascot size="xxl" mood="happy" />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-muted/40 rounded animate-pulse"
                style={{ width: `${90 - (i % 6) * 7}%` }}
              />
            ))}
          </div>
        ) : sections.length > 0 ? (
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.key}>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  {section.title}
                </h2>
                <LexicalRenderer
                  lexicalJson={aboutData[section.key]}
                  className="text-base"
                />
              </section>
            ))}

            {aboutData?.websiteUrl ? (
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Website
                </h2>
                <a
                  href={aboutData.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-border hover:bg-muted/40 text-sm font-medium transition-colors"
                >
                  Visit Nakhlah Website
                </a>
              </section>
            ) : null}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No about content available.
          </p>
        )}
      </motion.div>
    </div>
  );
}
