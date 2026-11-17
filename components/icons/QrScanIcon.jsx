import React from "react";

export function QrScanIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="14" y="7" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="7" y="14" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="14" y="14" width="3" height="3" fill="currentColor" stroke="none" />
    </svg>
  );
}
