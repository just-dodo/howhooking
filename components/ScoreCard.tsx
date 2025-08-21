"use client";

import { Separator } from "@/components/ui/separator";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ScoreBreakdownItem {
  label: string;
  icon: string;
  value: number | undefined;
}

interface ScoreCardProps {
  title: string;
  score: number;
  scoreColor: string;
  borderColor: string;
  breakdown: ScoreBreakdownItem[];
  className?: string;
}

export function ScoreCard({
  title,
  score,
  scoreColor,
  borderColor,
  breakdown,
  className = "",
}: ScoreCardProps) {
  return (
    <TooltipProvider>
      <div
        className={`bg-white/5 rounded-lg p-4 border ${borderColor} animate-in fade-in duration-500 ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-white">{title}</span>
          <div className={`text-xl font-bold ${scoreColor}`}>
            {score}
            <span className="text-sm text-white/40 font-light ml-1">/100</span>
          </div>
        </div>

        <Separator className="mb-4 bg-white/10" />

        {/* Score Breakdown */}
        <div className="flex flex-col gap-2">
          {breakdown.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-help">
                  <span className="text-xs text-white/80 truncate">
                    {item.icon} {item.label}
                  </span>
                  <span className="text-xs font-semibold text-white flex-shrink-0">
                    {item.value || "--"}
                    <span className="text-2xs text-white/40 font-light ml-1">
                      /100
                    </span>
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}: {item.value || "--"} out of 100</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
