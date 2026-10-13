"use client";
import { useEffect, useLayoutEffect } from "react";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import LexicalRenderer from "@/components/nakhlah/LexicalRenderer";
import { useAboutStore } from "@/stores/useAboutStore";
import { useSession } from "@/lib/auth-client";
import { getSessionToken } from "@/lib/authUtils";
import DocumentLoadingSkeleton from "@/components/nakhlah/DocumentLoadingSkeleton";

let aboutScrollToRestore = null;

function rememberAboutScroll() {
  aboutScrollToRestore = window.scrollY || document.documentElement.scrollTop || 0;
}

function openFromAbout(onNavigate, view) {
  rememberAboutScroll();
  onNavigate?.(view);
}

export default function AboutNakhlahPage({
  onBack,
  onNavigate,
  showNavigationItems = true,
}) {
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

  useLayoutEffect(() => {
    if (aboutScrollToRestore == null) return undefined;

    const restore = (finalPass) => {
      if (aboutScrollToRestore == null) return;
      const y = aboutScrollToRestore;
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const contentReady = !isLoading && (aboutData || error);
      if (y > maxScroll + 8 && !contentReady) return;
      window.scrollTo(0, Math.min(y, maxScroll));
      if (finalPass) aboutScrollToRestore = null;
    };

    restore(false);
    const frame = requestAnimationFrame(() => restore(false));
    const timer = window.setTimeout(() => restore(true), 0);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [aboutData, error, isLoading]);

  const aboutItems = [
    ...(showNavigationItems
      ? [
          {
            label: "Terms & Conditions",
            action: () => openFromAbout(onNavigate, "terms-and-conditions"),
          },
          {
            label: "Privacy Policy",
            action: () => openFromAbout(onNavigate, "privacy-policy"),
          },
          {
            label: "Payment & Subscription Policy",
            action: () =>
              openFromAbout(onNavigate, "payment-subscription-policy"),
          },
          {
            label: "Refund & Cancellation Policy",
            action: () =>
              openFromAbout(onNavigate, "refund-cancellation-policy"),
          },
        ]
      : []),
    ...(aboutData?.websiteUrl
      ? [
          {
            label: "Visit Our Website",
            action: () =>
              window.open(
                aboutData.websiteUrl,
                "_blank",
                "noopener,noreferrer",
              ),
            external: true,
          },
        ]
      : []),
  ];

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
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              About Nakhlah
            </h1>
          </div>
        </div>

        {/* Mascot Logo */}
        <div className="flex justify-center mb-6">
          <div className="rounded-2xl flex items-center justify-center">
            <FreshDateMascot mood="happy" size="xxl" />
          </div>
        </div>

        {/* App Info */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Nakhlah v2.0.0
          </h2>
          <p className="text-sm text-muted-foreground">
            Learn Arabic with fun and ease
          </p>
        </div>

        {/* About Content */}
        {isLoading || (!aboutData && !error) ? (
          <div className="mb-8 px-1">
            <DocumentLoadingSkeleton />
          </div>
        ) : aboutData?.about ? (
          <div className="mb-8 px-1">
            <LexicalRenderer lexicalJson={aboutData.about} />
          </div>
        ) : null}

        {/* Navigation Items */}
        {aboutItems.length > 0 && (
          <div className="space-y-1">
            {aboutItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="group flex w-full items-center justify-between rounded-lg p-4 transition-all hover:bg-muted/50"
              >
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
                {item.external ? (
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
