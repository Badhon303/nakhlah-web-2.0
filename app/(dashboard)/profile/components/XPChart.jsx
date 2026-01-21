"use client";
import { motion } from "framer-motion";

export default function XPChart() {
  const apData = [
    { day: "Mon", value: 60 },
    { day: "Tue", value: 45 },
    { day: "Wed", value: 80 },
    { day: "Thu", value: 55 },
    { day: "Fri", value: 90 },
    { day: "Sat", value: 70 },
    { day: "Sun", value: 85 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
    >
      <div className="lg:p-6 mb-4 lg:mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your XP this week</h3>
          <div className="text-xl lg:text-2xl font-bold text-accent">872 XP</div>
        </div>
      </div>
      <div className="">
        <div className="h-48 lg:h-64 flex items-end justify-between gap-2 lg:gap-4">
          {apData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1 lg:gap-2">
              <div className="w-full bg-muted rounded-t-lg lg:rounded-t-xl relative overflow-hidden" style={{ height: "150px" }}>
                <motion.div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-accent to-accent/80 rounded-t-lg lg:rounded-t-xl"
                  initial={{ height: 0 }}
                  animate={{ height: `${data.value}%` }}
                  transition={{ delay: 0.1 * index + 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs lg:text-sm text-muted-foreground font-medium">
                {data.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}