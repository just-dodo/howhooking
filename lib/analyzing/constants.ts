import { AnalysisStep } from "./types"

export const ANALYSIS_STEPS: AnalysisStep[] = [
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
]

export const FALLBACK_ANALYSIS = {
  STEP_DURATION: 900,
  PROGRESS_INTERVAL: 70,
  PROGRESS_INCREMENT: 1.5,
  FALLBACK_DELAY: 2000,
}

export const SCROLL_CONFIG = {
  OFFSET: 100, // Account for sticky header
  DELAY: 500,
  FINAL_RESULTS_DELAY: 1500,
}

export const AUTO_COLLAPSE_DELAY = 3000 // 3 seconds

export const SESSION_STORAGE_KEYS = {
  UPLOADED_VIDEO: "uploadedVideo",
  VIDEO_FILE_ID: "videoFileId",
  VIDEO_FILE_SIZE: "videoFileSize",
  ANALYSIS_RESULT: "analysisResult",
  HOOK_SCORE: "hookScore",
  EXTRACTED_FRAMES: "extractedFrames",
  TRANSCRIPTION_TEXT: "transcriptionText",
  UPLOADED_VIDEO_FILE: "uploadedVideoFile",
} as const