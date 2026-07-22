import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareProfile({ onShare }) {
  return (
    <div className="lg:rounded-2xl lg:bg-card lg:shadow-lg lg:border lg:border-border lg:overflow-hidden lg:p-6">
      <div className="">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 lg:mb-6">
          Share Profile
        </h3>
      </div>
      <div className="">
        <p className="text-sm text-muted-foreground mb-4">
          Share your learning progress with friends and followers to inspire
          others!
        </p>
        <Button onClick={onShare} className="w-full text-accent-foreground">
          <Share2 className="w-4 h-4 mr-2" />
          Share Now
        </Button>
      </div>
    </div>
  );
}
