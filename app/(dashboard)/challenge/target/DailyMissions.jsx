import { GemStone } from "@/components/icons/Gem";
import { HighVoltage } from "@/components/icons/High-Voltage";
import { Bullseye } from "@/components/icons/BullsEye";
import { Flame } from "@/components/icons/Flame";
import MissionCard from "./MissionCard";

const missions = [
  { label: "Get 25 Diamonds", current: 12, target: 25, icon: GemStone },
  { label: "Get 40 XP", current: 24, target: 40, icon: HighVoltage },
  { label: "Get 2 perfect lessons", current: 0, target: 2, icon: Bullseye },
  { label: "Complete 1 challenge", current: 1, target: 1, icon: Flame },
  { label: "Get 25 Diamonds", current: 12, target: 25, icon: GemStone },
  { label: "Get 40 XP", current: 24, target: 40, icon: HighVoltage },
  { label: "Get 2 perfect lessons", current: 0, target: 2, icon: Bullseye },
  { label: "Complete 1 challenge", current: 1, target: 1, icon: Flame },
];

export default function DailyMissions() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Grid container */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {missions.map((mission, index) => (
          <MissionCard key={index} mission={mission} />
        ))}
      </div>
    </div>
  );
}
