import React, { useState, useEffect } from "react";
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
  isGiftOpened = false,
  icon,
  type,
  size = "md",
  nodeId,
}) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const listener = (activeId) => {
      if (activeId !== nodeId) {
        setShowPopup(false);
      }
    };
    popupListeners.add(listener);
    return () => popupListeners.delete(listener);
  }, [nodeId]);

  const isSpecialType =
    type === "trophy" || type === "crown" || type === "checkpoint";
  const isTrophy = type === "trophy";

  const iconSizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-28 h-28",
  };

  const trophyIconSizeClasses = {
    sm: "w-12 h-12",
    md: "w-18 h-18",
    lg: "w-20 h-20",
  };

  const iconSizeClass = isTrophy
    ? trophyIconSizeClasses[size] || trophyIconSizeClasses.md
    : iconSizeClasses[size] || iconSizeClasses.md;

  const getIcon = () => {
    // Gift box: closed until it is claimed. The open image is only for a claimed box.
    if (isTrophy) {
      if (isGiftOpened) {
        return (
          <img
            src="/icons/mystery_box_unlocked.svg"
            alt="Mystery box opened"
            className={`${iconSizeClass} scale-110 object-contain`}
          />
        );
      }

      return (
        <img
          src="/icons/mystery_box_locked.svg"
          alt={isLocked ? "Mystery box locked" : "Mystery box ready to open"}
          className={`${iconSizeClass} object-contain${
            isLocked ? " opacity-50 grayscale" : " scale-110"
          }`}
        />
      );
    }

    // Locked task
    if (isLocked) {
      return (
        <img
          src="/icons/Task_locked.svg"
          alt="Locked"
          className={`${iconSizeClass} object-contain`}
        />
      );
    }

    // Unlocked or current task
    if (isCurrent || isCompleted) {
      return (
        <img
          src="/icons/Task_unlocked.svg"
          alt="Unlocked"
          className={`${iconSizeClass} object-contain`}
        />
      );
    }

    // Default to unlocked
    return (
      <img
        src="/icons/Task_unlocked.svg"
        alt="Task"
        className={`${iconSizeClass} object-contain`}
      />
    );
  };

  const getCircleStyles = () => {
    // No background, borders, or shadows - just the icon
    return "";
  };

  const canOpen = isTrophy
    ? !isLocked
    : !isLocked && (isCompleted || isCurrent);

  const handleClick = () => {
    if (canOpen) {
      if (typeof window !== "undefined") {
        localStorage.setItem("lastInteractedNodeId", nodeId);
      }
      setActivePopup(nodeId);
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
        className={`flex items-center justify-center ${getCircleStyles()} transition-transform ${
          canOpen
            ? "cursor-pointer hover:scale-110"
            : isLocked
              ? "cursor-not-allowed"
              : "cursor-default"
        }`}
      >
        {getIcon()}
      </div>

      {/* Lesson Selection Popup */}
      {showPopup && (
        <LessonSelectionPopup
          taskId={nodeId}
          isCompleted={isCompleted}
          isCurrent={isCurrent}
          isLocked={isLocked}
          isTaskGiftBox={isTrophy}
          isGiftOpened={isGiftOpened}
          onClose={handleClosePopup}
          open={showPopup}
        />
      )}
    </>
  );
}
