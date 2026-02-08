"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/nakhlah/Mascot";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { Bullseye } from "@/components/icons/BullsEye";
import { HighVoltage } from "@/components/icons/High-Voltage";
import { NotoStopwatch } from "@/components/icons/NotoStopwatch";

const stats = [
  {
    label: "Total XP",
    value: "24",
    icon: <HighVoltage size="sm" />,
    border: "border-amber-400",
    header: "bg-amber-500",
  },
  {
    label: "Time",
    value: "1:45",
    icon: <NotoStopwatch size="sm" />,
    border: "border-emerald-400",
    header: "bg-emerald-500",
  },
  {
    label: "Accuracy",
    value: "87%",
    icon: <Bullseye size="sm" />,
    border: "border-rose-400",
    header: "bg-rose-500",
  },
];

export default function LessonCompleted() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/lesson/daily-mission");
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
          {/* Mascot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <Mascot mood="surprised" size="xxl" className="w-32 h-32 mx-auto" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-4xl font-extrabold text-accent mb-8"
          >
            Lesson completed!
          </motion.h1>

          {/* Diamonds Earned Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-10 px-4 sm:px-0"
          >
            <div className="max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-sky-400">
              {/* Header */}
              <div className="bg-gradient-to-r from-sky-400 to-sky-500 py-4">
                <p className="text-white text-xl font-bold text-center">
                  Diamonds
                </p>
              </div>

              {/* Body */}
              <div className="bg-white py-6">
                <div className="flex items-center justify-center gap-3">
                  <GemStone size="md" className="text-sky-500" />
                  <span className="text-4xl font-extrabold text-slate-800">
                    12
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8 px-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl overflow-hidden border-2 ${stat.border} bg-white`}
              >
                {/* Header */}
                <div className={`${stat.header} py-2`}>
                  <p className="text-white font-bold text-base text-center truncate">
                    {stat.label}
                  </p>
                </div>

                {/* Body */}
                <div className="flex items-center justify-center gap-2 py-4">
                  {stat.icon}
                  <span className="text-xl font-extrabold text-slate-900">
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
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
