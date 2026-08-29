"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Camera, CheckCircle2 } from "lucide-react";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input/input";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { CountryPicker } from "@/components/nakhlah/onboarding/CountryPicker";
import { cn } from "@/lib/utils";
import { NAME_MAX_LENGTH } from "@/lib/validation";

const MAX_FILE_SIZE = 300 * 1024;

const toE164 = (value, defaultCountry) => {
  if (!value) return "";
  try {
    const parsed = parsePhoneNumber(value, defaultCountry || undefined);
    return parsed?.number || "";
  } catch {
    return "";
  }
};

export function ProfileInfoStep({
  fullName,
  contactNumber,
  countryCode,
  profilePicture,
  onChange,
}) {
  const [localName, setLocalName] = useState(fullName || "");
  const [localContact, setLocalContact] = useState(() =>
    toE164(contactNumber, countryCode),
  );
  const [localCountry, setLocalCountry] = useState(countryCode || "");
  const [localPicture, setLocalPicture] = useState(profilePicture || null);
  const [fileError, setFileError] = useState("");
  const [contactError, setContactError] = useState("");
  const [nameError, setNameError] = useState("");

  const previewUrl = useMemo(() => {
    if (!localPicture) return "";
    return URL.createObjectURL(localPicture);
  }, [localPicture]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const nextCountry = countryCode || "";
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setLocalCountry((currentCountry) =>
        currentCountry === nextCountry ? currentCountry : nextCountry,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  const validateContact = (value) =>
    value && !isValidPhoneNumber(value)
      ? "Enter a valid phone number for the selected country."
      : "";

  const handleContactChange = (value = "") => {
    setLocalContact(value);

    const error = value ? validateContact(value) : "";
    setContactError(error);

    if (value !== localContact || error !== contactError) {
      onChange({
        contactNumber: value,
        contactError: error,
      });
    }
  };

  const handleContactBlur = () => {
    const error = validateContact(localContact);
    setContactError(error);
    onChange({ contactError: error });
  };

  const handleCountryChange = (nextCountry) => {
    if (nextCountry === localCountry) return;

    setLocalCountry(nextCountry);
    const shouldResetContact = Boolean(
      localContact && nextCountry !== localCountry,
    );
    const nextContact = shouldResetContact ? "" : localContact;
    setLocalContact(nextContact);
    setContactError("");
    onChange({
      countryCode: nextCountry,
      contactNumber: nextContact,
      contactError: "",
    });
  };

  const handleNameChange = (value) => {
    setLocalName(value);

    let error = "";
    if (value.trim()) {
      if (value.trim().length < 2) {
        error = "Full name must be at least 2 characters.";
      } else if (value.trim().length > NAME_MAX_LENGTH) {
        error = `Full name must be under ${NAME_MAX_LENGTH} characters.`;
      }
    }
    setNameError(error);

    onChange({
      fullName: value,
      nameError: error,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setLocalPicture(null);
      setFileError("");
      onChange({ profilePicture: null, fileError: "" });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setLocalPicture(null);
      const error = "Profile picture must be below 300KB.";
      setFileError(error);
      onChange({ profilePicture: null, fileError: error });
      return;
    }

    setFileError("");
    setLocalPicture(file);
    onChange({ profilePicture: file, fileError: "" });
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-6 justify-center"
      >
        <FreshDateMascot mood="proud" size="xl" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Tell us about you
          </h1>
          <p className="text-muted-foreground">
            Add your profile details before we continue
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <div className="bg-card border border-border p-4 rounded-2xl">
          <label className="block text-sm text-muted-foreground mb-1">
            Full name
          </label>
          <Input
            value={localName}
            onChange={(e) => handleNameChange(e.target.value)}
            className={cn(
              "h-12 rounded-xl px-4",
              nameError &&
                "border-destructive focus-visible:ring-destructive/40",
            )}
            placeholder="Your full name"
          />
          {nameError ? (
            <p className="text-xs text-destructive mt-1">{nameError}</p>
          ) : null}
        </div>

        <div className="bg-card border border-border p-4 rounded-2xl">
          <label className="block text-sm text-muted-foreground mb-1">
            Contact number
          </label>
          <div
            className={cn(
              "flex items-stretch rounded-xl border bg-background ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              contactError
                ? "border-destructive focus-within:ring-destructive/40"
                : "border-input",
            )}
          >
            <CountryPicker
              value={localCountry}
              onChange={handleCountryChange}
              showCallingCode
              placeholder="Code"
              variant="embedded"
              triggerClassName="rounded-l-xl border-r border-input"
            />
            <PhoneInput
              country={localCountry || undefined}
              international={localCountry ? true : undefined}
              smartCaret={false}
              value={localContact || undefined}
              onChange={handleContactChange}
              onBlur={handleContactBlur}
              disabled={!localCountry}
              inputMode="tel"
              autoComplete="tel"
              aria-label="Contact number"
              className="flex h-12 min-w-0 flex-1 rounded-r-xl border-0 bg-transparent px-4 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder={
                localCountry ? "Phone number" : "Select a country code"
              }
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Choose the country code, then enter the rest of your number.
          </p>
          {contactError ? (
            <p className="text-xs text-destructive mt-1">{contactError}</p>
          ) : null}
        </div>

        <div className="bg-card border border-border p-4 rounded-2xl">
          <label className="block text-sm text-muted-foreground mb-2">
            Profile picture (optional)
          </label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:border-accent cursor-pointer transition-colors">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-semibold">Choose image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {localPicture ? (
              <span className="text-xs text-muted-foreground truncate max-w-[220px]">
                {localPicture.name}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Max size: 300KB
              </span>
            )}
          </div>

          {previewUrl ? (
            <div className="mt-3 flex items-center gap-3">
              <Image
                src={previewUrl}
                alt="Profile preview"
                className="w-14 h-14 rounded-xl object-cover border border-border"
                width={56}
                height={56}
              />
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready to upload
              </span>
            </div>
          ) : null}

          {fileError ? (
            <p className="text-xs text-destructive mt-2">{fileError}</p>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
