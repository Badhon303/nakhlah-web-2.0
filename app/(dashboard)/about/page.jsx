"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import LexicalRenderer from "@/components/nakhlah/LexicalRenderer";
import { getSessionToken } from "@/lib/authUtils";
import { useAboutStore } from "@/stores/useAboutStore";
import DocumentLoadingSkeleton from "@/components/nakhlah/DocumentLoadingSkeleton";

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
  const { data: session, status } = useSession();
  const token = getSessionToken(session);
  const aboutData = useAboutStore((state) => state.data);
  const isLoading = useAboutStore((state) => state.isLoading);
  const error = useAboutStore((state) => state.error);
  const fetchAbout = useAboutStore((state) => state.fetchAbout);

  useEffect(() => {
    if (status === "loading") return;
    fetchAbout(token);
  }, [status, token, fetchAbout]);

  const sections = SECTION_CONFIG.filter((section) =>
    isRichText(aboutData?.[section.key]),
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="w-full max-w-4xl rounded-3xl border border-border bg-card p-5 shadow-lg md:p-6">
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

        {isLoading || (!aboutData && !error) ? (
          <DocumentLoadingSkeleton />
        ) : sections.length > 0 ? (
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.key}>
                {/* <h2 className="text-xl font-semibold text-foreground mb-3">
                  {section.title}
                </h2> */}
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
      </div>
    </div>
  );
}
