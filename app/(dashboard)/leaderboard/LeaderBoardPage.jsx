import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { useLeaderboardStore } from "@/stores/useLeaderboardStore";

const PAGE_SIZE = 10;

const PODIUM_CONFIG = {
  1: {
    avatarSize: "w-24 h-24 lg:w-28 lg:h-28",
    avatarText: "text-2xl lg:text-3xl",
    avatarImg: 112,
    blockWidth: "w-28 lg:w-36",
    blockHeight: "h-32 lg:h-36",
    frontFace: "from-violet-400 to-violet-500",
    topFace: "bg-violet-300",
    numberClass: "text-5xl lg:text-6xl",
    medalBg: "bg-amber-400",
    delay: 0.3,
  },
  2: {
    avatarSize: "w-20 h-20 lg:w-24 lg:h-24",
    avatarText: "text-xl lg:text-2xl",
    avatarImg: 96,
    blockWidth: "w-24 lg:w-32",
    blockHeight: "h-24 lg:h-28",
    frontFace: "from-violet-500 to-violet-600",
    topFace: "bg-violet-400",
    numberClass: "text-4xl lg:text-5xl",
    medalBg: "bg-slate-300",
    delay: 0.4,
  },
  3: {
    avatarSize: "w-20 h-20 lg:w-24 lg:h-24",
    avatarText: "text-xl lg:text-2xl",
    avatarImg: 96,
    blockWidth: "w-24 lg:w-32",
    blockHeight: "h-20 lg:h-24",
    frontFace: "from-violet-600 to-violet-700",
    topFace: "bg-violet-500",
    numberClass: "text-4xl lg:text-5xl",
    medalBg: "bg-amber-600",
    delay: 0.5,
  },
};

function PodiumPlace({ user, rank }) {
  const config = PODIUM_CONFIG[rank];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: config.delay }}
        className="relative"
      >
        <div
          className={`${config.avatarSize} rounded-full bg-gradient-to-br ${user?.color} flex items-center justify-center text-white font-bold ${config.avatarText} shadow-xl border-4 border-background relative z-10`}
        >
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user?.name || `Rank ${rank}`}
              className="w-full h-full rounded-full object-cover"
              width={config.avatarImg}
              height={config.avatarImg}
            />
          ) : (
            user?.avatar
          )}
        </div>
        {/* Medal with ribbon */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div
            className={`w-7 h-7 rounded-full ${config.medalBg} border-2 border-background flex items-center justify-center shadow-md relative z-10`}
          >
            <span className="text-white text-xs font-black">{rank}</span>
          </div>
          <div className="flex -mt-1">
            <div
              className={`w-2 h-3 ${config.medalBg} [transform:skewX(20deg)] opacity-90`}
            />
            <div
              className={`w-2 h-3 ${config.medalBg} [transform:skewX(-20deg)] opacity-90`}
            />
          </div>
        </div>
      </motion.div>

      <p className="mt-6 font-semibold text-foreground text-sm lg:text-base truncate max-w-[120px] text-center">
        {user?.name}
      </p>
      <div className="mt-1 rounded-full bg-card px-3 py-1 text-accent font-bold text-sm shadow-md border border-border">
        {user?.injaz} Injaz
      </div>

      {/* 3D podium block */}
      <div className={`relative ${config.blockWidth} mt-3`}>
        <div
          className={`absolute -top-2.5 inset-x-0 h-2.5 ${config.topFace}`}
          style={{ clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0% 100%)" }}
        />
        <div
          className={`${config.blockHeight} bg-gradient-to-b ${config.frontFace} shadow-lg flex items-center justify-center rounded-b-sm`}
        >
          <span
            className={`${config.numberClass} font-black text-white/90 drop-shadow-sm`}
          >
            {rank}
          </span>
        </div>
      </div>
    </div>
  );
}

function RestList({ restList, onViewProfile }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < restList.length) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, restList.length),
          );
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, restList.length]);

  return (
    <>
      {restList.slice(0, visibleCount).map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 + index * 0.05 }}
          className={`w-full bg-transparent lg:bg-card flex items-center gap-4 px-2 py-4 lg:p-4 rounded-2xl ${
            user.isCurrentUser
              ? "bg-muted/30 border-2 border-primary lg:shadow-lg"
              : "border border-border shadow-md"
          }`}
        >
          <div className="w-8 text-center">
            <span className="font-bold text-muted-foreground text-lg">
              {user.rank}
            </span>
          </div>
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
                width={56}
                height={56}
              />
            ) : (
              user.avatar
            )}
          </div>
          <div className="flex-1 text-left">
            <p
              className={`font-bold ${
                user.isCurrentUser ? "text-primary" : "text-foreground"
              }`}
            >
              {user.name}
            </p>
            <p className="text-muted-foreground text-sm">{user.injaz} Injaz</p>
          </div>
        </motion.div>
      ))}

      {visibleCount < restList.length && (
        <div ref={loadMoreRef} className="pt-2 flex justify-center">
          <button
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + PAGE_SIZE, restList.length),
              )
            }
            className="px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}

export default function Leaderboard({ onViewProfile }) {
  const { data: session, status } = useSession();
  const leaderboardData = useLeaderboardStore((state) => state.leaderboard);
  const topThree = useLeaderboardStore((state) => state.topThree);
  const isLoading = useLeaderboardStore((state) => state.isLoading);
  const fetchLeaderboard = useLeaderboardStore(
    (state) => state.fetchLeaderboard,
  );
  const clearLeaderboard = useLeaderboardStore((state) => state.clear);

  const restList = leaderboardData.slice(3);
  const dataKey = useMemo(() => {
    return leaderboardData.length + "-" + (leaderboardData[0]?.id ?? "");
  }, [leaderboardData]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (status === "loading") return;

      if (!isSessionValid(session)) {
        clearLeaderboard();
        return;
      }

      const token = getSessionToken(session);
      await fetchLeaderboard({
        token,
        userKey: getUserKey(session),
        sessionUserId: session?.user?.id || "",
      });
    };

    loadLeaderboard();
  }, [clearLeaderboard, fetchLeaderboard, session, status]);

  return (
    <div className="min-h-screen">
      <div className=" container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <section className="mb-6 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Rise through the{" "}
            <span className="text-gradient-accent">ranks.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Compete with learners and earn your place at the top of the
            leaderboard.
          </p>
        </section>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8 flex items-end justify-center gap-4 lg:gap-8 mt-8"
        >
          <PodiumPlace user={topThree[1]} rank={2} />
          <PodiumPlace user={topThree[0]} rank={1} />
          <PodiumPlace user={topThree[2]} rank={3} />
        </motion.div>

        {/* Rest of Leaderboard List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:space-y-3"
        >
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={`leader-skeleton-${i}`}
                  className="h-20 rounded-2xl bg-card border border-border animate-pulse"
                />
              ))}
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="w-full rounded-2xl border border-border bg-card p-5 text-center text-muted-foreground">
              No leaderboard data available.
            </div>
          ) : (
            <RestList
              key={dataKey}
              restList={restList}
              onViewProfile={onViewProfile}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
