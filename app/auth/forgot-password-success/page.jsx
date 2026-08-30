"use client";

import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto text-center"
      >
        <div className="bg-transparent lg:bg-card rounded-none lg:rounded-3xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-8">
          {/* Mascot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <FreshDateMascot mood="happy" size="xxxl" />
          </motion.div>

          {/* Icon + Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-6"
          >
            {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
              <MailCheck className="w-8 h-8 text-accent" />
            </div> */}
            <h1 className="text-3xl font-extrabold text-foreground mb-3">
              Check your email
            </h1>
            <p className="text-lg text-muted-foreground">
              Congratulations! We have sent a password reset link to the email
              address associated with your account.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              You can close this page and check your inbox. If you don&apos;t
              see the email, please check your spam or junk folder.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-8"
          >
            <Link
              href="/auth/login"
              className="text-sm text-accent hover:underline font-semibold"
            >
              Back to Login
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
