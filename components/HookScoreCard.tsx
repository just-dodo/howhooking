"use client";

import { ScoreMeter } from "./ScoreMeter";

interface ScoreItem {
  label: string;
  icon: string;
  value: number | undefined;
}

interface HookScoreCardProps {
  title: string;
  icon: string;
  score: number;
  items: ScoreItem[];
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  scoreColor: string;
  ringStartColor: string;
  ringEndColor: string;
}

export function HookScoreCard({
  title,
  icon,
  score,
  items,
  gradientFrom,
  gradientTo,
  borderColor,
  scoreColor,
  ringStartColor,
  ringEndColor,
}: HookScoreCardProps) {
  const scoreConfig = {
    level: "good" as const,
    color: scoreColor,
    bgGradient: `${gradientFrom} ${gradientTo}`,
    icon: null,
    label: "",
    description: "",
    ringStartColor,
    ringEndColor,
  };

  // Extract theme colors for the meter
  const getThemeColors = () => {
    if (scoreColor.includes("purple")) {
      return { start: "#A855F7", end: "#7C3AED" }; // purple-500 to purple-600
    }
    if (scoreColor.includes("green")) {
      return { start: "#10B981", end: "#059669" }; // emerald-500 to emerald-600
    }
    if (scoreColor.includes("blue")) {
      return { start: "#3B82F6", end: "#2563EB" }; // blue-500 to blue-600
    }
    if (scoreColor.includes("red")) {
      return { start: "#EF4444", end: "#DC2626" }; // red-500 to red-600
    }
    if (scoreColor.includes("yellow") || scoreColor.includes("amber")) {
      return { start: "#F59E0B", end: "#D97706" }; // amber-500 to amber-600
    }
    // Default fallback
    return undefined;
  };

  return (
    <div
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl border ${borderColor}`}
    >
      <div className="flex items-center gap-3 p-4 w-full justify-start ">
        <span className="text-lg">{icon}</span>
        <h4 className="text-lg font-semibold text-white flex-1 ">{title}</h4>
      </div>

      <div className="px-6 pb-6">
        <div className="flex justify-center mb-4">
          <div className="scale-75">
            <ScoreMeter score={score} config={scoreConfig} />
          </div>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-white/70">{item.label}</span>
              <span className="text-sm font-medium text-white/80">
                {item.value || "--"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
