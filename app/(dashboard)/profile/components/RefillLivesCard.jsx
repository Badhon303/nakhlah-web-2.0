import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { refillPalmTrees } from "@/services/api";
import { useGamificationStockStore } from "@/stores/useGamificationStockStore";
import { toast } from "@/components/nakhlah/Toast";
import PalmRefillPanel from "@/components/nakhlah/PalmRefillPanel";

export default function RefillLivesCard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isRefilling, setIsRefilling] = useState(false);
  const fetchGamificationStock = useGamificationStockStore(
    (state) => state.fetchGamificationStock,
  );
  const palmStock = useGamificationStockStore((state) => state.palmStock);
  const palmUpdatedAt = useGamificationStockStore(
    (state) => state.palmUpdatedAt,
  );
  const dateStock = useGamificationStockStore((state) => state.dateStock);

  const palmTreesCount = Number(palmStock ?? 5);

  useEffect(() => {
    if (status !== "authenticated" || !isSessionValid(session)) return;
    const token = getSessionToken(session);
    if (!token) return;

    fetchGamificationStock({ token, userKey: getUserKey(session) });
  }, [status, session, fetchGamificationStock]);

  const handleRefill = async () => {
    if (palmTreesCount >= 5) {
      toast.info("You already have full Palm Trees.");
      return;
    }
    if (!isSessionValid(session)) {
      toast.error("Please login to refill Palm Trees.");
      return;
    }

    const token = getSessionToken(session);
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    setIsRefilling(true);
    try {
      const result = await refillPalmTrees(token);

      if (!result.success) {
        toast.error(result.error || "Unable to refill Palm Trees.");
        return;
      }

      await fetchGamificationStock({
        token,
        userKey: getUserKey(session),
        forceRefresh: true,
      });
      toast.success(result.message || "Palm Trees refilled successfully.");
    } finally {
      setIsRefilling(false);
    }
  };

  return (
    <div className="rounded-none bg-transparent shadow-none border-0 overflow-hidden p-0 lg:rounded-2xl lg:bg-card lg:shadow-lg lg:border lg:border-border lg:p-6">
      <PalmRefillPanel
        title="Refill Palm Trees"
        description="Out of Palm Trees? Refill and continue learning without interruptions!"
        palmTreesCount={palmTreesCount}
        maxPalmTrees={5}
        mascotSize="lg"
        showMascot={false}
        onRefill={handleRefill}
        isRefilling={isRefilling}
        onGoPro={() => router.push("/store")}
        palmUpdatedAt={palmUpdatedAt}
        dateStock={dateStock}
      />
    </div>
  );
}
