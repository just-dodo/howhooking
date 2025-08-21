"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { GradientDefs } from "@/components/GradientDefs";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";

interface SuccessViewProps {
  email: string;
}

export function SuccessView({ email }: SuccessViewProps) {
  const router = useRouter();

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

  return (
    <div className="min-h-screen dark-gradient-bg noise-bg flex items-center justify-center p-4 relative overflow-hidden">
      <GradientDefs />
      <BackgroundOrbs />

      <div className="w-full max-w-md relative z-10">
        <Card className="premium-glow border-0 dark-gradient-card grain-texture mb-8">
          <CardContent className="p-10 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/25">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              You're on the waitlist!
            </h1>
            <p className="text-white/70 mb-8 leading-relaxed text-lg">
              We'll email you at{" "}
              <span className="text-blue-400 font-semibold">{email}</span> when
              we launch.
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleTryAnother}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                Analyze Another Video
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="w-full text-white/60 hover:text-white/80 hover:bg-white/5"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-white/50">
            Keep creating amazing content while you wait! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
