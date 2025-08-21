"use client";

import { AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AnalysisState =
  | "idle"
  | "processing"
  | "transcribing"
  | "analyzing"
  | "completed"
  | "error";

interface ProgressBarProps {
  progress: number;
  analysisState: AnalysisState;
  statusMessage: string;
  errorMessage?: string;
}

export function ProgressBar({
  progress,
  analysisState,
  statusMessage,
  errorMessage,
}: ProgressBarProps) {
  const getStageIndicator = () => {
    switch (analysisState) {
      case "processing":
        return "🔄 Extracting video frames...";
      case "transcribing":
        return "🎤 Converting speech to text...";
      case "analyzing":
        return "🧠 AI analyzing content...";
      case "completed":
        return "✅ Analysis complete!";
      case "error":
        return "⚠️ Switching to backup analysis...";
      default:
        return "⏳ Preparing analysis...";
    }
  };

  const isActive =
    analysisState !== "idle" &&
    analysisState !== "completed" &&
    analysisState !== "error";

  return (
    <div className="space-y-8 mb-8">
      {/* Status Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-8 glass-morphism rounded-full flex items-center justify-center premium-glow">
            {analysisState === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </div>
          <h3 className="text-lg font-bold text-white">
            {analysisState === "error"
              ? "Switching to backup..."
              : "AI Analysis"}
          </h3>
        </div>
        <p className="text-white/60 text-sm">
          {statusMessage || "Processing your video..."}
        </p>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {isActive && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">
                  ACTIVE
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">
              {Math.round(progress)}%
            </span>
            {isActive && (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
            )}
          </div>
        </div>

        <div className="relative">
          <Progress value={progress} className="h-4 bg-white/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full opacity-80" />
          {progress > 0 && progress < 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full" />
          )}
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-white/70 font-medium">
            {getStageIndicator()}
          </p>
        </div>
      </div>

      {/* Error State */}
      {analysisState === "error" && errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
