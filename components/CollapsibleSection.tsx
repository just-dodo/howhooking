"use client";

import { ReactNode, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CollapsibleSectionProps {
  title: string;
  icon: ReactNode;
  isComplete: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  score?: number;
  scoreColor?: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  children: ReactNode;
  className?: string;
}

export const CollapsibleSection = forwardRef<
  HTMLDivElement,
  CollapsibleSectionProps
>(
  (
    {
      title,
      icon,
      isComplete,
      isCollapsed,
      onToggle,
      score,
      scoreColor = "text-white",
      gradientFrom,
      gradientTo,
      borderColor,
      children,
      className = "",
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`mb-8 p-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl border-2 ${borderColor} premium-glow scroll-mt-24 ${className}`}
      >
        <Collapsible open={!isCollapsed} onOpenChange={() => onToggle()}>
          <CollapsibleTrigger asChild>
            <div
              className={`flex items-center justify-between min-w-full cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors`}
            >
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <ChevronDown
                  className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg flex items-center justify-center`}
                >
                  {icon}
                </div>
                {title}
              </h3>
              <div className="flex items-center gap-2">
                {isComplete && score !== undefined ? (
                  <Badge
                    variant="secondary"
                    className={`text-sm font-bold ${scoreColor} bg-current/20 border-current/30`}
                  >
                    {score}/100
                  </Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            {children}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
);

CollapsibleSection.displayName = "CollapsibleSection";
