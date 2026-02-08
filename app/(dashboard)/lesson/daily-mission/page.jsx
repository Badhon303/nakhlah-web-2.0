"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HighVoltage } from "@/components/icons/High-Voltage";
import { GemStone } from "@/components/icons/Gem";
import { Bullseye } from "@/components/icons/BullsEye";
import { Flame } from "@/components/icons/Flame";

const missions = [
  {
    label: "Get 40 XP",
    current: 23,
    target: 40,
    icon: (props) => <HighVoltage {...props} />,
  },
  {
    label: "Get 25 Diamonds",
    current: 12,
    target: 25,
    icon: (props) => <GemStone {...props} />,
  },
  {
    label: "Get 2 perfect lessons",
    current: 1,
    target: 2,
    icon: (props) => <Bullseye {...props} />,
  },
  {
    label: "Complete 1 challenge",
    current: 1,
    target: 1,
    icon: (props) => <Flame {...props} />,
  },
];

export default function DailyMissionUpdate() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/lesson/streak-update");
  };

  return (
    <div className="min-h-screen sm:min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto text-center flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent lg:bg-card rounded-none lg:rounded-3xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-extrabold text-accent mb-2">
              Daily mission updated!
            </h1>
          </motion.div>

          {/* Mission Cards */}
          <div className="space-y-4 mb-8">
            {missions.map((mission, index) => {
              const progress = (mission.current / mission.target) * 100;
              const IconComponent = mission.icon;

              return (
                <motion.div
                  key={mission.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-transparent border border-accent/20 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                      <IconComponent size="md" className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-foreground">
                          {mission.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mission.current} / {mission.target}
                        </p>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{
                            delay: 0.5 + index * 0.1,
                            duration: 0.8,
                          }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="hidden sm:block"
          >
            <Button
              onClick={handleContinue}
              className="w-full h-14 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
            >
              CONTINUE
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile bottom action */}
      <div className="w-full max-w-lg mx-auto sm:hidden bg-background border-t border-border p-4">
        <Button
          onClick={handleContinue}
          className="w-full h-12 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  );
}
