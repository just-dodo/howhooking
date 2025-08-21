"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GradientDefs } from "@/components/GradientDefs";
import { CTACard } from "@/components/CTACard";

export default function PotentialScorePage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    // Get analysis result from sessionStorage
    const storedResult = sessionStorage.getItem("analysisResult");

    if (!storedResult) {
      // No analysis result found, redirect to home
      router.push("/");
      return;
    }

    try {
      const result = JSON.parse(storedResult);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Error parsing analysis result:", error);
      router.push("/");
    }
  }, [router]);

  const handleWaitlistClick = () => {
    router.push("/waitlist");
  };

  const handleTryAnother = () => {
    // Clear session storage
    sessionStorage.removeItem("hookScore");
    sessionStorage.removeItem("uploadedVideo");
    sessionStorage.removeItem("uploadedVideoFile");
    sessionStorage.removeItem("videoFileId");
    sessionStorage.removeItem("videoFileSize");
    sessionStorage.removeItem("analysisResult");
    sessionStorage.removeItem("extractedFrames");
    sessionStorage.removeItem("transcriptionText");
    router.push("/");
  };

  if (!analysisResult) {
    return (
      <div className="min-h-screen dark-gradient-bg noise-bg flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate potential score
  const currentScore = analysisResult.overall_score;
  const potentialScore = Math.min(
    95,
    currentScore + Math.floor(Math.random() * 20) + 10
  );

  return (
    <div className="min-h-screen dark-gradient-bg noise-bg flex items-center justify-center p-4 relative overflow-hidden">
      <GradientDefs />
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 silicon-gradient opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 silicon-gradient-purple opacity-15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 silicon-gradient opacity-10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Header */}

        <div className="space-y-4 justify-start items-start">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-fit text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>
        {/* CTA Card */}
        <CTACard
          currentScore={currentScore}
          potentialScore={potentialScore}
          onWaitlistClick={handleWaitlistClick}
        />

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleTryAnother}
            className="w-full text-white/40 hover:text-white/60 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Try Another Video
          </Button>
        </div>
      </div>
    </div>
  );
}
