"use client";

import React, { useMemo, useState, useId } from "react";
import { cn } from "@/lib/utils";

type ScoreLevel = "excellent" | "good" | "average" | "poor" | "critical";

interface ScoreConfig {
  level: ScoreLevel;
  color: string;
  bgGradient: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  ringStartColor: string;
  ringEndColor: string;
}

interface ScoreMeterProps {
  score: number;
  config: ScoreConfig;
  className?: string;
  textClassName?: string;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  config,
  className,
  textClassName,
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const gradientId = useId();

  useMemo(() => {
    const timer = setTimeout(() => setIsAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("relative w-32 h-32 mx-auto mb-6", className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 50}`}
          strokeDashoffset={
            isAnimated
              ? `${2 * Math.PI * 50 * (1 - score / 100)}`
              : `${2 * Math.PI * 50}`
          }
          className="transition-all duration-2000 ease-out"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.ringEndColor} />
            <stop offset="100%" stopColor={config.ringStartColor} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn("text-3xl font-bold text-white/90", textClassName)}>
          {score}
        </div>
      </div>
    </div>
  );
};
