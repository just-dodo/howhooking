"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface TranscriptionDisplayProps {
  text?: string
  isLoading: boolean
}

export function TranscriptionDisplay({ text, isLoading }: TranscriptionDisplayProps) {
  return (
    <div className="p-4 bg-white/5 rounded-lg border border-green-400/20">
      {text ? (
        <p className="text-white/90 italic animate-in fade-in duration-500">
          "{text}"
        </p>
      ) : isLoading ? (
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
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-3/4 bg-white/10" />
            <Skeleton className="h-3 w-1/2 bg-white/10" />
          </div>
        </div>
      ) : null}
    </div>
  )
}