import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SubscriptionCard() {
  const router = useRouter();

  return (
    <section className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-2xl lg:border lg:border-accent/20 lg:bg-card lg:shadow-sm">
      <div className="border-b border-border px-5 py-4 text-foreground">
        <h3 className="text-xl font-extrabold text-foreground">Go Pro</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Learn without interruptions.
        </p>
      </div>
      <div className="p-4">
        <div className="rounded-xl border border-border bg-background p-4 text-sm">
          <h5 className="font-bold text-foreground">What you get</h5>
          <p className="mt-1 leading-5 text-muted-foreground">
            Unlimited lessons, no ads, and exclusive content
          </p>
        </div>
        <Button
          onClick={() => router.push("/store")}
          className="mt-4 w-full rounded-xl bg-accent font-bold text-accent-foreground hover:bg-accent/90"
        >
          Upgrade to Pro
        </Button>
      </div>
    </section>
  );
}
