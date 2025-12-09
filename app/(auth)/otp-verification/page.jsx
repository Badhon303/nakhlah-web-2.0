"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/nakhlah/Mascot";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OTPVerificationPage() {
    const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = () => {
    setTimeLeft(120);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    // Call resend OTP API here
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleConfirm = () => {
    // Handle OTP verification logic
    console.log("OTP:", otp.join(""));
    router.push("create-new-password")
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-col items-center justify-center"
        >
          <Mascot mood="excited" size="xl" className="w-44 h-44 mb-6" />
          <h2 className="text-2xl font-bold text-foreground text-center max-w-md">
            Check your inbox for the verification code!
          </h2>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-card rounded-3xl shadow-lg border border-border p-8">
            {/* Back Button */}
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 text-foreground hover:text-accent mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-extrabold text-foreground mb-2">
                  You&apos;ve got mail 📬
                </h1>
                <p className="text-muted-foreground">
                  We have sent the OTP verification code to your email address. Check your email and enter the code below
                </p>
              </motion.div>
            </div>

            {/* OTP Inputs */}
            <div className="space-y-6">
              <div className="flex gap-4 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-16 h-16 text-center text-2xl font-bold bg-background border-2 border-border rounded-xl focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                ))}
              </div>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn&apos;t receive email?
                </p>
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-sm text-accent hover:underline font-semibold"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="text-sm text-muted-foreground font-semibold">
                    You can resend code in {formatTime(timeLeft)}
                  </p>
                )}
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirm}
                className="w-full h-12 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
              >
                Confirm
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}