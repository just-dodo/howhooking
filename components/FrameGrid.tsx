"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface FrameGridProps {
  frames: string[]
  isProcessing: boolean
  maxFrames?: number
}

export function FrameGrid({ frames, isProcessing, maxFrames = 12 }: FrameGridProps) {
  const displayFrames = frames.slice(0, maxFrames)
  const remainingSlots = maxFrames - displayFrames.length

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-purple-400/20">
      <div className="grid grid-cols-4 gap-2">
        {/* Show actual frames */}
        {displayFrames.map((frame, index) => (
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
              {((index / maxFrames) * 3).toFixed(1)}s
            </div>
          </div>
        ))}

        {/* Show loading placeholders */}
        {isProcessing &&
          remainingSlots > 0 &&
          Array.from({ length: remainingSlots }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="relative aspect-video rounded-lg overflow-hidden"
            >
              <Skeleton className="w-full h-full bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                </div>
                {/* Processing indicator */}
                <div className="absolute top-1 left-1 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-100" />
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-200" />
                </div>
              </Skeleton>
              <div className="absolute bottom-1 right-1 bg-black/40 text-purple-400 text-xs px-1 py-0.5 rounded">
                {(((displayFrames.length + index) / maxFrames) * 3).toFixed(1)}s
              </div>
            </div>
          ))}
      </div>
      
      {frames.length > maxFrames && (
        <p className="text-xs text-white/60 mt-2">
          Showing first {maxFrames} of {frames.length} frames
        </p>
      )}
    </div>
  )
}