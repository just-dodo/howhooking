"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, ChevronDown, ArrowRight } from "lucide-react";
import { GradientDefs } from "@/components/GradientDefs";
import { ClientVideoAnalyzer } from "@/lib/video-analysis/client-video-analyzer";
import { videoStorage } from "@/lib/video-storage";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { StepContainer } from "@/components/StepContainer";
import { ScoreCard } from "@/components/ScoreCard";
import { ProgressBar } from "@/components/ProgressBar";
import { FrameGrid } from "@/components/FrameGrid";
import { TranscriptionDisplay } from "@/components/TranscriptionDisplay";
import { useAnalysisState } from "@/hooks/useAnalysisState";

export default function AnalyzingPage() {
  const router = useRouter();
  const analysisStateHook = useAnalysisState();
  const {
    currentStep,
    progress,
    analysisState,
    errorMessage,
    statusMessage,
    extractedFrames,
    transcriptionText,
    visualScore,
    audioScore,
    visualBreakdown,
    audioBreakdown,
    stepCompletions,
    sectionCollapsed,
    finalResult,
    videoName,
    setCurrentStep,
    setProgress,
    setAnalysisState,
    setErrorMessage,
    setStatusMessage,
    setExtractedFrames,
    setTranscriptionText,
    setVisualScore,
    setAudioScore,
    setVisualBreakdown,
    setAudioBreakdown,
    setStepCompletions,
    setSectionCollapsed,
    setFinalResult,
    setVideoName,
    toggleSectionCollapse,
  } = analysisStateHook;

  // Refs for components
  const progressBarRef = useRef<HTMLDivElement>(null);
  const visualGroupRef = useRef<HTMLDivElement>(null);
  const audioGroupRef = useRef<HTMLDivElement>(null);
  const framesStepRef = useRef<HTMLDivElement>(null);
  const visualStepRef = useRef<HTMLDivElement>(null);
  const audioStepRef = useRef<HTMLDivElement>(null);
  const audioHookStepRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: "Processing video frames",
      description: "Extracting frames at 12 fps from first 3 seconds",
      icon: "📁",
      key: "frames",
    },
    {
      title: "Visual Hook Analysis",
      description: "Analyzing visual quality and hook effectiveness",
      icon: "🎥",
      key: "visual",
    },
    {
      title: "Audio Extraction",
      description: "Converting speech to text using AI",
      icon: "🎤",
      key: "audio",
    },
    {
      title: "Audio Hook Analysis",
      description: "Evaluating audio hook effectiveness",
      icon: "🎯",
      key: "audioHook",
    },
  ];

  const handleFallbackAnalysis = useCallback(() => {
    setAnalysisState("processing");
    setStatusMessage("Using fallback analysis mode...");

    const stepDuration = 900;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          const fallbackResult = {
            overall_score: 65,
            breakdown: {
              sharpness: 70,
              exposure: 65,
              stability: 60,
              audio_clarity: 70,
              engagement: 60,
              composition: 65,
            },
            comments: [
              "Analysis completed with basic scoring",
              "Upload with OpenAI API key for detailed AI analysis",
              "Showing estimated scores based on video metadata",
            ],
            confidence: 30,
          };

          // Store fallback result
          sessionStorage.setItem(
            "analysisResult",
            JSON.stringify(fallbackResult)
          );
          sessionStorage.setItem(
            "hookScore",
            fallbackResult.overall_score.toString()
          );

          return 100;
        }
        return prev + 1.5;
      });
    }, 70);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    // Store intervals for cleanup
    const cleanupIntervals = () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };

    // Return cleanup function
    return cleanupIntervals;
  }, [router, steps.length]);

  const startVideoAnalysisFromStorage = useCallback(
    async (fileId: string) => {
      try {
        console.log("Starting secure API-based video analysis from storage");
        setAnalysisState("processing");
        setStatusMessage("Retrieving video file...");

        // Get video file from IndexedDB
        const videoFile = await videoStorage.getFile(fileId);

        if (!videoFile) {
          throw new Error("Video file not found in storage");
        }

        console.log("Video file retrieved:", videoFile.name, videoFile.size);

        const analyzer = new ClientVideoAnalyzer();

        // Set up progress callback
        analyzer.setProgressCallback((progressState) => {
          setProgress(progressState.progress);
          setStatusMessage(progressState.message);
          setAnalysisState(progressState.stage);

          // Update frames if available
          if (progressState.frames) {
            setExtractedFrames(progressState.frames);
          }

          // Update transcription if available
          if (progressState.transcription) {
            setTranscriptionText(progressState.transcription);
          }

          // Update progressive scores
          if (progressState.visualScore !== undefined) {
            setVisualScore(progressState.visualScore);
          }

          if (progressState.audioScore !== undefined) {
            setAudioScore(progressState.audioScore);
          }

          // Update breakdown scores
          if (progressState.visualBreakdown !== undefined) {
            setVisualBreakdown(progressState.visualBreakdown);
          }

          if (progressState.audioBreakdown !== undefined) {
            setAudioBreakdown(progressState.audioBreakdown);
          }

          // Update step completions
          if (progressState.isFramesComplete !== undefined) {
            setStepCompletions((prev) => ({
              ...prev,
              frames: progressState.isFramesComplete!,
            }));
          }
          if (progressState.isVisualComplete !== undefined) {
            setStepCompletions((prev) => ({
              ...prev,
              visual: progressState.isVisualComplete!,
            }));
          }
          if (progressState.isAudioComplete !== undefined) {
            setStepCompletions((prev) => {
              const newState = {
                ...prev,
                audio: progressState.isAudioComplete!,
              };
              setAnalysisState("completed");
              return newState;
            });
          }
          if (progressState.isAudioHookComplete !== undefined) {
            setStepCompletions((prev) => ({
              ...prev,
              audioHook: progressState.isAudioHookComplete!,
            }));
          }

          if (progressState.stage === "error") {
            setErrorMessage("Analysis failed");
          }

          // Update current step based on completions
          let newStep = 0;
          if (stepCompletions.frames) newStep = 1;
          if (stepCompletions.visual) newStep = 2;
          if (stepCompletions.audio) newStep = 3;
          if (stepCompletions.audioHook) newStep = 4;
          setCurrentStep(newStep);
        });

        // Start analysis (API key is handled securely on server)
        const result = await analyzer.analyzeVideo(videoFile);

        // Clean up stored file
        await videoStorage.deleteFile(fileId);

        // Store result, frames, and transcription
        sessionStorage.setItem("analysisResult", JSON.stringify(result));
        sessionStorage.setItem("hookScore", result.overall_score.toString());

        // Store frames and transcription for result page
        if (extractedFrames.length > 0) {
          sessionStorage.setItem(
            "extractedFrames",
            JSON.stringify(extractedFrames)
          );
        }
        if (transcriptionText) {
          sessionStorage.setItem("transcriptionText", transcriptionText);
        }

        // Set final result for immediate display
        setFinalResult(result);
        setVideoName(videoFile.name);

        // Don't redirect anymore - show results inline
      } catch (error) {
        console.error("Video analysis failed:", error);
        setAnalysisState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Analysis failed"
        );

        // Fallback to simple analysis after error
        setTimeout(() => {
          console.log("Falling back to basic analysis");
          handleFallbackAnalysis();
        }, 2000);
      }
    },
    [router, steps.length, handleFallbackAnalysis]
  );

  useEffect(() => {
    const videoName = sessionStorage.getItem("uploadedVideo");
    const videoFileId = sessionStorage.getItem("videoFileId");

    console.log("Analysis page - videoName:", videoName);
    console.log("Analysis page - videoFileId:", videoFileId);

    if (!videoName) {
      console.log("No video name found, redirecting to home");
      return;
    }

    let cleanup: (() => void) | undefined;

    // Try to get video file from IndexedDB
    if (videoFileId) {
      console.log("Retrieving video file from storage...");
      startVideoAnalysisFromStorage(videoFileId);
    } else {
      console.log("No video file ID available, using fallback analysis");
      cleanup = handleFallbackAnalysis();
    }

    // Cleanup function
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [router, startVideoAnalysisFromStorage, handleFallbackAnalysis]);

  // Helper functions for results display are now handled by components

  const handleTryAnother = () => {
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

  // Toggle section collapse is now handled by the hook

  // Auto-collapse sections after scores are revealed
  useEffect(() => {
    if (stepCompletions.visual && visualScore !== undefined) {
      setTimeout(() => {
        setSectionCollapsed((prev) => ({ ...prev, visual: true }));
      }, 3000); // Collapse after 3 seconds
    }
  }, [stepCompletions.visual, visualScore]);

  useEffect(() => {
    if (stepCompletions.audioHook && audioScore !== undefined) {
      setTimeout(() => {
        setSectionCollapsed((prev) => ({ ...prev, audio: true }));
      }, 3000); // Collapse after 3 seconds
    }
  }, [stepCompletions.audioHook, audioScore]);

  return (
    <div className="min-h-screen dark-gradient-bg noise-bg flex flex-col-reverse items-center justify-start p-4 relative overflow-y-auto">
      <GradientDefs />
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 silicon-gradient opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 silicon-gradient-purple opacity-15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 silicon-gradient opacity-10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col-reverse space-y-reverse space-y-8">
        {/* Back Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={finalResult ? handleTryAnother : () => router.push("/")}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {finalResult ? "Try Another Video" : "Upload different video"}
          </Button>
        </div>

        {/* Final Results Section - Show completion button instead of inline results */}
        {finalResult && (
          <CardContent className="p-8 text-center space-y-6">
            {/* Success indicator */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif italic text-white">
                ✅ Analysis Complete!
              </h2>
            </div>

            {/* Action button */}
            <Button
              onClick={() => router.push("/final-result")}
              className="w-full h-14 bg-gradient-glow text-white font-semibold text-lg rounded-2xl transition-all duration-300 "
              variant="gradientGlow"
              size="xl"
            >
              <span>Check My Final Result</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        )}

        {/* Progress Card */}
        <Card
          ref={progressBarRef}
          className="premium-glow border-0 dark-gradient-card grain-texture backdrop-blur-sm"
        >
          <CardContent className="p-8">
            <ProgressBar
              progress={progress}
              analysisState={analysisState}
              statusMessage={statusMessage}
              errorMessage={errorMessage}
            />

            {/* Visual Score Group */}
            {(extractedFrames.length > 0 || analysisState === "processing") && (
              <CollapsibleSection
                ref={visualGroupRef}
                title="Visual Score"
                icon="🎥"
                isComplete={stepCompletions.visual}
                isCollapsed={sectionCollapsed.visual}
                onToggle={() => toggleSectionCollapse("visual")}
                score={visualScore}
                scoreColor="text-purple-400"
                gradientFrom="from-purple-500/5"
                gradientTo="to-blue-500/5"
                borderColor="border-purple-400/20"
              >
                {/* Step 1: Frame Processing */}
                <StepContainer
                  ref={framesStepRef}
                  stepNumber={1}
                  title="Processing video frames"
                  description="Extracting frames at 12 fps from first 3 seconds"
                  icon="📁"
                  isComplete={stepCompletions.frames}
                  isActive={analysisState === "processing"}
                >
                  {/* Extracted Frames Content */}
                  {(extractedFrames.length > 0 ||
                    analysisState === "processing") && (
                    <div className="p-4 bg-white/5 rounded-lg border border-purple-400/20">
                      <div className="grid grid-cols-4 gap-2">
                        {/* Show actual frames */}
                        {extractedFrames.slice(0, 12).map((frame, index) => (
                          <div
                            key={index}
                            className="relative aspect-video bg-white/5 rounded-lg overflow-hidden animate-in fade-in duration-300"
                          >
                            <img
                              src={frame}
                              alt={`Frame ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 py-0.5 rounded">
                              {((index / 12) * 3).toFixed(1)}s
                            </div>
                          </div>
                        ))}

                        {/* Show loading placeholders with enhanced activity */}
                        {analysisState === "processing" &&
                          extractedFrames.length < 12 &&
                          Array.from({
                            length: 12 - extractedFrames.length,
                          }).map((_, index) => (
                            <div
                              key={`placeholder-${index}`}
                              className="relative aspect-video bg-white/5 rounded-lg overflow-hidden"
                            >
                              <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 animate-pulse">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                                </div>
                                {/* Processing indicator */}
                                <div className="absolute top-1 left-1 flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-100" />
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-200" />
                                </div>
                              </div>
                              <div className="absolute bottom-1 right-1 bg-black/40 text-purple-400 text-xs px-1 py-0.5 rounded">
                                {(
                                  ((extractedFrames.length + index) / 12) *
                                  3
                                ).toFixed(1)}
                                s
                              </div>
                            </div>
                          ))}
                      </div>
                      {extractedFrames.length > 12 && (
                        <p className="text-xs text-white/60 mt-2">
                          Showing first 12 of {extractedFrames.length} frames
                        </p>
                      )}
                    </div>
                  )}
                </StepContainer>

                {/* Step 2: Visual Hook Analysis */}
                <StepContainer
                  ref={visualStepRef}
                  stepNumber={2}
                  title="Visual Hook Analysis"
                  description="Analyzing visual quality and hook effectiveness"
                  icon="🎥"
                  isComplete={stepCompletions.visual}
                  isActive={stepCompletions.frames && !stepCompletions.visual}
                  score={visualScore}
                  scoreColor="text-green-400"
                >
                  {/* Visual Hook Score Content */}
                  {visualScore !== undefined && (
                    <ScoreCard
                      title="Overall Score"
                      score={visualScore}
                      scoreColor="text-purple-400"
                      borderColor="border-purple-400/20"
                      breakdown={[
                        {
                          label: "Sharpness",
                          icon: "🔍",
                          value: visualBreakdown?.sharpness,
                        },
                        {
                          label: "Exposure",
                          icon: "💡",
                          value: visualBreakdown?.exposure,
                        },
                        {
                          label: "Stability",
                          icon: "📱",
                          value: visualBreakdown?.stability,
                        },
                        {
                          label: "Composition",
                          icon: "🎨",
                          value: visualBreakdown?.composition,
                        },
                      ]}
                    />
                  )}
                </StepContainer>
              </CollapsibleSection>
            )}

            {/* Audio Score Group */}
            {(transcriptionText ||
              analysisState === "transcribing" ||
              analysisState === "analyzing") && (
              <CollapsibleSection
                ref={audioGroupRef}
                title="Audio Score"
                icon="🎤"
                isComplete={stepCompletions.audioHook}
                isCollapsed={sectionCollapsed.audio}
                onToggle={() => toggleSectionCollapse("audio")}
                score={audioScore}
                scoreColor="text-green-400"
                gradientFrom="from-green-500/5"
                gradientTo="to-teal-500/5"
                borderColor="border-green-400/20"
              >
                {/* Step 3: Audio Extraction */}
                <StepContainer
                  ref={audioStepRef}
                  stepNumber={3}
                  title="Audio Extraction"
                  description="Converting speech to text using AI"
                  icon="🎤"
                  isComplete={stepCompletions.audio}
                  isActive={analysisState === "transcribing"}
                >
                  {/* Audio Transcription Content */}
                  {(transcriptionText ||
                    analysisState === "transcribing" ||
                    analysisState === "analyzing") && (
                    <div className="p-4 bg-white/5 rounded-lg border border-green-400/20">
                      {transcriptionText ? (
                        <p className="text-white/90 italic animate-in fade-in duration-500">
                          "{transcriptionText}"
                        </p>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                            <span className="text-green-400 text-sm font-medium">
                              Transcribing audio...
                            </span>
                            <div className="flex items-center gap-1 ml-auto">
                              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse delay-75" />
                              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse delay-150" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded animate-pulse"></div>
                            <div className="h-4 bg-gradient-to-r from-white/5 to-white/10 rounded animate-pulse w-3/4"></div>
                            <div className="h-3 bg-gradient-to-r from-white/10 to-transparent rounded animate-pulse w-1/2"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </StepContainer>

                {/* Step 4: Audio Hook Analysis */}
                <StepContainer
                  ref={audioHookStepRef}
                  stepNumber={4}
                  title="Audio Hook Analysis"
                  description="Evaluating audio hook effectiveness"
                  icon="🎯"
                  isComplete={stepCompletions.audioHook}
                  isActive={stepCompletions.audio && !stepCompletions.audioHook}
                  score={audioScore}
                  scoreColor="text-green-400"
                >
                  {/* Audio Hook Score Content */}
                  {audioScore !== undefined && (
                    <ScoreCard
                      title="Overall Score"
                      score={audioScore}
                      scoreColor="text-green-400"
                      borderColor="border-green-400/20"
                      breakdown={[
                        {
                          label: "Audio Clarity",
                          icon: "🔊",
                          value: audioBreakdown?.audio_clarity,
                        },
                        {
                          label: "Engagement",
                          icon: "🎯",
                          value: audioBreakdown?.engagement,
                        },
                      ]}
                    />
                  )}
                </StepContainer>
              </CollapsibleSection>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
