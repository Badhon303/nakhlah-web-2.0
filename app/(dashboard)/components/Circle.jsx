
import { Star, Lock } from "lucide-react";

export function Circle({ isCompleted, isCurrent, isLocked, icon, type }) {
  const getCircleStyles = () => {
    if (isLocked) {
      return 'bg-[hsl(var(--node-locked))] border-[hsl(var(--node-locked-border))] pathway-node-shadow-locked';
    }
    if (isCurrent) {
      return 'bg-accent border-accent shadow-lg  pathway-node-shadow-locked';
    }
    return 'bg-[hsl(var(--node-yellow))] border-[hsl(var(--node-yellow-border))] pathway-node-shadow';
  };

  const getIcon = () => {
    if (isLocked) {
      return <Lock className="text-white" />;
    }
    if (isCompleted) {
      // Forcing a star on all completed regular lessons
      if (type !== 'trophy' && type !== 'checkpoint' && type !== 'crown') {
        return <Star className="text-white" fill="white" />;
      }
    }
    // Return original icon for special types or current, non-completed lessons
    return icon;
  }

  const isSpecialType = type === 'trophy' || type === 'crown' || type === 'checkpoint';

  return (
    <div
      className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${getCircleStyles()} cursor-pointer hover:scale-105 transition-transform  ${
        isSpecialType && !isLocked ? 'scale-110' : ''
      }`}>
      <div className="text-white">
        {getIcon()}
      </div>
    </div>
  );
}
