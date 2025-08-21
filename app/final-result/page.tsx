"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GradientDefs } from "@/components/GradientDefs";
import { FinalResultCard } from "@/components/FinalResultCard";
import { DetailedAnalysis } from "@/components/DetailedAnalysis";
import { HookScoresSection } from "@/components/HookScoresSection";

export default function FinalResultPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [videoName, setVideoName] = useState<string>("");

  useEffect(() => {
    // Get analysis result from sessionStorage
    const storedResult = sessionStorage.getItem("analysisResult");
    const storedVideoName = sessionStorage.getItem("uploadedVideo");

    if (!storedResult) {
      // No analysis result found, redirect to home
      router.push("/");
      return;
    }

    try {
      const result = JSON.parse(storedResult);
      setAnalysisResult(result);
      setVideoName(storedVideoName || "Unknown Video");
    } catch (error) {
      console.error("Error parsing analysis result:", error);
      router.push("/");
    }
  }, [router]);

  const handleGoToPotential = () => {
    router.push("/potential-score");
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
        <div className="text-center space-y-4">
     
          <h1 className="text-3xl font-playfair italic text-white">
            Your Final Results
          </h1>
        </div>

        {/* Results Card */}
        <Card className="premium-glow border-0 dark-gradient-card grain-texture">
          <FinalResultCard
            score={analysisResult.overall_score}
            videoName={videoName}
            comment={
              analysisResult.comments?.[0] || "Analysis completed successfully!"
            }
          />

          {/* Visual and Audio Scores Section */}
          <CardContent className="p-8 pt-0">
            <HookScoresSection breakdown={analysisResult.breakdown} />
          </CardContent>

          <DetailedAnalysis
            breakdown={analysisResult.breakdown}
            comments={analysisResult.comments}
            transcription={analysisResult.transcription}
            confidence={analysisResult.confidence}
          />
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <h1 className="text-3xl font-playfair italic text-white">
            Wait, you know what...
          </h1>
          <Button
            onClick={handleGoToPotential}
            className="w-full h-14  text-white font-semibold text-lg rounded-2xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600  hover:scale-[1.02] border "
          >
            <span>What?</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            variant="ghost"
            onClick={handleTryAnother}
            className="w-full text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Try Another Video
          </Button>
        </div>
      </div>
    </div>
  );
}
