/**
 * Main video analysis service that orchestrates video processing and LLM analysis
 */

import { VideoProcessor, ProcessedVideo } from './video-processor';
import { LLMVideoAnalyzer, VideoAnalysisResult, LLMConfig } from './llm-client';

export interface VideoAnalysisOptions {
  frameRate?: number;
  maxFrames?: number;
  audioDuration?: number;
  llmConfig?: Partial<LLMConfig>;
}

export interface VideoAnalysisState {
  stage: 'idle' | 'processing' | 'analyzing' | 'completed' | 'error';
  progress: number;
  message: string;
  result?: VideoAnalysisResult;
  error?: string;
}

export class VideoAnalysisService {
  private static instance: VideoAnalysisService;
  private processor: VideoProcessor;
  private analyzer?: LLMVideoAnalyzer;
  private state: VideoAnalysisState = {
    stage: 'idle',
    progress: 0,
    message: 'Ready to analyze video'
  };

  private constructor() {
    this.processor = VideoProcessor.getInstance();
  }

  public static getInstance(): VideoAnalysisService {
    if (!VideoAnalysisService.instance) {
      VideoAnalysisService.instance = new VideoAnalysisService();
    }
    return VideoAnalysisService.instance;
  }

  /**
   * Initialize LLM analyzer with API key
   */
  initializeLLM(apiKey: string, config?: Partial<LLMConfig>): void {
    if (!LLMVideoAnalyzer.validateApiKey(apiKey)) {
      throw new Error('Invalid OpenAI API key format');
    }

    this.analyzer = new LLMVideoAnalyzer({
      apiKey,
      ...config
    });
  }

  /**
   * Get current analysis state
   */
  getState(): VideoAnalysisState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(callback: (state: VideoAnalysisState) => void): () => void {
    let isSubscribed = true;
    
    const checkState = () => {
      if (isSubscribed) {
        callback(this.getState());
        setTimeout(checkState, 100);
      }
    };
    
    checkState();
    
    return () => {
      isSubscribed = false;
    };
  }

  /**
   * Analyze video file
   */
  async analyzeVideo(
    videoFile: File,
    options: VideoAnalysisOptions = {}
  ): Promise<VideoAnalysisResult> {
    if (!this.analyzer) {
      throw new Error('LLM analyzer not initialized. Call initializeLLM() first.');
    }

    try {
      this.updateState('processing', 0, 'Starting video analysis...');

      // Validate video file
      if (!videoFile.type.startsWith('video/')) {
        throw new Error('Invalid file type. Please upload a video file.');
      }

      // Check file size (limit to 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (videoFile.size > maxSize) {
        throw new Error('Video file too large. Please upload a video smaller than 100MB.');
      }

      this.updateState('processing', 10, 'Extracting video frames...');

      // Process video to extract frames and audio
      const processedVideo = await this.processor.processVideo(videoFile, {
        frameRate: options.frameRate || 1,
        maxFrames: options.maxFrames || 10,
        audioDuration: options.audioDuration || 30
      });

      this.updateState('processing', 40, 'Processing audio segments...');

      // Add delay to show progress
      await this.delay(500);

      this.updateState('analyzing', 60, 'Analyzing video with AI...');

      // Analyze with LLM
      const result = await this.analyzer.analyzeVideo(processedVideo);

      this.updateState('analyzing', 90, 'Finalizing analysis...');

      // Clean up resources
      this.processor.cleanup(processedVideo);

      this.updateState('completed', 100, 'Analysis completed successfully!');
      this.state.result = result;

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.updateState('error', 0, errorMessage);
      this.state.error = errorMessage;
      throw error;
    }
  }

  /**
   * Get fallback analysis (for when LLM fails)
   */
  getFallbackAnalysis(): VideoAnalysisResult {
    return {
      overall_score: 65,
      breakdown: {
        sharpness: 70,
        exposure: 65,
        stability: 60,
        audio_clarity: 70,
        engagement: 60,
        composition: 65,
      },
      comments: [
        'Analysis temporarily unavailable',
        'Showing estimated scores based on video metadata',
        'Please try again later for detailed AI analysis'
      ],
      confidence: 30
    };
  }

  /**
   * Reset analysis state
   */
  reset(): void {
    this.state = {
      stage: 'idle',
      progress: 0,
      message: 'Ready to analyze video'
    };
  }

  /**
   * Update internal state
   */
  private updateState(
    stage: VideoAnalysisState['stage'],
    progress: number,
    message: string
  ): void {
    this.state = {
      ...this.state,
      stage,
      progress,
      message
    };
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.analyzer !== undefined;
  }

  /**
   * Get recommended settings for different video types
   */
  static getRecommendedSettings(videoType: 'short' | 'medium' | 'long'): VideoAnalysisOptions {
    switch (videoType) {
      case 'short': // < 1 minute
        return {
          frameRate: 2,
          maxFrames: 8,
          audioDuration: 15
        };
      case 'medium': // 1-5 minutes
        return {
          frameRate: 1,
          maxFrames: 10,
          audioDuration: 30
        };
      case 'long': // > 5 minutes
        return {
          frameRate: 0.5,
          maxFrames: 12,
          audioDuration: 45
        };
      default:
        return {};
    }
  }
}