"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Trophy, User, BarChart3 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { StreakCounter } from "./StreakCounter";
import { motion } from "framer-motion";
import { Flame } from "@/components/icons/Flame";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/challenge", label: "Challenges", icon: BookOpen },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/stats", label: "Stats", icon: BarChart3 },
  { path: "/profile", label: "Profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur-md px-6 overflow-x-hidden">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Nakhlah</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-xl bg-accent/10 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StreakCounter count={7} />
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile Top Floating Section */}
      <div className="md:hidden fixed top-16 right-4 z-50 flex flex-col items-center gap-3">
        {/* <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-500/10 blur-xl rounded-full" />
          <div className="relative w-12 h-12 bg-card/80 backdrop-blur-md border border-orange-500/20 rounded-full flex items-center justify-center shadow-lg">
            <Flame size="md" className="text-orange-500" />
          </div>
        </motion.div> */}
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-accent/10 blur-xl rounded-full" />
          <div className="relative w-12 h-12 bg-card/80 backdrop-blur-md border border-accent/20 rounded-full flex items-center justify-center shadow-lg">
            <ThemeToggle variant="icon" />
          </div>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors",
                  isActive ? "text-accent" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}