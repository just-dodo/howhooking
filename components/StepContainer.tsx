"use client";

import { ReactNode, forwardRef } from "react";
import { CheckCircle } from "lucide-react";

interface StepContainerProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  isComplete: boolean;
  isActive: boolean;
  score?: number;
  scoreColor?: string;
  children?: ReactNode;
  className?: string;
}

export const StepContainer = forwardRef<HTMLDivElement, StepContainerProps>(
  (
    {
      stepNumber,
      title,
      description,
      icon,
      isComplete,
      isActive,
      score,
      scoreColor = "text-green-400",
      children,
      className = "",
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`my-6 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0">
            {isComplete ? (
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center premium-glow">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            ) : isActive ? (
              <div className="w-8 h-8 animated-gradient rounded-full flex items-center justify-center premium-glow-purple relative">
                <span className="text-sm">{icon}</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-sm opacity-50">{icon}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isComplete || isActive ? "text-white" : "text-white/50"
                  }`}
                >
                  Step {stepNumber}: {title}
                </p>
                <p className="text-xs text-white/60">{description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {children && <div className="ml-11">{children}</div>}
      </div>
    );
  }
);

StepContainer.displayName = "StepContainer";
