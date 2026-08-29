"use client";

import { motion } from "framer-motion";
import { Check, Globe2, MapPin } from "lucide-react";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import {
  CountryFlag,
  COUNTRY_OPTIONS,
  CountryPicker,
} from "@/components/nakhlah/onboarding/CountryPicker";
import { cn } from "@/lib/utils";

const FEATURED_COUNTRY_CODES = [
  "BD",
  "IN",
  "PK",
  "SA",
  "AE",
  "MY",
  "ID",
  "TR",
  "US",
  "GB",
];

export function CountryStep({ title, selectedCountry, onSelect }) {
  const featuredCountries = FEATURED_COUNTRY_CODES.map((code) =>
    COUNTRY_OPTIONS.find((country) => country.code === code),
  ).filter(Boolean);

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center justify-center gap-6"
      >
        <FreshDateMascot mood="happy" size="xl" />
        <div>
          <h1 className="mb-3 text-3xl font-extrabold text-foreground md:text-4xl">
            {title || "Where are you from?"}
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a country to personalize your journey
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-foreground">Popular choices</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Select one or browse the full list
            </p>
          </div>
          {/* <Globe2 className="h-5 w-5 text-accent" /> */}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {featuredCountries.map((country, index) => {
            const isSelected = selectedCountry === country.code;
            return (
              <motion.button
                key={country.code}
                type="button"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * index }}
                onClick={() => onSelect(country.code)}
                className={cn(
                  "relative flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-2 text-center transition-all duration-300",
                  "hover:scale-[1.02] hover:border-primary hover:shadow-md active:scale-[0.98]",
                  isSelected
                    ? "border-accent bg-accent/10 shadow-accent-glow"
                    : "border-border bg-background",
                )}
              >
                <CountryFlag countryCode={country.code} className="h-8 w-10" />
                <span
                  className={cn(
                    "line-clamp-1 text-xs font-bold",
                    isSelected ? "text-accent" : "text-foreground",
                  )}
                >
                  {country.name}
                </span>
                {isSelected ? (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                    <Check className="h-3 w-3 text-accent-foreground" />
                  </span>
                ) : null}
              </motion.button>
            );
          })}
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Or browse all countries
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-accent" />
          Search every country
        </label>
        <CountryPicker value={selectedCountry} onChange={onSelect} />
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Search by country name or international calling code.
        </p>
      </motion.div>
    </div>
  );
}
