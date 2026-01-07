import { CheckCircle2 } from "lucide-react";
import { GemStone } from "@/components/icons/Gem";
import { HighVoltage } from "@/components/icons/High-Voltage";
import { Bullseye } from "@/components/icons/BullsEye";
import { Flame } from "@/components/icons/Flame";

const quests = [
  { label: "Get 25 Diamonds", current: 12, target: 25, icon: GemStone },
  { label: "Get 40 XP", current: 40, target: 40, icon: HighVoltage },
  { label: "Get 2 perfect lessons", current: 2, target: 2, icon: Bullseye },
  { label: "Complete 1 challenge", current: 0, target: 1, icon: Flame },
];

export function DailyQuests() {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Daily Quests</h2>
      <ul className="space-y-2">
        {quests.map((quest, index) => {
          const completed = quest.current >= quest.target;
          const Icon = quest.icon;

          return (
            <li
              key={index}
              className="flex items-center justify-between bg-muted/20 rounded-md p-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon size="sm" className="text-accent" />
                </div>
                <span className={completed ? "line-through text-muted-foreground" : ""}>
                  {quest.label}
                </span>
              </div>
              {completed && <CheckCircle2 className="text-primary" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
