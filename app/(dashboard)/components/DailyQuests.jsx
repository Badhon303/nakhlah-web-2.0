"use client";

import { CheckCircle2 } from "lucide-react";
import { GemStone } from "@/components/icons/Gem";
import { HighVoltage } from "@/components/icons/High-Voltage";
import { Bullseye } from "@/components/icons/BullsEye";
import { Flame } from "@/components/icons/Flame";
import { CardMenuOptions } from "@/components/nakhlah/CardMenuOptions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const quests = [
  { label: "Get 25 Diamonds", current: 12, target: 25, icon: GemStone },
  { label: "Get 40 XP", current: 40, target: 40, icon: HighVoltage },
  { label: "Get 2 perfect lessons", current: 2, target: 2, icon: Bullseye },
  // { label: "Complete 1 challenge", current: 0, target: 1, icon: Flame },
];

export function DailyQuests() {
  const router = useRouter();

  const menuOptions = [
    {
      label: "View Challenges",
      onClick: () => router.push("/challenge?tab=target"),
    },
  ];

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Daily Quests</h2>
          <p className="text-xs text-muted-foreground">
            Complete tasks to earn rewards
          </p>
        </div>
        <CardMenuOptions options={menuOptions} />
      </div>
      <ul className="space-y-2">
        {quests.map((quest, index) => {
          const completed = quest.current >= quest.target;
          const Icon = quest.icon;

          return (
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
              key={index}
              className="flex items-center justify-between bg-muted/20 rounded-md p-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon size="sm" className="text-accent" />
                </div>
                <span
                  className={
                    completed ? "line-through text-muted-foreground" : ""
                  }
                >
                  {quest.label}
                </span>
              </div>
              {completed && <CheckCircle2 className="text-accent" />}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
