"use client";

import { HookScoreCard } from "./HookScoreCard";

interface HookScoresSectionProps {
  breakdown: {
    sharpness?: number;
    exposure?: number;
    stability?: number;
    composition?: number;
    audio_clarity?: number;
    engagement?: number;
  };
}

export function HookScoresSection({ breakdown }: HookScoresSectionProps) {
  // Calculate average scores
  const visualScore = Math.round(
    ((breakdown?.sharpness || 0) +
      (breakdown?.exposure || 0) +
      (breakdown?.stability || 0) +
      (breakdown?.composition || 0)) /
      4
  );

  const audioScore = Math.round(
    ((breakdown?.audio_clarity || 0) + (breakdown?.engagement || 0)) / 2
  );

  // Visual score items
  const visualItems = [
    { label: "Sharpness", icon: "🔍", value: breakdown?.sharpness },
    { label: "Exposure", icon: "💡", value: breakdown?.exposure },
    { label: "Stability", icon: "📱", value: breakdown?.stability },
    { label: "Composition", icon: "🎨", value: breakdown?.composition },
  ];

  // Audio score items
  const audioItems = [
    { label: "Audio Clarity", icon: "🔊", value: breakdown?.audio_clarity },
    { label: "Engagement", icon: "🎯", value: breakdown?.engagement },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          Detailed Score Breakdown
        </h3>
        <p className="text-white/60 text-sm">
          See how your visual and audio elements performed
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <HookScoreCard
          title="Visual Hook"
          icon="🎥"
          score={visualScore}
          items={visualItems}
          gradientFrom="from-purple-500/10"
          gradientTo="to-blue-500/10"
          borderColor="border-purple-400/20"
          scoreColor="text-purple-400"
          ringStartColor="#A855F7"
          ringEndColor="#7C3AED"
        />

        <HookScoreCard
          title="Audio Hook"
          icon="🎤"
          score={audioScore}
          items={audioItems}
          gradientFrom="from-green-500/10"
          gradientTo="to-teal-500/10"
          borderColor="border-green-400/20"
          scoreColor="text-green-400"
          ringStartColor="#10B981"
          ringEndColor="#059669"
        />
      </div>
    </div>
  );
}
