import { motion } from "framer-motion";

export default function MissionCard({ mission }) {
  const progress = Math.min((mission.current / mission.target) * 100, 100);

  const Icon = mission.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-transparent flex items-center justify-center">
          <Icon size="md" className="text-white" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <p className="font-bold text-foreground">{mission.label}</p>
            <span className="text-sm font-semibold text-accent">
              {mission.current}/{mission.target}
            </span>
          </div>

          <div className="h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-accent rounded-full shadow-sm"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}