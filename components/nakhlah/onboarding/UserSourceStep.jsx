"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import Image from "next/image";

export function UserSourceStep({
  title,
  sources = [],
  userSource,
  onSelect,
  getMediaUrl,
}) {
  const [selectedSource, setSelectedSource] = useState(userSource || "");

  const handleSourceSelect = (value) => {
    setSelectedSource(value);
    onSelect({ userSource: value });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-6 justify-center"
      >
        <FreshDateMascot mood="thinking" size="xl" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground">
            Help us understand how you discovered Nakhlah
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {sources.map((option, index) => {
          const isSelected = selectedSource === option.id;
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSourceSelect(option.id)}
              className={cn(
                "relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300",
                "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "border-accent bg-accent/10 shadow-accent-glow"
                  : "border-border bg-card hover:border-primary",
              )}
            >
              <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 flex items-center justify-center">
                {option?.sourcePicture?.url ? (
                  <Image
                    src={getMediaUrl(option.sourcePicture.url)}
                    alt={option?.sourcePicture?.alt || option.sourceName}
                    className="w-full h-full object-contain"
                    width={48}
                    height={48}
                  />
                ) : (
                  <span className="text-2xl">🔗</span>
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "font-semibold text-sm",
                    isSelected ? "text-accent" : "text-foreground",
                  )}
                >
                  {option.sourceName}
                </p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                >
                  <svg
                    className="w-3 h-3 text-accent-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
