export type AnalysisState = "idle" | "processing" | "transcribing" | "analyzing" | "completed" | "error"

export interface VisualBreakdown {
  sharpness: number
  exposure: number
  stability: number
  composition: number
}

export interface AudioBreakdown {
  audio_clarity: number
  engagement: number
}

export interface StepCompletions {
  frames: boolean
  visual: boolean
  audio: boolean
  audioHook: boolean
}

export interface SectionCollapsed {
  visual: boolean
  audio: boolean
}

export interface AnalysisStep {
  title: string
  description: string
  icon: string
  key: keyof StepCompletions
}

export interface FallbackResult {
  overall_score: number
  breakdown: {
    sharpness: number
    exposure: number
    stability: number
    audio_clarity: number
    engagement: number
    composition: number
  }
  comments: string[]
  confidence: number
}