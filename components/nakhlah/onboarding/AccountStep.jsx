"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { cn } from "@/lib/utils";
import {
  EMAIL_REGEX,
  EMAIL_ERROR_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_ERROR_MESSAGE,
} from "@/lib/validation";

export function AccountStep({ email, password = "", onChange }) {
  const [localEmail, setLocalEmail] = useState(email || "");
  const [localPassword, setLocalPassword] = useState(password || "");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    onChange({ password: value, passwordError: error });
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
              "w-full px-4 py-3 rounded-xl border bg-transparent outline-none",
              emailError
                ? "border-destructive focus:ring-2 focus:ring-destructive/40"
                : "border-border",
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
          <input
            value={localPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-transparent outline-none",
              passwordError
                ? "border-destructive focus:ring-2 focus:ring-destructive/40"
                : "border-border",
            )}
            placeholder="Choose a secure password"
            type="password"
          />
          {passwordError ? (
            <p className="text-xs text-destructive mt-1">{passwordError}</p>
          ) : null}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            By continuing you agree to our{" "}
            <span className="text-foreground font-medium">Terms</span> and{" "}
            <span className="text-foreground font-medium">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
