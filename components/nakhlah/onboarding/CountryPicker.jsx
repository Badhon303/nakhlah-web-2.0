"use client";

import { useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import labels from "react-phone-number-input/locale/en";
import flags from "react-phone-number-input/flags";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const COUNTRY_OPTIONS = getCountries()
  .map((code) => ({
    code,
    name: labels[code],
    callingCode: getCountryCallingCode(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const getCountryName = (countryCode) => labels[countryCode] || "";

export const getCountryCodeByName = (countryName) => {
  if (!countryName) return "";
  const normalized = countryName.trim().toLowerCase();
  return (
    COUNTRY_OPTIONS.find((country) => country.name.toLowerCase() === normalized)
      ?.code || ""
  );
};

export function CountryFlag({ countryCode, className }) {
  const Flag = flags[countryCode];
  return Flag ? (
    <Flag
      className={cn("h-4 w-6 shrink-0 rounded-[3px] object-cover", className)}
    />
  ) : (
    <Globe2
      className={cn("h-4 w-6 shrink-0 text-muted-foreground", className)}
    />
  );
}

export function CountryPicker({
  value,
  onChange,
  placeholder = "Select a country",
  showCallingCode = false,
  showCallingCodeInList = true,
  disabled = false,
  hasError = false,
  variant = "bordered",
  className,
  triggerClassName,
}) {
  const [open, setOpen] = useState(false);
  const selectedCountry = COUNTRY_OPTIONS.find(
    (country) => country.code === value,
  );
  const isEmbedded = variant === "embedded";

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "flex h-12 items-center gap-2 px-4 text-base ring-offset-background transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            isEmbedded
              ? "shrink-0 bg-transparent hover:bg-muted/40"
              : cn(
                  "w-full justify-between rounded-xl border bg-background hover:border-accent",
                  hasError
                    ? "border-destructive"
                    : "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                ),
            triggerClassName,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {selectedCountry ? (
              <CountryFlag countryCode={selectedCountry.code} />
            ) : (
              <Globe2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span
              className={cn(
                "truncate text-left",
                isEmbedded && "font-semibold",
              )}
            >
              {selectedCountry
                ? showCallingCode
                  ? `+${selectedCountry.callingCode}`
                  : selectedCountry.name
                : placeholder}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className={cn(
          "w-[var(--radix-popover-trigger-width)] min-w-[300px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border-border p-0 shadow-lg",
          className,
        )}
      >
        <Command>
          <CommandInput
            placeholder={
              showCallingCodeInList
                ? "Search country or calling code..."
                : "Search country..."
            }
          />
          <CommandList className="max-h-[min(320px,55vh)]">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRY_OPTIONS.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code} +${country.callingCode}`}
                  onSelect={() => {
                    onChange(country.code);
                    setOpen(false);
                  }}
                  className="group cursor-pointer gap-3 rounded-lg py-2.5"
                >
                  <CountryFlag countryCode={country.code} />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {country.name}
                  </span>
                  {showCallingCodeInList ? (
                    <span className="text-xs text-muted-foreground transition-colors group-hover:text-accent-foreground group-data-[selected=true]:text-accent-foreground">
                      +{country.callingCode}
                    </span>
                  ) : null}
                  <Check
                    className={cn(
                      "h-4 w-4 text-accent",
                      value === country.code ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
