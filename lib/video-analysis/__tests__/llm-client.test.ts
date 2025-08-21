/**
 * Tests for LLMVideoAnalyzer
 */

import { LLMVideoAnalyzer } from '../llm-client';

describe('LLMVideoAnalyzer', () => {
  describe('validateApiKey', () => {
    it('should return true for valid API key format', () => {
      const validKeys = [
        'sk-1234567890abcdef1234567890abcdef',
        'sk-test-key-123',
        'sk-proj-1234567890abcdef'
      ];

      validKeys.forEach(key => {
        expect(LLMVideoAnalyzer.validateApiKey(key)).toBe(true);
      });
    });

    it('should return false for invalid API key format', () => {
      const invalidKeys = [
        'invalid-key',
        'sk-',
        'sk-short',
        '',
        'not-sk-key',
        'sk'
      ];

      invalidKeys.forEach(key => {
        expect(LLMVideoAnalyzer.validateApiKey(key)).toBe(false);
      });
    });
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      const analyzer = new LLMVideoAnalyzer({
        apiKey: 'sk-test-key-123'
      });

      expect(analyzer).toBeInstanceOf(LLMVideoAnalyzer);
    });

    it('should create instance with custom config', () => {
      const analyzer = new LLMVideoAnalyzer({
        apiKey: 'sk-test-key-123',
        model: 'gpt-4o',
        maxTokens: 1000,
        temperature: 0.5
      });

      expect(analyzer).toBeInstanceOf(LLMVideoAnalyzer);
    });
  });

  describe('parseResponse', () => {
    let analyzer: LLMVideoAnalyzer;

    beforeEach(() => {
      analyzer = new LLMVideoAnalyzer({
        apiKey: 'sk-test-key-123'
      });
    });

    it('should parse valid JSON response', () => {
      const mockResponse = JSON.stringify({
        overall_score: 85,
        breakdown: {
          sharpness: 90,
          exposure: 80,
          stability: 85,
          audio_clarity: 88,
          engagement: 82,
          composition: 87
        },
        comments: ['Good video quality', 'Clear audio'],
        confidence: 92
      });

      // Access private method for testing
      const result = (analyzer as any).parseResponse(mockResponse);

      expect(result).toEqual({
        overall_score: 85,
        breakdown: {
          sharpness: 90,
          exposure: 80,
          stability: 85,
          audio_clarity: 88,
          engagement: 82,
          composition: 87
        },
        comments: ['Good video quality', 'Clear audio'],
        confidence: 92
      });
    });

    it('should return fallback for invalid JSON', () => {
      const invalidResponse = 'This is not valid JSON';

      const result = (analyzer as any).parseResponse(invalidResponse);

      expect(result).toEqual({
        overall_score: 50,
        breakdown: {
          sharpness: 50,
          exposure: 50,
          stability: 50,
          audio_clarity: 50,
          engagement: 50,
          composition: 50,
        },
        comments: ['Analysis failed - using fallback score'],
        confidence: 0
      });
    });
  });

  describe('normalizeScores', () => {
    let analyzer: LLMVideoAnalyzer;

    beforeEach(() => {
      analyzer = new LLMVideoAnalyzer({
        apiKey: 'sk-test-key-123'
      });
    });

    it('should clamp scores to 0-100 range', () => {
      const inputResult = {
        overall_score: 150,
        breakdown: {
          sharpness: -10,
          exposure: 200,
          stability: 85,
          audio_clarity: 88,
          engagement: 82,
          composition: 87
        },
        comments: ['Test comment 1', 'Test comment 2'],
        confidence: 110
      };

      const result = (analyzer as any).normalizeScores(inputResult);

      expect(result.overall_score).toBe(100);
      expect(result.breakdown.sharpness).toBe(0);
      expect(result.breakdown.exposure).toBe(100);
      expect(result.breakdown.stability).toBe(85);
      expect(result.confidence).toBe(100);
    });

    it('should limit comments to 5 items', () => {
      const inputResult = {
        overall_score: 85,
        breakdown: {
          sharpness: 90,
          exposure: 80,
          stability: 85,
          audio_clarity: 88,
          engagement: 82,
          composition: 87
        },
        comments: ['Comment 1', 'Comment 2', 'Comment 3', 'Comment 4', 'Comment 5', 'Comment 6', 'Comment 7'],
        confidence: 92
      };

      const result = (analyzer as any).normalizeScores(inputResult);

      expect(result.comments).toHaveLength(5);
      expect(result.comments).toEqual(['Comment 1', 'Comment 2', 'Comment 3', 'Comment 4', 'Comment 5']);
    });
  });
});