/**
 * Audio transcription service for video analysis
 */

import { supabase } from '../supabase/client';

export interface TranscriptionResult {
  text: string;
  confidence: number;
  startTime: number;
  endTime: number;
  language?: string;
}

export class AudioTranscriptionService {
  private static instance: AudioTranscriptionService;
  
  public static getInstance(): AudioTranscriptionService {
    if (!AudioTranscriptionService.instance) {
      AudioTranscriptionService.instance = new AudioTranscriptionService();
    }
    return AudioTranscriptionService.instance;
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   */
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      formData.append('response_format', 'verbose_json');

      const { data: transcriptionData, error } = await supabase.functions.invoke('transcribe-audio', {
        body: formData,
      });

      if (error) {
        throw new Error(`Transcription failed: ${error.message}`);
      }

      const result = transcriptionData;
      
      return {
        text: result.text || '',
        confidence: result.confidence || 0.5,
        startTime: 0,
        endTime: 3,
        language: result.language || 'en'
      };
    } catch (error) {
      console.warn('Audio transcription failed:', error);
      // Return empty transcription on failure
      return {
        text: '',
        confidence: 0,
        startTime: 0,
        endTime: 3
      };
    }
  }

  /**
   * Transcribe audio from URL
   */
  async transcribeFromUrl(audioUrl: string): Promise<TranscriptionResult> {
    try {
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      return this.transcribeAudio(audioBlob);
    } catch (error) {
      console.warn('Failed to fetch audio for transcription:', error);
      return {
        text: '',
        confidence: 0,
        startTime: 0,
        endTime: 3
      };
    }
  }
}