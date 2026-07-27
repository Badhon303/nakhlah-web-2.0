// import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SubscriptionCard() {
  const router = useRouter();

  return (
    <div className="lg:rounded-2xl lg:bg-card lg:shadow-lg lg:border lg:border-border lg:overflow-hidden lg:p-6">
      <div className="">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 lg:mb-6">
          {/* <Crown className="w-5 h-5" /> */}
          Go Pro
        </h3>
      </div>
      <div className="">
        <p className="text-sm text-muted-foreground mb-4 lg:mb-6">
          Get unlimited access to all features and more!
        </p>
        <div className="p-3 bg-muted rounded-lg border border-muted-foreground/50 text-sm mb-4">
          <h5 className="font-medium mb-1">What You Get</h5>
          <p>Unlimited lessons, no ads, and exclusive content</p>
        </div>
        <Button
          onClick={() => router.push("/store")}
          className="w-full text-accent-foreground"
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
