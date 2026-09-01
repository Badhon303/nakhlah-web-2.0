"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DailyMissions from "./target/DailyMissions";
import BadgesList from "./badges/BadgesList";

const tabs = [
  { id: "target", label: "Target" },
  { id: "badges", label: "Badges" },
];

export default function ChallengesHome() {
  const [activeTab, setActiveTab] = useState("target");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 lg:max-w-7xl">
      <section className="mb-6 max-w-4xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Master your{" "}
          <span className="text-gradient-accent">daily targets.</span>
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg">
          Complete challenges, collect badges, and keep your learning streak
          alive.
        </p>
      </section>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 grid grid-cols-2 gap-3 lg:max-w-sm"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border-2 px-6 py-2.5 text-sm font-bold transition-all active:scale-[0.98] ${
                isActive
                  ? "border-accent bg-accent text-accent-foreground shadow-accent"
                  : "border-accent/40 bg-transparent text-accent hover:border-accent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        {activeTab === "target" ? <DailyMissions /> : <BadgesList />}
      </motion.div>
    </div>
  );
}
