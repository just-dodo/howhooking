"use client";

import { forwardRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  Eye,
  Zap,
  Target,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CTACardProps {
  currentScore: number;
  potentialScore: number;
  onWaitlistClick: () => void;
  className?: string;
}

const validateScores = (current: number, potential: number) => {
  const isValidCurrent =
    typeof current === "number" &&
    !isNaN(current) &&
    current >= 0 &&
    current <= 100;
  const isValidPotential =
    typeof potential === "number" &&
    !isNaN(potential) &&
    potential >= 0 &&
    potential <= 100;
  const isLogical = potential >= current;

  return {
    isValid: isValidCurrent && isValidPotential && isLogical,
    safeCurrent: isValidCurrent ? Math.round(current) : 0,
    safePotential: isValidPotential ? Math.round(potential) : 100,
  };
};

const AnimatedCounter = ({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(end * progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

const PremiumBarChart = ({
  currentScore,
  potentialScore,
}: {
  currentScore: number;
  potentialScore: number;
}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const currentHeight = (currentScore / 100) * 100;
  const potentialHeight = (potentialScore / 100) * 100;

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-xl" />

      <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/90">
              Potential Analysis
            </span>
          </div>
          {/* <h3 className="text-2xl font-semibold text-white mb-2">
            Performance Comparison
          </h3> */}
          <p className="text-white/60 text-sm">
            See your improvement potential
          </p>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-center gap-16 mb-8">
          {/* Current Score */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-white mb-1">
                <AnimatedCounter end={currentScore} />
              </div>
              <div className="text-sm text-white/50 font-medium">
                Current Score
              </div>
            </div>

            <div className="relative w-20 h-40 bg-gradient-to-t from-gray-800/50 to-gray-700/30 rounded-2xl overflow-hidden border border-white/10">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-px bg-white/20"
                    style={{ bottom: `${(i + 1) * 25}%` }}
                  />
                ))}
              </div>

              {/* Animated bar */}
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-gray-500 via-gray-400 to-gray-300 transition-all duration-2000 ease-out rounded-t-2xl"
                style={{
                  height: animated ? `${currentHeight}%` : "0%",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-t-2xl" />
              </div>
            </div>
          </div>

          {/* Potential Score */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                <AnimatedCounter end={potentialScore} />
              </div>
              <div className="text-sm text-blue-400 font-medium">
                Potential Score
              </div>
            </div>

            <div className="relative w-20 h-40 bg-gradient-to-t from-blue-900/30 to-blue-800/20 rounded-2xl overflow-hidden border border-blue-400/30">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-px bg-blue-400/30"
                    style={{ bottom: `${(i + 1) * 25}%` }}
                  />
                ))}
              </div>

              {/* Animated bar */}
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 transition-all duration-2000 ease-out delay-500 rounded-t-2xl shadow-lg shadow-blue-500/25"
                style={{
                  height: animated ? `${potentialHeight}%` : "0%",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 rounded-t-2xl" />
                <div className="absolute inset-0 bg-blue-400/20 blur-sm rounded-t-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({
  icon,
  value,
  label,
  gradient,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  gradient: string;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-700 transform",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-2xl"
        style={{ background: gradient }}
      />
      <div className="relative bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl p-4 border border-white/10 gap-2 w-full align-middle hover:border-white/20 transition-all duration-300">
        <div className="flex items-center  opacity-50">{icon}</div>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-xs sm:text-sm w-full text-center text-white/70 font-medium ">
          {label}
        </div>
      </div>
    </div>
  );
};

export const CTACard = forwardRef<HTMLDivElement, CTACardProps>(
  ({ currentScore, potentialScore, onWaitlistClick, className }, ref) => {
    const { isValid, safeCurrent, safePotential } = validateScores(
      currentScore,
      potentialScore
    );
    const improvement = safePotential - safeCurrent;
    const hasImprovement = improvement > 0;

    if (!isValid || !hasImprovement) {
      return (
        <Card
          ref={ref}
          className={cn(
            "border border-amber-500/30 bg-amber-500/10",
            className
          )}
        >
          <CardContent className="p-8 text-center">
            <div className="text-amber-400 text-xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-amber-300 mb-2">
              Invalid Analysis Data
            </h3>
            <p className="text-sm text-white/70">
              Please ensure valid score values are provided for comparison.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-8", className)}>
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif italic text-white">
            You have much more <br />
            <span className="text-4xl font-bold text-gradient-glow  text-transparent">
              POTENTIAL
            </span>
          </h2>
        </div>

        {/* Premium Bar Chart */}
        <PremiumBarChart
          currentScore={safeCurrent}
          potentialScore={safePotential}
        />

        {/* Impact Metrics */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xl font-serif italic text-white/90">
              Which means...
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              icon={<Eye className="w-5 h-5 text-blue-400" />}
              value="+12%"
              label="More Views"
              gradient="linear-gradient(135deg, #3B82F6, #1D4ED8)"
            />
            <MetricCard
              icon={<Zap className="w-5 h-5 text-purple-400" />}
              value="+34%"
              label="Engagement"
              gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)"
            />
            <MetricCard
              icon={<Target className="w-5 h-5 text-emerald-400" />}
              value="+44%"
              label="Improvement"
              gradient="linear-gradient(135deg, #10B981, #059669)"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-playfair italic text-white">
            Uhuh, So What?
          </h1>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20" />
            <Button
              onClick={onWaitlistClick}
              className={cn(
                "relative w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
                "text-white font-semibold text-lg rounded-2xl transition-all duration-300",
                "shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]",
                "border border-blue-400/30"
              )}
            >
              <div className="flex items-center gap-3">
                <span>I mean, How?</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-white/50">
              Free analysis • No credit card required • Instant results
            </p>
          </div>
        </div>
      </div>
    );
  }
);

CTACard.displayName = "CTACard";
