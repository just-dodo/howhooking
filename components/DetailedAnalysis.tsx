"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Eye,
  Palette,
  Camera,
  Volume2,
  TrendingUp,
  Maximize,
} from "lucide-react";

interface AnalysisBreakdown {
  sharpness: number;
  exposure: number;
  stability: number;
  audio_clarity: number;
  engagement: number;
  composition: number;
}

interface DetailedAnalysisProps {
  breakdown: AnalysisBreakdown;
  comments: string[];
  transcription?: { text: string };
  confidence: number;
}

interface MetricItemProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

function MetricItem({ icon, title, value, color }: MetricItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 glass-morphism rounded-xl flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-semibold">{title}</span>
          <span className="text-sm font-bold text-white">{value}/100</span>
        </div>
        <Progress value={value} className="h-2 bg-white/10" />
      </div>
    </div>
  );
}

export function DetailedAnalysis({
  breakdown,
  comments,
  transcription,
  confidence,
}: DetailedAnalysisProps) {
  const metrics = [
    {
      icon: <Eye className="w-6 h-6 text-blue-400" />,
      title: "Sharpness & Clarity",
      value: breakdown.sharpness,
      color: "text-blue-400",
    },
    {
      icon: <Palette className="w-6 h-6 text-yellow-400" />,
      title: "Exposure & Lighting",
      value: breakdown.exposure,
      color: "text-yellow-400",
    },
    {
      icon: <Camera className="w-6 h-6 text-green-400" />,
      title: "Camera Stability",
      value: breakdown.stability,
      color: "text-green-400",
    },
    {
      icon: <Volume2 className="w-6 h-6 text-purple-400" />,
      title: "Audio Clarity",
      value: breakdown.audio_clarity,
      color: "text-purple-400",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-pink-400" />,
      title: "Engagement Factor",
      value: breakdown.engagement,
      color: "text-pink-400",
    },
    {
      icon: <Maximize className="w-6 h-6 text-orange-400" />,
      title: "Composition",
      value: breakdown.composition,
      color: "text-orange-400",
    },
  ];

  return (
    <CardContent className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-6 h-6 text-gradient-purple" />
        <h3 className="text-2xl font-bold text-white">Detailed Analysis</h3>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          AI-Powered
        </Badge>
      </div>
{/* 
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <MetricItem key={index} {...metric} />
        ))}
      </div> */}

      {/* AI Comments */}
      {comments.length > 0 && (
        <div className="mt-6 p-6 glass-morphism rounded-xl border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">AI Insights</h4>
          <div className="space-y-3">
            {comments.slice(0, 3).map((comment, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-white/80 text-sm">{comment}</p>
              </div>
            ))}
          </div>

          {/* Transcription */}
          {transcription?.text && (
            <div className="mt-4 pt-4">
              <Separator className="mb-4 bg-white/10" />
              <h5 className="text-sm font-semibold text-white mb-2">
                Transcription
              </h5>
              <p className="text-white/70 text-sm italic">
                "{transcription.text}"
              </p>
            </div>
          )}

          {confidence > 0 && (
            <div className="mt-4 pt-4">
              <Separator className="mb-4 bg-white/10" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Analysis Confidence</span>
                <span className="text-white font-semibold">
                  {confidence * 100}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </CardContent>
  );
}
