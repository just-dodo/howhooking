/**
 * LLM client for multi-modal video analysis using Vercel AI SDK
 */

import { ProcessedVideo } from './video-processor';
import { TranscriptionResult } from './audio-transcription';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Zod schema for structured output
const videoAnalysisSchema = z.object({
  overall_score: z.number().min(0).max(100),
  breakdown: z.object({
    sharpness: z.number().min(0).max(100),
    exposure: z.number().min(0).max(100),
    stability: z.number().min(0).max(100),
    audio_clarity: z.number().min(0).max(100),
    engagement: z.number().min(0).max(100),
    composition: z.number().min(0).max(100),
  }),
  comments: z.array(z.string()).max(5),
  confidence: z.number().min(0).max(100),
});

export interface VideoAnalysisResult {
  overall_score: number;
  breakdown: {
    sharpness: number;
    exposure: number;
    stability: number;
    audio_clarity: number;
    engagement: number;
    composition: number;
  };
  comments: string[];
  confidence: number;
  transcription?: TranscriptionResult;
}

export interface LLMConfig {
  model?: string;
  temperature?: number;
  maxRetries?: number;
}

export class LLMVideoAnalyzer {
  private config: LLMConfig;

  constructor(config: LLMConfig = {}) {
    this.config = {
      model: 'gpt-4o',
      temperature: 0.3,
      maxRetries: 3,
      ...config
    };
  }

  /**
   * Analyze video using Vercel AI SDK with structured output
   */
  async analyzeVideo(
    processedVideo: ProcessedVideo,
    transcription?: TranscriptionResult,
    retryCount = 0
  ): Promise<VideoAnalysisResult> {
    try {
      const { frames, duration, metadata } = processedVideo;
      
      const systemPrompt = this.buildSystemPrompt(transcription);
      const userContent = this.buildUserContent(frames, duration, metadata, transcription);

      const { object } = await generateObject({
        model: openai(this.config.model || 'gpt-4o'),
        temperature: this.config.temperature,
        schema: videoAnalysisSchema,
        system: systemPrompt,
        prompt: userContent,
      });

      const result: VideoAnalysisResult = {
        overall_score: object.overall_score,
        breakdown: object.breakdown,
        comments: object.comments,
        confidence: object.confidence
      };

      // Include transcription in result
      if (transcription) {
        result.transcription = transcription;
      }
      
      return result;
    } catch (error) {
      if (retryCount < (this.config.maxRetries || 3)) {
        console.warn(`AI analysis failed, retrying... (${retryCount + 1}/${this.config.maxRetries || 3})`);
        await this.delay(1000 * Math.pow(2, retryCount)); // Exponential backoff
        return this.analyzeVideo(processedVideo, transcription, retryCount + 1);
      }
      
      // Enhanced error logging for v5
      console.error('AI SDK analysis failed after retries:', {
        error: error instanceof Error ? error.message : String(error),
        retryCount,
        model: this.config.model,
        hasFrames: processedVideo.frames.length > 0,
        hasTranscription: !!transcription
      });
      
      throw error;
    }
  }

  /**
   * Build system prompt for analysis
   */
  private buildSystemPrompt(transcription?: TranscriptionResult): string {
    return `You are a professional video quality analyzer specializing in hook analysis. Analyze the provided video frames and audio transcription to give a comprehensive quality score from 0-100 and detailed breakdown.

This is a HOOK ANALYSIS - focus on the first 3 seconds that determine viewer retention:

Consider these factors:
- **Sharpness**: Image clarity, focus, resolution quality
- **Exposure**: Lighting quality, brightness, contrast
- **Stability**: Camera shake, smooth motion, steadiness  
- **Audio Clarity**: Sound quality, noise levels, clarity
- **Engagement**: Hook effectiveness, attention-grabbing elements, viewer retention potential
- **Composition**: Framing, rule of thirds, visual balance

${transcription?.text ? `IMPORTANT: Consider the spoken content: "${transcription.text}" - analyze how well it works as a hook to capture attention.` : ''}`;
  }

  /**
   * Build user content for analysis
   */
  private buildUserContent(frames: any[], duration: number, metadata: any, transcription?: TranscriptionResult): any[] {
    return [
      {
        type: 'text' as const,
        text: `Analyze this ${duration.toFixed(1)}s hook video (first 3 seconds) with resolution ${metadata.width}x${metadata.height}, ${frames.length} frames at 12fps:`,
      },
      ...frames.map((frame) => ({
        type: 'image' as const,
        image: frame.dataUrl
      })),
      {
        type: 'text' as const,
        text: `Audio analysis: ${metadata.hasAudio ? 'Video has audio track.' : 'Video has no audio track.'} ${transcription?.text ? `\n\nTranscription: "${transcription.text}"\n\nAnalyze how effectively this spoken content works as a hook to capture viewer attention in the first 3 seconds.` : ''}`
      }
    ];
  }


  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}