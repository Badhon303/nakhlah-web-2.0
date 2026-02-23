"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mascot } from "../Mascot";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function AccountStep({ name, age, email, ageOptions = [], onChange }) {
  const [localName, setLocalName] = useState(name || "");
  const [localAge, setLocalAge] = useState(age || "");
  const [localEmail, setLocalEmail] = useState(email || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    onChange({
      name: localName,
      age: localAge,
      email: localEmail,
      password,
    });
  }, [localName, localAge, localEmail, password, onChange]);

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-8 justify-center"
      >
        <Mascot mood="happy" size="md" className="" />
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
            What is your name?
          </label>
          <input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-transparent outline-none"
            placeholder="Jane Doe"
          />
        </div>

        <div className="bg-card border border-border p-4 rounded-2xl grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              How old are you?
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-transparent outline-none flex items-center justify-between hover:border-accent/50"
                >
                  <span className={localAge ? "text-foreground" : "text-muted-foreground"}>
                    {localAge || "Select age range"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                {ageOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => setLocalAge(option.ageTitle)}
                    className="cursor-pointer"
                  >
                    {option.ageTitle}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Email
            </label>
            <input
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent outline-none"
              placeholder="you@example.com"
              type="email"
            />
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-2xl">
          <label className="block text-sm text-muted-foreground mb-1">
            Create a password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-transparent outline-none"
            placeholder="Choose a secure password"
            type="password"
          />
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
