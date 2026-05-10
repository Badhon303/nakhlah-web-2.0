import { motion } from "framer-motion";
import { Medal } from "@/components/icons/Medal";
import { CheckCircle2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getIconUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!API_URL) return url;
  return `${API_URL}${url}`;
};

export default function MissionCard({ mission, onClaimMission, isClaiming }) {
  const Icon = mission.icon;
  const iconUrl = getIconUrl(
    mission.iconUrl || mission.icon?.url || mission.icon,
  );
  const reward = Number(mission.reward) || 0;
  const completed =
    Number(mission.target) > 0 &&
    Number(mission.current) >= Number(mission.target);
  const isActive = mission.active !== false;
  const isClaimable = Boolean(mission.claimable);
  const isDisabled = !isActive || isClaiming;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={isActive ? { scale: 1.02 } : {}}
      className={`bg-card border rounded-2xl p-5 shadow-md transition-all ${
        isActive
          ? "border-border hover:shadow-lg"
          : "border-border/40 opacity-40 grayscale pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-transparent flex items-center justify-center shrink-0">
            {iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconUrl}
                alt={mission.label}
                className="w-10 h-10 object-cover rounded-lg"
              />
            ) : Icon ? (
              <Icon size="md" className="text-white" />
            ) : (
              <Medal size="md" className="text-white" />
            )}
          </div>

          <div className="min-w-0">
            <p
              className={`font-bold ${
                completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {mission.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Reward: {reward.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-semibold text-accent">
            {mission.current}/{mission.target}
          </span>
          {completed ? <CheckCircle2 className="w-5 h-5 text-accent" /> : null}
        </div>
      </div>

      {isClaimable ? (
        <button
          type="button"
          onClick={() => onClaimMission?.(mission)}
          disabled={isDisabled}
          className="mt-4 w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isClaiming ? "Claiming..." : "Claim"}
        </button>
      ) : null}
    </motion.div>
  );
}
