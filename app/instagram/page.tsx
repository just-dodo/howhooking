"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn } from "lucide-react";
import { GradientDefs } from "@/components/GradientDefs";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";

export default function InstagramPage() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleInstagramLogin = () => {
    setIsConnecting(true);
    
    const authUrl = 'https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=4294457534108488&redirect_uri=https://howhooking.com/instagram&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights';
    
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen dark-gradient-bg noise-bg flex items-center justify-center p-4 relative overflow-hidden">
      <GradientDefs />
      <BackgroundOrbs />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="premium-glow border-0 dark-gradient-card grain-texture">
          <CardContent className="p-10 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Connect Instagram Business
              </h1>
              <p className="text-white/60">
                Connect your Instagram Business account to unlock advanced content management and analytics features
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="text-left space-y-3">
                <div className="flex items-center text-white/80">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-3" />
                  Manage your business content
                </div>
                <div className="flex items-center text-white/80">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-3" />
                  Publish and schedule posts
                </div>
                <div className="flex items-center text-white/80">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-3" />
                  Access business insights
                </div>
                <div className="flex items-center text-white/80">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-3" />
                  Manage messages and comments
                </div>
              </div>
            </div>

            <Button
              onClick={handleInstagramLogin}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isConnecting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  Connect Instagram Business
                </div>
              )}
            </Button>

            <p className="text-xs text-white/40 mt-4">
              We only access basic profile information and media. Your data is secure and never shared.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}