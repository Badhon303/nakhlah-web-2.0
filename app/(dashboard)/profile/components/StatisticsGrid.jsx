"use client";
import { BarChart } from "@/components/icons/BarChart";
import { Bullseye } from "@/components/icons/BullsEye";
import { Calendar } from "@/components/icons/Calendar";
import { Flame } from "@/components/icons/Flame";
import { GemStone } from "@/components/icons/Gem";
import { HighVoltage } from "@/components/icons/High-Voltage";
import { Medal } from "@/components/icons/Medal";
import { Trophy } from "@/components/icons/Trophy";
import { motion } from "framer-motion";

export default function StatisticsGrid() {
  const userStats = [
    { 
      icon: Flame, 
      value: "127", 
      label: "Challenges", 
      color: "text-primary", 
      bg: "bg-muted/30" 
    },
    { 
      icon: Calendar, 
      value: "448", 
      label: "Lesson Passed", 
      color: "text-primary", 
      bg: "bg-muted/30" 
    },
    { 
      icon: GemStone, 
      value: "957", 
      label: "Total Diamonds", 
      color: "text-primary", 
      bg: "bg-muted/30" 
    },
    { 
      icon: HighVoltage, 
      value: "15,274", 
      label: "Total XP Gained", 
      color: "text-primary", 
      bg: "bg-muted/30" 
    },
    { 
      icon: Bullseye, 
      value: "289", 
      label: "Correct Practice", 
      color: "text-primary", 
      bg: "bg-muted/30" 
    },
    { 
      icon: Medal, 
      value: "16", 
      label: "Top 3 Position", 
      color: "text-primary", 
      bg: "bg-muted/30" 
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
    >
      <div className="lg:p-6 mb-4 lg:mb-6">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          Your Statistics
          <BarChart size="sm" className="text-foreground" />
        </h3>
      </div>
      <div className="">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {userStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className={`${stat.bg} rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:shadow-sm lg:hover:shadow-md transition-all cursor-pointer border border-border/30`}
              >
                <IconComponent 
                  size="sm" 
                  className={`${stat.color} mb-2 lg:mb-3`} 
                />
                <div className="text-xl lg:text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}