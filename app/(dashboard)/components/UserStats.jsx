
import { Flame, Gem, Heart } from "lucide-react";

export function UserStats() {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="text-orange-500" />
          <span>0</span>
        </div>
        <div className="flex items-center space-x-2">
          <Gem className="text-red-500" />
          <span>0</span>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="text-yellow-500" />
          <span>0</span>
        </div>
      </div>
    </div>
  );
}
