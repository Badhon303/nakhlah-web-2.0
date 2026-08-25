"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import LogoAnimation from "@/components/icons/Logo";
import { useRouter } from "next/navigation";
import { toast } from "@/components/nakhlah/Toast";
import { useProfileStore } from "@/stores/useProfileStore";

export default function Login() {
  const router = useRouter();
  const clearProfile = useProfileStore((state) => state.clear);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartLearning = async () => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: "guest01@example.com",
        password: "123456",
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Login failed");
        return;
      }

      if (result?.ok) {
        clearProfile();
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center text-center gap-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LogoAnimation className="w-56" />
        </motion.div>

        <p className="text-xl text-muted-foreground max-w-md">
          Learn languages whenever and wherever you want
        </p>

        <Button
          onClick={handleStartLearning}
          disabled={isLoading}
          className="w-full h-12 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
        >
          {isLoading ? "STARTING..." : "START LEARNING"}
        </Button>
      </motion.div>
    </div>
  );
}
