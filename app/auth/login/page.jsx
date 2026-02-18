"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mascot } from "@/components/nakhlah/Mascot";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/nakhlah/Toast";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Login failed");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Login successful!");
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
    <div className="min-h-screen bg-background flex items-start sm:items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Maskot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-col items-center justify-center"
        >
          <Mascot mood="happy" size="xxxl" className="mb-6" />
          <h2 className="text-4xl font-black text-accent mb-2">Nakhlah</h2>
          <p className="text-xl text-muted-foreground text-center max-w-md">
            Learn languages whenever and wherever you want
          </p>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto pt-6 lg:pt-0"
        >
          <div className="bg-transparent lg:bg-card rounded-none lg:rounded-3xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-8">
            <div className="mb-6">
              {/* Back button only on mobile */}
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Back</span>
              </button>
            </div>

            {/* Header */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-extrabold text-foreground mb-2">
                  Hello there 👋
                </h1>
                <p className="text-muted-foreground">
                  Welcome back! Please sign in to continue
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground font-semibold"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="andrew.ainsley@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background border-border text-foreground"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground font-semibold"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-background border-border text-foreground pr-12"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-foreground cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-accent hover:underline font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <div className="hidden sm:block">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
                >
                  {isLoading ? "SIGNING IN..." : "SIGN IN"}
                </Button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/get-started"
                  className="text-accent hover:underline font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
          {/* Mobile bottom action */}
          <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-background border-t border-border p-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
            >
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
