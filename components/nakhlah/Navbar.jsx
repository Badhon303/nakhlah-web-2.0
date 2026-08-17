"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Crown, Home, Target, Trophy, User } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: "/icons/Home-Icon.127e8555.svg" },
  {
    path: "/leaderboard",
    label: "Leaderboard",
    icon: "/icons/LEADERBOARD.b7e283d4.svg",
  },
  { path: "/challenge", label: "Challenges", icon: "/icons/Lesson.svg" },
  { path: "/store", label: "Store", icon: "/icons/STORE.9b24d09f.svg" },
  { path: "/profile", label: "Profile", icon: "/icons/Profile.f8f9b305.svg" },
];

const mobileIconMap = {
  "/": Home,
  "/leaderboard": Trophy,
  "/store": Crown,
  "/profile": User,
  "/challenge": Target,
};

export function Navbar() {
  const pathname = usePathname();

  // /settings renders the profile shell, so keep Profile highlighted there.
  const isNavItemActive = (path) =>
    pathname === path || (path === "/profile" && pathname === "/settings");

  const handleNavClick = (event, path) => {
    if (
      pathname === path &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-64 border-r border-border/50 bg-background/95 backdrop-blur-md p-6 overflow-y-auto">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link
            href="/"
            onClick={(event) => handleNavClick(event, "/")}
            className="flex w-full items-center justify-center"
          >
            <Image
              src="/Nakhlah_Logo.webp"
              alt="Nakhlah logo"
              width={80}
              height={80}
              className="h-20 w-20 rounded-lg object-cover"
              priority
            />
          </Link>

          {/* Nav Links */}
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item.path);
              const NavIcon = mobileIconMap[item.path];
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={(event) => handleNavClick(event, item.path)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all",
                    isActive
                      ? "text-accent"
                      : "text-foreground hover:bg-muted/50 dark:hover:bg-muted/20",
                  )}
                >
                  {NavIcon ? (
                    <NavIcon className="h-6 w-6" />
                  ) : (
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t px-2 bg-background/95 backdrop-blur-md border-border pb-[var(--sab)]">
        <div className="flex items-center justify-between gap-1">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item.path);
            const MobileIcon = mobileIconMap[item.path];
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={(event) => handleNavClick(event, item.path)}
                className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-all min-w-0 text-foreground hover:bg-muted/50 dark:hover:bg-transparent"
              >
                <span
                  className={cn(
                    "flex items-center justify-center p-2 rounded-xl transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground dark:bg-transparent dark:text-accent"
                      : "",
                  )}
                >
                  {MobileIcon ? (
                    <MobileIcon className="h-5 w-5" />
                  ) : (
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={24}
                      height={24}
                      className="h-5 w-5"
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium truncate w-full text-center",
                    isActive ? "text-accent" : "",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
