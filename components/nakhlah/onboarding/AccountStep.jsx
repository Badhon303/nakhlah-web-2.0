"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import PrivacyPolicyPage from "@/app/(dashboard)/profile/components/PrivacyPolicy";
import TermsAndConditionsPage from "@/app/(dashboard)/profile/components/TermsAndConditions";
import { cn } from "@/lib/utils";
import {
  EMAIL_REGEX,
  EMAIL_ERROR_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_ERROR_MESSAGE,
} from "@/lib/validation";

export function AccountStep({
  email,
  password = "",
  confirmPassword = "",
  onChange,
}) {
  const [localEmail, setLocalEmail] = useState(email || "");
  const [localPassword, setLocalPassword] = useState(password || "");
  const [localConfirmPassword, setLocalConfirmPassword] = useState(
    confirmPassword || "",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [openDocument, setOpenDocument] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!openDocument) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenDocument(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openDocument]);

  const openLegalDocument = (event, document) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    setOpenDocument(document);
  };

  const handleEmailChange = (value) => {
    setLocalEmail(value);
    const error = value && !EMAIL_REGEX.test(value) ? EMAIL_ERROR_MESSAGE : "";
    setEmailError(error);
    onChange({ email: value, emailError: error });
  };

  const handlePasswordChange = (value) => {
    setLocalPassword(value);
    const error =
      value && value.trim().length < PASSWORD_MIN_LENGTH
        ? PASSWORD_ERROR_MESSAGE
        : "";
    setPasswordError(error);
    const nextConfirmError =
      localConfirmPassword && localConfirmPassword !== value
        ? "Passwords do not match."
        : "";
    setConfirmPasswordError(nextConfirmError);
    onChange({
      password: value,
      passwordError: error,
      confirmPasswordError: nextConfirmError,
    });
  };

  const handleConfirmPasswordChange = (value) => {
    const error =
      value && value !== localPassword ? "Passwords do not match." : "";
    setLocalConfirmPassword(value);
    setConfirmPasswordError(error);
    onChange({
      confirmPassword: value,
      confirmPasswordError: error,
    });
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-6 justify-center"
      >
        <FreshDateMascot mood="thinking" size="xl" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Just a few details
          </h1>
          <p className="text-muted-foreground">
            We’ll use these to personalize your experience
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
            Email
          </label>
          <input
            value={localEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={cn(
              "h-12 w-full rounded-xl border bg-transparent px-4 outline-none",
              emailError
                ? "border-destructive focus:ring-2 focus:ring-destructive/40"
                : "border-input",
            )}
            placeholder="Put your email"
            type="email"
          />
          {emailError ? (
            <p className="text-xs text-destructive mt-1">{emailError}</p>
          ) : null}
        </div>

        <div className="bg-card border border-border p-4 rounded-2xl">
          <label className="block text-sm text-muted-foreground mb-1">
            Create a password
          </label>
          <div className="relative">
            <input
              value={localPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={cn(
                "h-12 w-full rounded-xl border bg-transparent px-4 pr-12 outline-none",
                passwordError
                  ? "border-destructive focus:ring-2 focus:ring-destructive/40"
                  : "border-input",
              )}
              placeholder="Choose a secure password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {passwordError ? (
            <p className="text-xs text-destructive mt-1">{passwordError}</p>
          ) : null}
        </div>

        <div className="bg-card border border-border p-4 rounded-2xl">
          <label className="block text-sm text-muted-foreground mb-1">
            Confirm password
          </label>
          <div className="relative">
            <input
              value={localConfirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              className={cn(
                "h-12 w-full rounded-xl border bg-transparent px-4 pr-12 outline-none",
                confirmPasswordError
                  ? "border-destructive focus:ring-2 focus:ring-destructive/40"
                  : "border-input",
              )}
              placeholder="Re-enter your password"
              type={showConfirmPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {confirmPasswordError ? (
            <p className="text-xs text-destructive mt-1">
              {confirmPasswordError}
            </p>
          ) : null}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            By continuing you agree to our{" "}
            <a
              href="/terms-and-conditions"
              className="text-foreground font-medium underline-offset-2 hover:underline"
              onClick={(event) => openLegalDocument(event, "terms")}
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-foreground font-medium underline-offset-2 hover:underline"
              onClick={(event) => openLegalDocument(event, "privacy")}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </motion.div>

      {isMounted && openDocument
        ? createPortal(
            <div className="fixed inset-0 z-[80] overflow-y-auto bg-background px-4">
              {openDocument === "privacy" ? (
                <PrivacyPolicyPage onBack={() => setOpenDocument(null)} />
              ) : (
                <TermsAndConditionsPage onBack={() => setOpenDocument(null)} />
              )}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
