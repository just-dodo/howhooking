/**
 * Video processing utilities for extracting frames and audio for LLM analysis
 */

export interface VideoFrame {
  timestamp: number;
  dataUrl: string;
  width: number;
  height: number;
}

export interface AudioSegment {
  startTime: number;
  endTime: number;
  audioUrl: string;
}

export interface ProcessedVideo {
  frames: VideoFrame[];
  audioSegments: AudioSegment[];
  duration: number;
  metadata: {
    width: number;
    height: number;
    fps: number;
    hasAudio: boolean;
  };
}

export class VideoProcessor {
  private static instance: VideoProcessor;
  
  public static getInstance(): VideoProcessor {
    if (!VideoProcessor.instance) {
      VideoProcessor.instance = new VideoProcessor();
    }
    return VideoProcessor.instance;
  }

  /**
   * Process a video file and extract frames and audio segments
   * Optimized for hook analysis - first 3 seconds at 12 fps
   */
  async processVideo(
    videoFile: File,
    options: {
      frameRate?: number; // frames per second to extract
      maxFrames?: number;
      audioDuration?: number; // seconds of audio to extract
      maxDuration?: number; // maximum video duration to analyze
    } = {}
  ): Promise<ProcessedVideo> {
    const {
      frameRate = 12, // 12 fps for better hook analysis
      maxFrames = 36, // 3 seconds * 12 fps = 36 frames
      audioDuration = 3, // first 3 seconds of audio
      maxDuration = 3 // analyze only first 3 seconds
    } = options;

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
          const duration = Math.min(video.duration, maxDuration); // Limit to first 3 seconds
          const fps = 30; // assume 30fps for calculation
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Extract frames from first 3 seconds at 12 fps
          const frames: VideoFrame[] = [];
          const interval = 1 / frameRate;
          const numFrames = Math.min(maxFrames, Math.floor(duration * frameRate));

          for (let i = 0; i < numFrames; i++) {
            const time = i * interval;
            if (time >= maxDuration) break; // Stop at 3 seconds
            const frame = await this.extractFrame(video, canvas, ctx, time);
            frames.push(frame);
          }

          // Extract audio segments from first 3 seconds only
          const audioSegments = await this.extractAudioSegments(
            videoFile,
            Math.min(audioDuration, duration, maxDuration)
          );

          resolve({
            frames,
            audioSegments,
            duration,
            metadata: {
              width: video.videoWidth,
              height: video.videoHeight,
              fps,
              hasAudio: audioSegments.length > 0
            }
          });
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

  /**
   * Extract a single frame at a specific time
   */
  private extractFrame(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    time: number
  ): Promise<VideoFrame> {
    return new Promise((resolve, reject) => {
      const handleSeeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          resolve({
            timestamp: time,
            dataUrl,
            width: canvas.width,
            height: canvas.height
          });
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

  /**
   * Extract audio segments from video
   */
  private async extractAudioSegments(
    videoFile: File,
    duration: number
  ): Promise<AudioSegment[]> {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await videoFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Extract audio segments from first 3 seconds only
      const segmentDuration = Math.min(3, duration); // Single 3-second segment
      const segments: AudioSegment[] = [];

      // Single segment for the first 3 seconds
      const startTime = 0;
      const endTime = Math.min(segmentDuration, duration);
      
      if (endTime > startTime) {
        // Create audio blob for this segment
        const audioBlob = await this.createAudioBlob(audioBuffer, startTime, endTime, audioContext);
        const audioUrl = URL.createObjectURL(audioBlob);
        
        segments.push({
          startTime,
          endTime,
          audioUrl
        });
      }

      return segments;
    } catch (error) {
      console.warn('Audio extraction failed:', error);
      return []; // Return empty array if audio extraction fails
    }
  }

  /**
   * Create audio blob from buffer segment
   */
  private async createAudioBlob(
    audioBuffer: AudioBuffer,
    startTime: number,
    endTime: number,
    audioContext: AudioContext
  ): Promise<Blob> {
    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const length = endSample - startSample;

    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      length,
      sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0, startTime, endTime - startTime);

    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert to WAV format
    const wavBuffer = this.audioBufferToWav(renderedBuffer);
    return new Blob([wavBuffer], { type: 'audio/wav' });
  }

  /**
   * Convert AudioBuffer to WAV format
   */
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

  /**
   * Clean up created object URLs
   */
  cleanup(processedVideo: ProcessedVideo): void {
    processedVideo.audioSegments.forEach(segment => {
      URL.revokeObjectURL(segment.audioUrl);
    });
  }
}