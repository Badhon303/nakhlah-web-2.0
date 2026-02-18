import React, { useState, useEffect } from "react";
import { Lock } from "@/components/icons/Lock";
import { Star } from "@/components/icons/Star";
import { useRouter } from "next/navigation";
import { LessonSelectionPopup } from "./LessonSelectionPopup";

// Shared state to ensure only one popup is open at a time
let activePopupId = null;
const popupListeners = new Set();

function setActivePopup(id) {
  activePopupId = id;
  popupListeners.forEach((listener) => listener(id));
}

export function Circle({
  isCompleted,
  isCurrent,
  isLocked,
  icon,
  type,
  size = "md",
  lessonId,
}) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const listener = (activeId) => {
      if (activeId !== lessonId) {
        setShowPopup(false);
      }
    };
    popupListeners.add(listener);
    return () => popupListeners.delete(listener);
  }, [lessonId]);

  const getCircleStyles = () => {
    if (isLocked) {
      return "bg-[hsl(var(--node-locked))] border-[hsl(var(--node-locked-border))] pathway-node-shadow-locked";
    }
    if (isCurrent) {
      return "bg-accent border-accent shadow-lg pathway-node-shadow-locked";
    }
    return "bg-[hsl(var(--node-yellow))] border-[hsl(var(--node-yellow-border))] pathway-node-shadow";
  };

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const iconSizeClass = iconSizeClasses[size] || iconSizeClasses.md;

  const getIcon = () => {
    if (isLocked) {
      return <Lock size="lg" variant="silver" />;
    }

    if (
      (isCurrent || isCompleted) &&
      type !== "trophy" &&
      type !== "checkpoint" &&
      type !== "crown"
    ) {
      return <Star size="lg" />;
    }

    if (icon) {
      return React.cloneElement(icon, {
        className: `${icon.props.className || ""} ${iconSizeClass}`,
      });
    }

    return null;
  };

  const isSpecialType =
    type === "trophy" || type === "crown" || type === "checkpoint";

  const handleClick = () => {
    if ((isCompleted || isCurrent) && !isLocked) {
      setActivePopup(lessonId);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setActivePopup(null);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`rounded-full flex items-center justify-center border-4 ${getCircleStyles()} transition-transform ${sizeClass} ${
          isSpecialType && !isLocked ? "" : ""
        } ${
          (isCompleted || isCurrent) && !isLocked
            ? "cursor-pointer hover:scale-110"
            : isLocked
              ? "cursor-not-allowed"
              : "cursor-pointer hover:scale-105"
        }`}
      >
        <div className="flex items-center justify-center">{getIcon()}</div>
      </div>

      {/* Lesson Selection Popup */}
      {showPopup && (
        <LessonSelectionPopup
          nodeId={lessonId}
          lessonId={lessonId}
          isCompleted={isCompleted}
          isCurrent={isCurrent}
          isLocked={isLocked}
          onClose={handleClosePopup}
          open={showPopup}
        />
      )}
    </>
  );
}
