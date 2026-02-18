"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { CardMenuOptions } from "@/components/nakhlah/CardMenuOptions";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/store", label: "Store" },
  { href: "/tips", label: "Learning tips and guides" },
  { href: "/faq", label: "FAQ" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function ProfileSection() {
  const isSignedIn = true;
  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/login");
  };

  const menuOptions = [
    {
      label: "View Full Profile",
      onClick: () => router.push("/profile"),
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      {isSignedIn ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">Username</p>
                <p className="text-sm text-muted-foreground">Joined 2023</p>
              </div>
            </div>
            <CardMenuOptions options={menuOptions} />
          </div>
          <div className="mt-4">
            <h3 className="text-md font-semibold">Achievements</h3>
            <div className="flex space-x-2 mt-2">
              <span className="text-2xl">🏆</span>
              <span className="text-2xl">🏅</span>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h3 className="text-lg font-bold">
            Create a profile to save your progress!
          </h3>
          <div className="flex flex-col gap-2">
            <Button size="lg" className="w-full">
              Create a Profile
            </Button>
            <Button size="lg" variant="outline" className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      )}
      <div className="!mt-8 hidden lg:flex flex-wrap justify-center gap-x-4 gap-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-bold uppercase text-muted-foreground hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
