"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
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
          <div className="relative">
            <input
              value={localPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={cn(
                "w-full px-4 py-3 pr-12 rounded-xl border bg-transparent outline-none",
                passwordError
                  ? "border-destructive focus:ring-2 focus:ring-destructive/40"
                  : "border-border",
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
                "w-full px-4 py-3 pr-12 rounded-xl border bg-transparent outline-none",
                confirmPasswordError
                  ? "border-destructive focus:ring-2 focus:ring-destructive/40"
                  : "border-border",
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
            <span className="text-foreground font-medium">Terms</span> and{" "}
            <span className="text-foreground font-medium">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
