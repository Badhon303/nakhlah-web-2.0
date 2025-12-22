import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareProfile({ onShare }) {
  return (
    <div className="rounded-2xl bg-card shadow-lg border border-border overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
          Share Profile
        </h3>
      </div>
      <div className="px-6 pb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Share your learning progress with friends and followers to inspire others!
        </p>
        <Button 
          onClick={onShare}
          className="w-full bg-gradient-accent hover:bg-gradient-accent/90 text-accent-foreground"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Now
        </Button>
      </div>
    </div>
  );
}