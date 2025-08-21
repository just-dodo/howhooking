"use client";

import { forwardRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  TrendingUp,
  Award,
  Target,
  AlertTriangle,
  CheckCircle,
  ImageIcon,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreMeter } from "./ScoreMeter";

interface FinalResultCardProps {
  score: number;
  videoName: string;
  comment: string;
  thumbnailUrl?: string;
  className?: string;
  onRetryAnalysis?: () => void;
  isLoading?: boolean;
}

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

const getScoreConfig = (score: number): ScoreConfig => {
  if (score >= 90) {
    return {
      level: "excellent",
      color: "text-gradient-green",
      bgGradient: "from-emerald-500/20 via-green-500/10 to-emerald-600/20",
      icon: <Award className="w-6 h-6" />,
      label: "Exceptional",
      description: "Outstanding hook with viral potential",
      ringStartColor: "#10B981",
      ringEndColor: "#059669",
    };
  }
  if (score >= 75) {
    return {
      level: "good",
      color: "text-gradient-blue",
      bgGradient: "from-blue-500/20 via-cyan-500/10 to-blue-600/20",
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Strong",
      description: "Solid hook with high engagement potential",
      ringStartColor: "#3B82F6",
      ringEndColor: "#2563EB",
    };
  }
  if (score >= 60) {
    return {
      level: "average",
      color: "text-gradient-gold",
      bgGradient: "from-yellow-500/20 via-amber-500/10 to-yellow-600/20",
      icon: <Target className="w-6 h-6" />,
      label: "Decent",
      description: "Good foundation with room for improvement",
      ringStartColor: "#F59E0B",
      ringEndColor: "red",
    };
  }
  if (score >= 40) {
    return {
      level: "poor",
      color: "text-gradient-sunset",
      bgGradient: "from-orange-500/20 via-red-500/10 to-orange-600/20",
      icon: <AlertTriangle className="w-6 h-6" />,
      label: "Needs Work",
      description: "Consider significant improvements",
      ringStartColor: "#EF4444",
      ringEndColor: "#DC2626",
    };
  }
  return {
    level: "critical",
    color: "text-gradient-pink",
    bgGradient: "from-red-500/20 via-pink-500/10 to-red-600/20",
    icon: <AlertTriangle className="w-6 h-6" />,
    label: "Critical",
    description: "Requires major revision for effectiveness",
    ringStartColor: "#EF4444",
    ringEndColor: "#DC2626",
  };
};

const getScoreEmoji = (score: number): string => {
  if (score >= 90) return "🚀";
  if (score >= 75) return "🔥";
  if (score >= 60) return "✨";
  if (score >= 40) return "⚡";
  return "💡";
};

export const FinalResultCard = forwardRef<HTMLDivElement, FinalResultCardProps>(
  (
    {
      score,
      videoName,
      comment,
      thumbnailUrl,
      className = "",
      onRetryAnalysis,
      isLoading = false,
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const scoreConfig = getScoreConfig(score);
    const emoji = getScoreEmoji(score);

    const isValidScore =
      typeof score === "number" && !isNaN(score) && score >= 0 && score <= 100;
    const safeScore = isValidScore ? Math.round(score) : 0;
    const safeVideoName = videoName?.trim() || "Untitled Video";
    const safeComment = comment?.trim() || "Analysis completed successfully!";

    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageError(false);
    };

    if (!isValidScore) {
      return (
        <Card
          className={cn(
            "relative overflow-hidden border-destructive/20 bg-destructive/5",
            className
          )}
        >
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Invalid Analysis Result
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              The analysis could not be completed properly. Please try again.
            </p>
            {onRetryAnalysis && (
              <button
                onClick={onRetryAnalysis}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Retry Analysis
              </button>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <CardContent className="relative p-8 text-center space-y-8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none" />
        <div className="noise-bg absolute inset-0 opacity-30" />

        {/* Score Display Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white/90">Overall Score</h2>
          <ScoreMeter
            score={safeScore}
            config={scoreConfig}
            className="w-48 h-48"
            textClassName="text-6xl "
          />

          <div className="space-y-3">
            {/* <div className="flex items-center justify-center gap-3">
              <span className="text-6xl" role="img" aria-label="Score emoji">
                {emoji}
              </span>
              <div className="text-right">
                <div className={cn("text-5xl font-bold", scoreConfig.color)}>
                  {safeScore}
                  <span className="text-2xl text-white/40 font-normal">
                    /100
                  </span>
                </div>
              </div>
            </div> */}

            <div className="inline-flex items-center gap-2 px-4 py-2 glass-morphism rounded-full">
              {scoreConfig.icon}
              <span className={cn("font-semibold", scoreConfig.color)}>
                {scoreConfig.label}
              </span>
            </div>

            <p className="text-sm text-white/60">{scoreConfig.description}</p>
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-3">
          <div className="w-full max-w-md mx-auto">
            <div className="glass-morphism rounded-xl p-6 border border-white/10">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-white/90 mb-2">
                    Analysis Summary
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {safeComment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    );
  }
);

FinalResultCard.displayName = "FinalResultCard";
