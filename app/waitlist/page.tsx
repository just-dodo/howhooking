"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  ArrowLeft,
  BarChart3,
  Send,
  MonitorUp,
  Boxes,
  FileChartColumnIncreasing,
  Film,
  Bot,
} from "lucide-react";
import { GradientDefs } from "@/components/GradientDefs";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";
import { WaitlistHeader } from "@/components/WaitlistHeader";
import { FeatureCard } from "@/components/FeatureCard";
import { FeatureSection } from "@/components/FeatureSection";
import { EmailForm } from "@/components/EmailForm";
import { SuccessView } from "@/components/SuccessView";

export default function WaitlistPage() {
  const router = useRouter();
  const [submittedEmail, setSubmittedEmail] = useState("");

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

  const handleEmailSuccess = (email: string) => {
    setSubmittedEmail(email);
  };

  if (submittedEmail) {
    return <SuccessView email={submittedEmail} />;
  }

  return (
    <div className="min-h-screen dark-gradient-bg noise-bg flex items-center justify-center p-4 relative overflow-hidden">
      <GradientDefs />
      <BackgroundOrbs />

      <div className="w-full max-w-lg relative z-10">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>

        <Card className="premium-glow border-0 dark-gradient-card grain-texture mb-8 overflow-visible">
          <CardContent className="p-10 overflow-visible">
            <WaitlistHeader />

            <div className="space-y-6 mb-8">
              <FeatureSection
                title="✲ Hook Library"
                subtitle="We've curated a library of 1000+ effective hooks."
                alignment="start"
              >
                <FeatureCard
                  icon={TrendingUp}
                  title="Auto Trending Research"
                  description="Your AI companion is always scrolling instead of you, even when you sleep"
                  iconColor="text-orange-400"
                />
                <FeatureCard
                  icon={Boxes}
                  title="Hook Examples"
                  description="See what kind of hooks are there and how viral they went - so you can use them"
                  iconColor="text-orange-400"
                />
              </FeatureSection>

              <FeatureSection
                title="✲ AI Hooking Guide"
                subtitle="We'll help you to find the best fit hook for your video."
                alignment="end"
              >
                <FeatureCard
                  icon={Sparkles}
                  title="The Best Fit Hook"
                  description="I know I know. You know some hooks but don't know which one to use. We'll find the best fit for you based on data. Both of Visual & Audio"
                  iconColor="text-purple-400"
                />
                <FeatureCard
                  icon={FileChartColumnIncreasing}
                  title="Advanced Analysis Report & Guide"
                  description="Get a detailed analysis and get detailed suggestions by AI & hook masters"
                  iconColor="text-purple-400"
                />
              </FeatureSection>

              <FeatureSection
                title="✲ After 3 Seconds - "
                subtitle="Hook, then what? We'll help you with the entire video as well as the first 3 seconds"
                alignment="start"
              >
                <FeatureCard
                  icon={Film}
                  title="Entire Video Analysis"
                  description="We'll analyze the entire video and give you detailed suggestions"
                  iconColor="text-green-400"
                />
                <FeatureCard
                  icon={Bot}
                  title="AI Agent for Short Form Creators"
                  description="Imagine, it sets up your profile, plan videos, generate content, upload it to multiple platforms. All you need to do is just confirm."
                  iconColor="text-green-400"
                />
              </FeatureSection>
            </div>

            <EmailForm onSuccess={handleEmailSuccess} />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleTryAnother}
            className="text-white/40 hover:text-white/60 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Try Another Video Instead
          </Button>
        </div>
      </div>
    </div>
  );
}
