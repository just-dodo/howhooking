"use client"

import { useState, useCallback } from "react"
import { 
  AnalysisState, 
  VisualBreakdown, 
  AudioBreakdown, 
  StepCompletions, 
  SectionCollapsed 
} from "@/lib/analyzing/types"
import { VideoAnalysisResult } from "@/lib/video-analysis/client-video-analyzer"

export function useAnalysisState() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<string>("Ready to analyze")
  const [extractedFrames, setExtractedFrames] = useState<string[]>([])
  const [transcriptionText, setTranscriptionText] = useState<string>("")
  const [visualScore, setVisualScore] = useState<number | undefined>()
  const [audioScore, setAudioScore] = useState<number | undefined>()
  const [visualBreakdown, setVisualBreakdown] = useState<VisualBreakdown | undefined>()
  const [audioBreakdown, setAudioBreakdown] = useState<AudioBreakdown | undefined>()
  const [stepCompletions, setStepCompletions] = useState<StepCompletions>({
    frames: false,
    visual: false,
    audio: false,
    audioHook: false,
  })
  const [sectionCollapsed, setSectionCollapsed] = useState<SectionCollapsed>({
    visual: false,
    audio: false,
  })
  const [finalResult, setFinalResult] = useState<VideoAnalysisResult | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [potentialScore, setPotentialScore] = useState(0)
  const [videoName, setVideoName] = useState("")

  const toggleSectionCollapse = useCallback((section: "visual" | "audio") => {
    setSectionCollapsed((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const resetAnalysis = useCallback(() => {
    setCurrentStep(0)
    setProgress(0)
    setAnalysisState("idle")
    setErrorMessage("")
    setStatusMessage("Ready to analyze")
    setExtractedFrames([])
    setTranscriptionText("")
    setVisualScore(undefined)
    setAudioScore(undefined)
    setVisualBreakdown(undefined)
    setAudioBreakdown(undefined)
    setStepCompletions({
      frames: false,
      visual: false,
      audio: false,
      audioHook: false,
    })
    setSectionCollapsed({
      visual: false,
      audio: false,
    })
    setFinalResult(null)
    setIsSigningIn(false)
    setPotentialScore(0)
    setVideoName("")
  }, [])

  return {
    // State
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
    isSigningIn,
    potentialScore,
    videoName,
    // Setters
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
    setIsSigningIn,
    setPotentialScore,
    setVideoName,
    // Actions
    toggleSectionCollapse,
    resetAnalysis,
  }
}