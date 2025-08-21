/**
 * Tests for VideoAnalysisService
 */

import { VideoAnalysisService } from '../video-analysis-service';
import { LLMVideoAnalyzer } from '../llm-client';

// Mock the LLMVideoAnalyzer
jest.mock('../llm-client');

describe('VideoAnalysisService', () => {
  let service: VideoAnalysisService;

  beforeEach(() => {
    service = VideoAnalysisService.getInstance();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = VideoAnalysisService.getInstance();
      const instance2 = VideoAnalysisService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('initializeLLM', () => {
    it('should initialize LLM with valid API key', () => {
      const mockValidateApiKey = jest.spyOn(LLMVideoAnalyzer, 'validateApiKey');
      mockValidateApiKey.mockReturnValue(true);

      expect(() => {
        service.initializeLLM('sk-test-key-123');
      }).not.toThrow();

      expect(mockValidateApiKey).toHaveBeenCalledWith('sk-test-key-123');
    });

    it('should throw error with invalid API key', () => {
      const mockValidateApiKey = jest.spyOn(LLMVideoAnalyzer, 'validateApiKey');
      mockValidateApiKey.mockReturnValue(false);

      expect(() => {
        service.initializeLLM('invalid-key');
      }).toThrow('Invalid OpenAI API key format');
    });
  });

  describe('getState', () => {
    it('should return initial state', () => {
      service.reset();
      const state = service.getState();
      
      expect(state).toEqual({
        stage: 'idle',
        progress: 0,
        message: 'Ready to analyze video'
      });
    });
  });

  describe('getFallbackAnalysis', () => {
    it('should return fallback analysis result', () => {
      const result = service.getFallbackAnalysis();
      
      expect(result).toEqual({
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
      });
    });
  });

  describe('isReady', () => {
    it('should return false when not initialized', () => {
      expect(service.isReady()).toBe(false);
    });

    it('should return true when initialized', () => {
      const mockValidateApiKey = jest.spyOn(LLMVideoAnalyzer, 'validateApiKey');
      mockValidateApiKey.mockReturnValue(true);
      
      service.initializeLLM('sk-test-key-123');
      expect(service.isReady()).toBe(true);
    });
  });

  describe('getRecommendedSettings', () => {
    it('should return correct settings for short videos', () => {
      const settings = VideoAnalysisService.getRecommendedSettings('short');
      
      expect(settings).toEqual({
        frameRate: 2,
        maxFrames: 8,
        audioDuration: 15
      });
    });

    it('should return correct settings for medium videos', () => {
      const settings = VideoAnalysisService.getRecommendedSettings('medium');
      
      expect(settings).toEqual({
        frameRate: 1,
        maxFrames: 10,
        audioDuration: 30
      });
    });

    it('should return correct settings for long videos', () => {
      const settings = VideoAnalysisService.getRecommendedSettings('long');
      
      expect(settings).toEqual({
        frameRate: 0.5,
        maxFrames: 12,
        audioDuration: 45
      });
    });
  });

  describe('reset', () => {
    it('should reset state to initial values', () => {
      service.reset();
      const state = service.getState();
      
      expect(state).toEqual({
        stage: 'idle',
        progress: 0,
        message: 'Ready to analyze video'
      });
    });
  });
});