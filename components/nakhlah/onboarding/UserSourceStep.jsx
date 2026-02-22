"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mascot } from "../Mascot";
import { Facebook, Instagram, Twitter, Youtube, Users, Globe } from "lucide-react";

const socialMediaOptions = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "friend", label: "Friend", icon: Users },
  { value: "other", label: "Other", icon: Globe },
];

export function UserSourceStep({ userSource, contactNumber, onSelect }) {
  const [selectedSource, setSelectedSource] = useState(userSource || "");
  const [contact, setContact] = useState(contactNumber || "");

  const handleSourceSelect = (value) => {
    setSelectedSource(value);
    onSelect({ userSource: value, contactNumber: contact });
  };

  const handleContactChange = (value) => {
    setContact(value);
    onSelect({ userSource: selectedSource, contactNumber: value });
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-8 justify-center"
      >
        <Mascot mood="curious" size="md" className="" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            How did you find us?
          </h1>
          <p className="text-muted-foreground">
            Help us understand how you discovered Nakhlah
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="space-y-6"
      >
        {/* Social Media Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {socialMediaOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleSourceSelect(option.value)}
                className={`
                  p-4 rounded-2xl border-2 transition-all
                  ${
                    selectedSource === option.value
                      ? "border-accent bg-accent/10"
                      : "border-border bg-card hover:border-accent/50"
                  }
                `}
              >
                <Icon
                  className={`w-6 h-6 mx-auto mb-2 ${
                    selectedSource === option.value
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                />
                <p
                  className={`text-sm font-semibold ${
                    selectedSource === option.value
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
                  {option.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Contact Number Input */}
        <div className="bg-card border border-border p-4 rounded-2xl">
          <label className="block text-sm text-muted-foreground mb-1">
            Contact Number (Optional)
          </label>
          <input
            value={contact}
            onChange={(e) => handleContactChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-transparent outline-none"
            placeholder="+1 (555) 123-4567"
            type="tel"
          />
          <p className="text-xs text-muted-foreground mt-2">
            We'll only use this to send you important updates
          </p>
        </div>
      </motion.div>
    </div>
  );
}
