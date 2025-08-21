/**
 * Client-side video analyzer that extracts frames and sends to secure API
 */

import { supabase } from '../supabase/client';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

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
  transcription?: {
    text: string;
    confidence: number;
    startTime: number;
    endTime: number;
  };
  // Progressive scoring results
  visual_hook_score?: number;
  audio_hook_score?: number;
}

export interface VisualHookResult {
  visual_hook_score: number;
  visual_breakdown: {
    sharpness: number;
    exposure: number;
    stability: number;
    composition: number;
  };
  visual_comments: string[];
  confidence: number;
}

export interface AudioHookResult {
  audio_hook_score: number;
  audio_breakdown: {
    audio_clarity: number;
    engagement: number;
  };
  audio_comments: string[];
  confidence: number;
}

export interface AnalysisProgress {
  stage: 'idle' | 'processing' | 'transcribing' | 'analyzing' | 'completed' | 'error';
  progress: number;
  message: string;
  frames?: string[];
  transcription?: string;
  // Progressive scoring fields
  visualScore?: number;
  audioScore?: number;
  visualBreakdown?: {
    sharpness: number;
    exposure: number;
    stability: number;
    composition: number;
  };
  audioBreakdown?: {
    audio_clarity: number;
    engagement: number;
  };
  isFramesComplete?: boolean;
  isVisualComplete?: boolean;
  isAudioComplete?: boolean;
  isAudioHookComplete?: boolean;
}

export class ClientVideoAnalyzer {
  private progressCallback?: (progress: AnalysisProgress) => void;
  private ffmpeg: FFmpeg | null = null;

  setProgressCallback(callback: (progress: AnalysisProgress) => void) {
    this.progressCallback = callback;
  }

  private async initializeFFmpeg(): Promise<void> {
    if (this.ffmpeg) return;

    this.ffmpeg = new FFmpeg();
    
    try {
      // Load FFmpeg without specifying URLs - let the package handle it
      await this.ffmpeg.load();
      console.log('FFmpeg.wasm loaded successfully from local package');
    } catch (error) {
      console.error('Failed to load FFmpeg.wasm:', error);
      throw new Error('FFmpeg initialization failed - using Web Audio API fallback');
    }
  }

  private updateProgress(
    stage: AnalysisProgress['stage'], 
    progress: number, 
    message: string, 
    frames?: string[], 
    transcription?: string,
    visualScore?: number,
    audioScore?: number,
    visualBreakdown?: AnalysisProgress['visualBreakdown'],
    audioBreakdown?: AnalysisProgress['audioBreakdown'],
    isFramesComplete?: boolean,
    isVisualComplete?: boolean,
    isAudioComplete?: boolean,
    isAudioHookComplete?: boolean
  ) {
    if (this.progressCallback) {
      this.progressCallback({ 
        stage, 
        progress, 
        message, 
        frames, 
        transcription,
        visualScore,
        audioScore,
        visualBreakdown,
        audioBreakdown,
        isFramesComplete,
        isVisualComplete,
        isAudioComplete,
        isAudioHookComplete
      });
    }
  }

  async analyzeVideo(videoFile: File): Promise<VideoAnalysisResult> {
    let frames: string[] = [];
    let transcription = '';
    let visualResult: VisualHookResult | undefined;
    let audioResult: AudioHookResult | undefined;
    
    try {
      this.updateProgress('processing', 10, 'Processing video file...');
      
      // Extract frames from first 3 seconds
      try {
        frames = await this.extractFrames(videoFile);
        // Mark frames as complete
        this.updateProgress('processing', 30, 'Frames extracted! Analyzing visual hook...', frames, undefined, undefined, undefined, undefined, undefined, true);
      } catch (error) {
        console.error('Frame extraction failed:', error);
        this.updateProgress('error', 0, 'Frame extraction failed. Please try with a different video.');
        throw error;
      }
      
      // Get visual hook score
      try {
        visualResult = await this.analyzeVisualHook(frames);
        // Update with visual score
        this.updateProgress('transcribing', 40, 'Visual hook scored! Transcribing audio...', frames, undefined, visualResult.visual_hook_score, undefined, visualResult.visual_breakdown, undefined, true, true);
      } catch (error) {
        console.error('Visual hook analysis failed:', error);
        // Continue with fallback visual result
        visualResult = {
          visual_hook_score: 65,
          visual_breakdown: { sharpness: 70, exposure: 65, stability: 60, composition: 65 },
          visual_comments: ['Visual analysis failed', 'Using fallback scoring', 'Try again later'],
          confidence: 30
        };
        this.updateProgress('transcribing', 40, 'Visual hook analysis failed, using fallback. Transcribing audio...', frames, undefined, visualResult.visual_hook_score, undefined, visualResult.visual_breakdown, undefined, true, true);
      }
      
      // Extract and transcribe audio from first 3 seconds
      try {
        const audioBlob = await this.extractAudio(videoFile);
        transcription = await this.transcribeAudio(audioBlob);
        // Mark audio extraction as complete
        this.updateProgress('transcribing', 60, 'Audio extracted! Analyzing audio hook...', frames, transcription, visualResult.visual_hook_score, undefined, visualResult.visual_breakdown, undefined, true, true, true);
      } catch (error) {
        console.error('Audio extraction failed:', error);
        // Continue without audio
        this.updateProgress('transcribing', 60, 'Audio extraction failed, continuing without audio. Analyzing audio hook...', frames, transcription, visualResult.visual_hook_score, undefined, visualResult.visual_breakdown, undefined, true, true, true);
      }
      
      // Get audio hook score
      try {
        audioResult = await this.analyzeAudioHook(transcription);
        // Update with audio score
        this.updateProgress('analyzing', 80, 'Audio hook scored! Generating final results...', frames, transcription, visualResult.visual_hook_score, audioResult.audio_hook_score, visualResult.visual_breakdown, audioResult.audio_breakdown, true, true, true, true);
      } catch (error) {
        console.error('Audio hook analysis failed:', error);
        // Continue with fallback audio result
        audioResult = {
          audio_hook_score: 50,
          audio_breakdown: { audio_clarity: 60, engagement: 40 },
          audio_comments: ['Audio analysis failed', 'Using fallback scoring', 'Consider adding clear audio'],
          confidence: 25
        };
        this.updateProgress('analyzing', 80, 'Audio hook analysis failed, using fallback. Generating final results...', frames, transcription, visualResult.visual_hook_score, audioResult.audio_hook_score, visualResult.visual_breakdown, audioResult.audio_breakdown, true, true, true, true);
      }
      
      // Combine results
      const result = await this.combineResults(frames, transcription, visualResult, audioResult);
      
      this.updateProgress('completed', 100, 'Analysis completed!', frames, transcription, visualResult.visual_hook_score, audioResult.audio_hook_score, visualResult.visual_breakdown, audioResult.audio_breakdown, true, true, true, true);
      
      return result;
    } catch (error) {
      console.error('Video analysis error:', error);
      
      let errorMessage = 'Analysis failed';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'API configuration error. Please check your OpenAI API key.';
        } else if (error.message.includes('quota') || error.message.includes('billing')) {
          errorMessage = 'API quota exceeded. Please check your OpenAI billing.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Rate limit reached. Please try again in a few minutes.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      this.updateProgress('error', 0, errorMessage);
      
      // If we have partial results, try to return a combined result
      if (visualResult && audioResult) {
        console.log('Returning partial results due to error');
        return await this.combineResults(frames, transcription, visualResult, audioResult);
      }
      
      throw new Error(errorMessage);
    }
  }

  private async extractFrames(videoFile: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      video.addEventListener('loadedmetadata', async () => {
        try {
          const duration = Math.min(video.duration, 3); // Limit to first 3 seconds
          const frames: string[] = [];
          
          // Reduce canvas size for smaller payload (Vercel 4.5MB limit)
          const maxWidth = 400; // Reduced from 800 to 400
          const aspectRatio = video.videoHeight / video.videoWidth;
          canvas.width = Math.min(maxWidth, video.videoWidth);
          canvas.height = canvas.width * aspectRatio;
          
          // Reduce frame count to minimize payload size and processing time
          const frameRate = 4; // Reduced from 6 to 4 fps for faster processing
          const frameCount = Math.min(12, Math.ceil(duration * frameRate)); // Max 12 frames for speed
          
          for (let i = 0; i < frameCount; i++) {
            const time = (i / frameRate);
            if (time >= 3) break; // Stop at 3 seconds
            
            const frameData = await this.extractSingleFrame(video, canvas, ctx, time);
            frames.push(frameData);
            
            // Check payload size every 5 frames
            if (i > 0 && i % 5 === 0) {
              const currentSize = this.estimatePayloadSize(frames);
              if (currentSize > 3500000) { // 3.5MB limit (safety margin)
                console.warn(`Payload size approaching limit: ${(currentSize / 1024 / 1024).toFixed(2)}MB, stopping frame extraction`);
                break;
              }
            }
            
            // Update progress with current frames
            const progress = 10 + (i / frameCount) * 30;
            this.updateProgress('processing', progress, `Extracting frame ${i + 1}/${frameCount}...`, frames);
          }
          
          resolve(frames);
        } catch (error) {
          reject(error);
        }
      });

      video.addEventListener('error', () => {
        reject(new Error('Error loading video'));
      });

      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  }

  private extractSingleFrame(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    time: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const handleSeeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          // Use lower quality for smaller payload size
          const dataUrl = canvas.toDataURL('image/jpeg', 0.5); // Reduced from 0.8 to 0.5
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        } finally {
          video.removeEventListener('seeked', handleSeeked);
        }
      };

      video.addEventListener('seeked', handleSeeked);
      video.currentTime = time;
    });
  }

  private estimatePayloadSize(frames: string[]): number {
    // Estimate payload size including frames and transcription
    const framesSize = frames.reduce((total, frame) => total + frame.length, 0);
    // Add overhead for JSON structure and transcription (estimated 10KB)
    return framesSize + 10240;
  }

  private async extractAudio(videoFile: File): Promise<Blob> {
    try {
      // Try FFmpeg.wasm first
      return await this.extractAudioWithFFmpeg(videoFile);
    } catch (ffmpegError) {
      console.warn('FFmpeg.wasm failed, trying Web Audio API fallback:', ffmpegError);
      try {
        // Fallback to Web Audio API
        return await this.extractAudioWithWebAudio(videoFile);
      } catch (webAudioError) {
        console.warn('All audio extraction methods failed:', webAudioError);
        // Return empty blob if all methods fail
        return new Blob([], { type: 'audio/wav' });
      }
    }
  }

  private async extractAudioWithFFmpeg(videoFile: File): Promise<Blob> {
    // Initialize FFmpeg if not already done
    await this.initializeFFmpeg();
    
    if (!this.ffmpeg) {
      throw new Error('FFmpeg initialization failed');
    }

    // Write input video file to FFmpeg filesystem
    const inputName = 'input.mp4';
    const outputName = 'output.wav';
    
    await this.ffmpeg.writeFile(inputName, await fetchFile(videoFile));

    // Extract first 3 seconds of audio as WAV
    await this.ffmpeg.exec([
      '-i', inputName,
      '-t', '3',              // Extract only first 3 seconds
      '-acodec', 'pcm_s16le', // WAV format
      '-ar', '16000',         // 16kHz sample rate for speech recognition
      '-ac', '1',             // Mono audio
      outputName
    ]);

    // Read the output audio file
    const data = await this.ffmpeg.readFile(outputName);
    const audioBlob = new Blob([data], { type: 'audio/wav' });
    
    // Clean up files from FFmpeg filesystem
    await this.ffmpeg.deleteFile(inputName);
    await this.ffmpeg.deleteFile(outputName);
    
    console.log(`FFmpeg-extracted audio: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
    
    return audioBlob;
  }

  private async extractAudioWithWebAudio(videoFile: File): Promise<Blob> {
    // Check browser compatibility
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      throw new Error('Web Audio API not supported');
    }

    console.log('Using Web Audio API for audio extraction (mobile-friendly)');

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Ensure audio context is not suspended (especially important on mobile)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // For mobile Safari compatibility, we need to handle different video formats
    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await videoFile.arrayBuffer();
    } catch (error) {
      throw new Error('Failed to read video file');
    }

    let audioBuffer: AudioBuffer;
    try {
      // Try to decode the audio data
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    } catch (decodeError) {
      console.warn('Direct audio decode failed, trying alternative approach:', decodeError);
      
      // For some video formats, we might need to extract audio differently
      // This is a simplified fallback that works better on mobile
      try {
        const copiedBuffer = new ArrayBuffer(arrayBuffer.byteLength);
        new Uint8Array(copiedBuffer).set(new Uint8Array(arrayBuffer));
        audioBuffer = await audioContext.decodeAudioData(copiedBuffer);
      } catch (secondError) {
        console.warn('Alternative decode also failed:', secondError);
        throw new Error('Failed to decode audio from video - format may not be supported');
      }
    }
    
    if (!audioBuffer || audioBuffer.numberOfChannels === 0) {
      throw new Error('No audio channels found in video');
    }
    
    // Extract first 3 seconds
    const duration = Math.min(3, audioBuffer.duration);
    const startSample = 0;
    const endSample = Math.floor(duration * audioBuffer.sampleRate);
    const length = endSample - startSample;

    if (length <= 0) {
      throw new Error('Invalid audio duration');
    }

    // Use the original sample rate if it's already low, otherwise downsample to 16kHz
    const targetSampleRate = audioBuffer.sampleRate <= 16000 ? audioBuffer.sampleRate : 16000;
    const targetLength = Math.floor(length * targetSampleRate / audioBuffer.sampleRate);

    const offlineContext = new OfflineAudioContext(
      1, // Mono
      targetLength,
      targetSampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0, 0, duration);

    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert to WAV format
    const wavBuffer = this.audioBufferToWav(renderedBuffer);
    const audioBlob = new Blob([wavBuffer], { type: 'audio/wav' });
    
    console.log(`Web Audio API extracted audio: ${audioBlob.size} bytes, type: ${audioBlob.type}, sample rate: ${targetSampleRate}Hz`);
    
    return audioBlob;
  }

  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }




  private async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      if (audioBlob.size === 0) {
        console.warn('Empty audio blob, skipping transcription');
        return '';
      }

      console.log(`Attempting to transcribe audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`);

      const formData = new FormData();
      // Use appropriate filename based on blob type
      const filename = audioBlob.type.includes('webm') ? 'audio.webm' : 'audio.wav';
      formData.append('file', audioBlob, filename);

      const { data: transcriptionData, error } = await supabase.functions.invoke('transcribe-audio', {
        body: formData,
      });

      if (error) {
        console.warn('Transcription request failed:', error);
        return '';
      }

      const data = transcriptionData;
      
      if (data.error) {
        console.warn('Transcription API returned error:', data.error);
      }
      
      const transcriptionText = data.text || '';
      console.log(`Transcription result: "${transcriptionText}" (confidence: ${data.confidence})`);
      
      return transcriptionText;
    } catch (error) {
      console.warn('Transcription failed:', error);
      return '';
    }
  }

  private async analyzeVisualHook(frames: string[]): Promise<VisualHookResult> {
    const payload = { frames, analysis_type: 'visual_hook' };
    const payloadSize = JSON.stringify(payload).length;
    
    console.log(`Sending visual hook payload of size: ${(payloadSize / 1024 / 1024).toFixed(2)}MB`);
    
    // If payload is still too large, make final reductions
    if (payloadSize > 4000000) { // 4MB limit
      console.warn('Client-side visual hook payload reduction required');
      payload.frames = frames.slice(0, 3); // Use only first 3 frames
    }

    const { data: analysisData, error } = await supabase.functions.invoke('analyze-visual-hook', {
      body: payload,
    });

    if (error) {
      throw new Error(`Visual hook analysis failed: ${error.message}`);
    }

    if (analysisData.error || !analysisData.success) {
      if (analysisData.fallback) {
        console.warn('Visual hook analysis failed, using fallback:', analysisData.error);
        return analysisData.fallback;
      }
      throw new Error(analysisData.error || 'Visual hook API request failed');
    }

    return analysisData.data;
  }

  private async analyzeAudioHook(transcription: string): Promise<AudioHookResult> {
    const payload = { transcription, analysis_type: 'audio_hook' };

    const { data: analysisData, error } = await supabase.functions.invoke('analyze-audio-hook', {
      body: payload,
    });

    if (error) {
      throw new Error(`Audio hook analysis failed: ${error.message}`);
    }

    if (analysisData.error || !analysisData.success) {
      if (analysisData.fallback) {
        console.warn('Audio hook analysis failed, using fallback:', analysisData.error);
        return analysisData.fallback;
      }
      throw new Error(analysisData.error || 'Audio hook API request failed');
    }

    return analysisData.data;
  }

  private async combineResults(
    frames: string[], 
    transcription: string, 
    visualResult: VisualHookResult, 
    audioResult: AudioHookResult
  ): Promise<VideoAnalysisResult> {
    // Calculate overall score as weighted average
    const overallScore = Math.round((visualResult.visual_hook_score * 0.6) + (audioResult.audio_hook_score * 0.4));
    
    return {
      overall_score: overallScore,
      breakdown: {
        sharpness: visualResult.visual_breakdown.sharpness,
        exposure: visualResult.visual_breakdown.exposure,
        stability: visualResult.visual_breakdown.stability,
        audio_clarity: audioResult.audio_breakdown.audio_clarity,
        engagement: audioResult.audio_breakdown.engagement,
        composition: visualResult.visual_breakdown.composition,
      },
      comments: [...visualResult.visual_comments, ...audioResult.audio_comments],
      confidence: Math.round((visualResult.confidence + audioResult.confidence) / 2),
      transcription: transcription ? {
        text: transcription,
        confidence: 0.9,
        startTime: 0,
        endTime: 3
      } : undefined,
      visual_hook_score: visualResult.visual_hook_score,
      audio_hook_score: audioResult.audio_hook_score
    };
  }

}