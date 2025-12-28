"use client";

import { Search } from "lucide-react";
import BadgeSection from "./BadgeSection";
import { useMemo, useState } from "react";

const badgesByYear = [
  {
    year: "This Year",
    badges: [
      {
        title: "Quiz King",
        xp: 2000,
        earnedAt: "March 2025",
      },
      { title: "Compass Smart", xp: 1500, earnedAt: "February 2025" },
      { title: "Diamond Winner", xp: 2500, earnedAt: "January 2025" },
      { title: "Consistency Champ", xp: 3000, earnedAt: "December 2025" },
      { title: "Perfect Week", xp: 1200, earnedAt: "November 2025" },
    ],
  },
  {
    year: "2024",
    badges: [
      { title: "Shining Star", xp: 2500, earnedAt: "December 2024" },
      { title: "Most Active", xp: 3000, earnedAt: "November 2024" },
      { title: "The Sweetest", xp: 1000, earnedAt: "October 2024" },
    ],
  },
];

export default function BadgesList() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("xp-desc");

  const filteredSections = useMemo(() => {
    return badgesByYear
      .map((section) => {
        const filteredBadges = section.badges
          .filter((badge) =>
            badge.title.toLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) => {
            if (sort === "xp-desc") return b.xp - a.xp;
            if (sort === "xp-asc") return a.xp - b.xp;
            if (sort === "az") return a.title.localeCompare(b.title);
            return 0;
          });

        return {
          ...section,
          badges: filteredBadges,
        };
      })
      .filter((section) => section.badges.length > 0);
  }, [search, sort]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex gap-4 sm:flex-row sm:items-center justify-center lg:justify-end">
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search badges"
              className="pl-9 pr-3 h-9 rounded-full bg-card border border-border text-sm focus:outline-none"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 px-4 rounded-full border border-border text-sm bg-card text-muted-foreground focus:outline-none"
          >
            <option value="xp-desc">XP (High → Low)</option>
            <option value="xp-asc">XP (Low → High)</option>
            <option value="az">Title (A → Z)</option>
          </select>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {filteredSections.map((section) => (
          <BadgeSection key={section.year} section={section} />
        ))}
      </div>
    </div>
  );
}
