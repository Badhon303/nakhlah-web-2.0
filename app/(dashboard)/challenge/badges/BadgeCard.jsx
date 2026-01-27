"use client";

import { ChevronRight } from "lucide-react";
import { HighVoltage } from "@/components/icons/High-Voltage";
import { GemStone } from "@/components/icons/Gem";
import { Bullseye } from "@/components/icons/BullsEye";
import { Flame } from "@/components/icons/Flame";
import { Medal } from "@/components/icons/Medal";
import { Crown } from "@/components/icons/Crown";

const badgeStyles = {
  "Quiz King": {
    icon: HighVoltage,
    bg: "bg-gradient-to-br from-primary to-accent",
    iconColor: "text-white",
  },
  "Compass Smart": {
    icon: Bullseye,
    bg: "bg-gradient-to-br from-violet-500 to-purple-500",
    iconColor: "text-white",
  },
  "Diamond Winner": {
    icon: GemStone,
    bg: "bg-gradient-to-br from-orange-500 to-red-500",
    iconColor: "text-white",
  },
  "Shining Star": {
    icon: Flame,
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
    iconColor: "text-white",
  },
  "Consistency Champ": {
    icon: Crown,
    bg: "bg-gradient-to-br from-teal-500 to-cyan-500",
    iconColor: "text-white",
  },
  "Perfect Week": {
    icon: Medal,
    bg: "bg-gradient-to-br from-green-500 to-emerald-500",
    iconColor: "text-white",
  },
};

export default function BadgeCard({ badge }) {
  const style = badgeStyles[badge.title] ?? {
    icon: Medal,
    bg: "bg-gradient-to-br from-violet-500 to-purple-500",
    iconColor: "text-white",
  };

  const Icon = style.icon;

  return (
    <div className="group relative rounded-2xl border border-border bg-card shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
      <div className="flex items-center gap-4 p-4">
        {/* Badge Icon */}
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${style.bg} shadow-lg`}
        >
          <Icon size="md" className={style.iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="font-bold text-foreground mb-1">
            {badge.title}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-accent">
              {badge.xp.toLocaleString()} XP
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-muted-foreground">{badge.earnedAt}</span>
          </div>
        </div>

        {/* Hover affordance */}
        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mr-2" />
      </div>
    </div>
  );
}