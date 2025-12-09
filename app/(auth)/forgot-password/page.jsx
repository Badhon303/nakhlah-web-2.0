"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mascot } from "@/components/nakhlah/Mascot";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
const router = useRouter()
  const handleContinue = () => {
    router.push("/otp-verification");
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
          <Mascot mood="thinking" size="xl" className="w-44 h-44 mb-6" />
          <h2 className="text-2xl font-bold text-foreground text-center max-w-md">
            Don&apos;t worry, we&apos;ll help you reset your password!
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
              href="/login"
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
                  Forgot Password 🔑
                </h1>
                <p className="text-muted-foreground">
                  Enter your email address to get an OTP code to reset your password
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="andrew.ainsley@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background border-border text-foreground"
                />
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                className="w-full h-12 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
              >
                Continue
              </Button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}