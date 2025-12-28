import { motion } from "framer-motion";

export default function MissionCard({ mission }) {
  const progress = Math.min((mission.current / mission.target) * 100, 100);

  const Icon = mission.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="border border-border rounded-2xl p-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center">
          <Icon size="md" className="text-accent" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <p className="font-semibold text-foreground">{mission.label}</p>
            <span className="text-sm text-muted-foreground">
              {mission.current}/{mission.target}
            </span>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-accent rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
