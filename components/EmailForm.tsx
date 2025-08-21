"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface EmailFormProps {
  onSuccess: (email: string) => void;
}

export function EmailForm({ onSuccess }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sendSlackNotification = async (email: string, isError = false) => {
    try {
      await fetch("/api/slack-notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          isError,
        }),
      });
    } catch (error) {
      console.error("Failed to send Slack notification:", error);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { error: supabaseError } = await supabase
        .from("waitlist_users")
        .insert([
          {
            email: email.trim().toLowerCase(),
          },
        ]);

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          setError("This email is already on our waitlist!");
        } else {
          throw supabaseError;
        }
      } else {
        await sendSlackNotification(email.trim().toLowerCase());
        onSuccess(email);
      }
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      await sendSlackNotification(email.trim().toLowerCase(), true);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div className="relative">
        <Mail className="w-5 h-5 text-white/40 absolute left-4 top-1/2 transform -translate-y-1/2" />
        <Input
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl focus:border-blue-400 focus:ring-blue-400/20"
          disabled={isSubmitting}
        />
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <Button
        type="submit"
        disabled={isSubmitting || !email.trim()}
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Joining Waitlist...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5" />
            <span>Join Waitlist & Get 50% Off</span>
          </div>
        )}
      </Button>

      <div className="text-center mt-6">
        <p className="text-xs text-white/50">
          Free analysis • No spam • Unsubscribe anytime
        </p>
      </div>
    </form>
  );
}
