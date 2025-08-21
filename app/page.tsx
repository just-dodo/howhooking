"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, Zap, Volume2 } from "lucide-react";
import { videoStorage } from "@/lib/video-storage";
import { GradientDefs } from "@/components/GradientDefs";

export default function LandingPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith("video/")) {
      console.log(
        "File selected:",
        file.name,
        "Size:",
        file.size,
        "Type:",
        file.type
      );
      setSelectedFile(file);

      try {
        // Store file in IndexedDB to avoid sessionStorage size limits
        const fileId = await videoStorage.storeFile(file);

        // Store metadata in sessionStorage
        sessionStorage.setItem("uploadedVideo", file.name);
        sessionStorage.setItem("videoFileId", fileId);
        sessionStorage.setItem("videoFileSize", file.size.toString());

        console.log("File stored with ID:", fileId);

        setTimeout(() => {
          console.log("Navigating to analyzing page");
          router.push("/analyzing");
        }, 300);
      } catch (error) {
        console.error("Error storing video file:", error);
        // Fallback: just store metadata and proceed with basic analysis
        sessionStorage.setItem("uploadedVideo", file.name);
        setTimeout(() => {
          router.push("/analyzing");
        }, 300);
      }
    } else {
      console.log("Invalid file type or no file selected");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      className={`min-h-screen dark-gradient-bg noise-bg flex items-center justify-center p-4 relative overflow-hidden transition-all duration-300 ${
        isDragging ? "bg-brand-secondary/5 backdrop-blur-sm" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <GradientDefs />
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 silicon-gradient opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 silicon-gradient-purple opacity-15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 silicon-gradient opacity-10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-white mb-6 tracking-tight">
            <span className="text-text-primary font-playfair italic leading-normal text-5xl">
              Never Upload
            </span>
            <br />
            <span className="text-text-secondary font-extralight leading-normal ">
              before you know
            </span>
            <br />
            <span className="text-gradient-glow font-bold leading-none text-5xl">
              {" "}
              How Hooking
            </span>
            <br />
            <span className="text-text-secondary font-extralight  leading-none">
              your video is
            </span>
          </h1>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-morphism mb-8 premium-glow grain-texture-subtle">
            <Zap className="w-5 h-5 svg-gradient-purple outline-none" />
            <span className="text-sm font-semibold text-text-primary">
              AI-Powered First 3 Seconds Analysis
            </span>
            <div className="w-2 h-2 silicon-gradient-purple rounded-full animate-pulse" />
          </div>
          <p className="text-xl text-text-muted font-light leading-relaxed max-w-sm mx-auto">
            Upload your short-form video and
            <br />
            <strong className="text-text-primary">
              score your first three seconds
            </strong>
            <br />– totally free & your video is not stored
          </p>
        </div>

        {/* Upload Button */}
        <button
          className={`relative w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-500 cursor-pointer ${
            isDragging
              ? "border-brand-secondary/50 bg-brand-secondary/10 scale-105 premium-glow-purple"
              : selectedFile
              ? "border-success/50 bg-success/10 premium-glow"
              : "border-surface-glass-border hover:border-text-ghost hover:bg-surface-glass hover:scale-105"
          } premium-glow dark-gradient-card grain-texture`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto premium-glow">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="font-bold text-white text-base">
                  {selectedFile.name}
                </p>
                <p className="text-text-subtle mt-1 text-sm">
                  Ready to analyze
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 glass-morphism rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-text-subtle" />
              </div>
              <div>
                <p className="font-bold text-white text-base">
                  Drop your video here
                </p>
                <p className="text-text-subtle mt-1 text-sm">
                  or click to browse
                </p>
                <p className="text-xs text-text-ghost mt-3">
                  Max 120 seconds • MP4, MOV, AVI
                </p>
              </div>
            </div>
          )}
        </button>

        <input
          id="file-input"
          type="file"
          accept="video/*"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0])
          }
          className="hidden"
        />

        {/* Footer */}
        <div className="text-center mt-10">
          <div className="flex items-center justify-center gap-8 text-sm text-text-faint">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Free analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-info rounded-full animate-pulse" />
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse" />
              <span>Your video is not stored</span>
            </div>
          </div>
          
          {/* Copyright and Contact */}
          <div className="mt-8 pt-6 ">
            <p className="text-xs text-text-ghost">
              © 2025 HowHooking. All rights reserved.
            </p>
            <p className="text-xs text-text-ghost mt-1">
              Contact: <a href="mailto:dodo41142727@gmail.com" className="text-text-subtle hover:text-text-primary transition-colors">dodo41142727@gmail.com</a> | <a href="https://x.com/callmejustdodo" target="_blank" rel="noopener noreferrer" className="text-text-subtle hover:text-text-primary transition-colors">@callmejustdodo</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
