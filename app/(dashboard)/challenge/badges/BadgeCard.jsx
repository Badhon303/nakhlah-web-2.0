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
    bg: "bg-accent/90",
    iconColor: "text-accent-foreground",
  },
  "Compass Smart": {
    icon: Bullseye,
    bg: "bg-accent/90",
    iconColor: "text-accent-foreground",
  },
  "Diamond Winner": {
    icon: GemStone,
    bg: "bg-accent/90",
    iconColor: "text-accent-foreground",
  },
  "Shining Star": {
    icon: Flame,
    bg: "bg-accent/90",
    iconColor: "text-accent-foreground",
  },
  "Consistency Champ": {
    icon: Crown,
    bg: "bg-secondary/90",
    iconColor: "text-secondary-foreground",
  },
  "Perfect Week": {
    icon: Medal,
    bg: "bg-primary/90",
    iconColor: "text-primary-foreground",
  },
};


export default function BadgeCard({ badge }) {
  const style = badgeStyles[badge.title] ?? {
    icon: Medal,
    bg: "bg-secondary/90",
    iconColor: "text-secondary-foreground",
  };

  const Icon = style.icon;

  return (
    <div className="group relative rounded-2xl border border-border bg-card transition hover:shadow-md hover:-translate-y-[1px]">
      <div className="flex items-center gap-4 pl-4">
        {/* Badge Icon */}
        <div
          className={`rounded-full flex items-center justify-center p-2 ${style.bg}`}
        >
          <Icon size="md" className={style.iconColor} />
        </div>

         {/* Content */}
        <div className="flex-1 p-4 pl-0">
          <p className="font-semibold text-foreground">
            {badge.title}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{badge.xp.toLocaleString()} XP</span>
            <span className="text-xs">•</span>
            <span>{badge.earnedAt}</span>
          </div>
        </div>

        {/* Hover affordance */}
        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
      </div>
    </div>
  );
}
