import { ClientVideoAnalyzer, AnalysisProgress, VideoAnalysisResult, VisualHookResult, AudioHookResult } from '../client-video-analyzer';

// Mock Supabase client
jest.mock('../../supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn()
    }
  }
}));

describe('ClientVideoAnalyzer - Progressive Scoring', () => {
  let analyzer: ClientVideoAnalyzer;
  let mockProgressCallback: jest.Mock;

  beforeEach(() => {
    analyzer = new ClientVideoAnalyzer();
    mockProgressCallback = jest.fn();
    analyzer.setProgressCallback(mockProgressCallback);
  });

  describe('Progressive Score Updates', () => {
    it('should update progress with visual score when visual hook analysis completes', async () => {
      // Mock video file
      const mockFile = new File(['video data'], 'test.mp4', { type: 'video/mp4' });

      // Mock the methods
      jest.spyOn(analyzer as any, 'extractFrames').mockResolvedValue(['frame1', 'frame2']);
      jest.spyOn(analyzer as any, 'analyzeVisualHook').mockResolvedValue({
        visual_hook_score: 85,
        visual_breakdown: { sharpness: 90, exposure: 85, stability: 80, composition: 85 },
        visual_comments: ['Great visual quality', 'Strong composition', 'Good lighting'],
        confidence: 90
      });
      jest.spyOn(analyzer as any, 'extractAudio').mockResolvedValue(new Blob());
      jest.spyOn(analyzer as any, 'transcribeAudio').mockResolvedValue('Hello world');
      jest.spyOn(analyzer as any, 'analyzeAudioHook').mockResolvedValue({
        audio_hook_score: 75,
        audio_breakdown: { audio_clarity: 80, engagement: 70 },
        audio_comments: ['Clear audio', 'Good hook opening'],
        confidence: 85
      });

      await analyzer.analyzeVideo(mockFile);

      // Check that progress was updated with visual score
      const visualScoreCall = mockProgressCallback.mock.calls.find(call => 
        call[0].visualScore === 85 && call[0].isVisualComplete === true
      );
      expect(visualScoreCall).toBeTruthy();
    });

    it('should update progress with audio score when audio hook analysis completes', async () => {
      // Mock video file
      const mockFile = new File(['video data'], 'test.mp4', { type: 'video/mp4' });

      // Mock the methods
      jest.spyOn(analyzer as any, 'extractFrames').mockResolvedValue(['frame1', 'frame2']);
      jest.spyOn(analyzer as any, 'analyzeVisualHook').mockResolvedValue({
        visual_hook_score: 85,
        visual_breakdown: { sharpness: 90, exposure: 85, stability: 80, composition: 85 },
        visual_comments: ['Great visual quality'],
        confidence: 90
      });
      jest.spyOn(analyzer as any, 'extractAudio').mockResolvedValue(new Blob());
      jest.spyOn(analyzer as any, 'transcribeAudio').mockResolvedValue('Hello world');
      jest.spyOn(analyzer as any, 'analyzeAudioHook').mockResolvedValue({
        audio_hook_score: 75,
        audio_breakdown: { audio_clarity: 80, engagement: 70 },
        audio_comments: ['Clear audio'],
        confidence: 85
      });

      await analyzer.analyzeVideo(mockFile);

      // Check that progress was updated with audio score
      const audioScoreCall = mockProgressCallback.mock.calls.find(call => 
        call[0].audioScore === 75 && call[0].isAudioHookComplete === true
      );
      expect(audioScoreCall).toBeTruthy();
    });

    it('should mark steps as complete in sequence', async () => {
      const mockFile = new File(['video data'], 'test.mp4', { type: 'video/mp4' });

      // Mock the methods
      jest.spyOn(analyzer as any, 'extractFrames').mockResolvedValue(['frame1', 'frame2']);
      jest.spyOn(analyzer as any, 'analyzeVisualHook').mockResolvedValue({
        visual_hook_score: 85,
        visual_breakdown: { sharpness: 90, exposure: 85, stability: 80, composition: 85 },
        visual_comments: ['Great visual quality'],
        confidence: 90
      });
      jest.spyOn(analyzer as any, 'extractAudio').mockResolvedValue(new Blob());
      jest.spyOn(analyzer as any, 'transcribeAudio').mockResolvedValue('Hello world');
      jest.spyOn(analyzer as any, 'analyzeAudioHook').mockResolvedValue({
        audio_hook_score: 75,
        audio_breakdown: { audio_clarity: 80, engagement: 70 },
        audio_comments: ['Clear audio'],
        confidence: 85
      });

      await analyzer.analyzeVideo(mockFile);

      // Check sequential completion
      const framesCompleteCall = mockProgressCallback.mock.calls.find(call => 
        call[0].isFramesComplete === true
      );
      const visualCompleteCall = mockProgressCallback.mock.calls.find(call => 
        call[0].isVisualComplete === true
      );
      const audioCompleteCall = mockProgressCallback.mock.calls.find(call => 
        call[0].isAudioComplete === true
      );
      const audioHookCompleteCall = mockProgressCallback.mock.calls.find(call => 
        call[0].isAudioHookComplete === true
      );

      expect(framesCompleteCall).toBeTruthy();
      expect(visualCompleteCall).toBeTruthy();
      expect(audioCompleteCall).toBeTruthy();
      expect(audioHookCompleteCall).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should continue with fallback when visual hook analysis fails', async () => {
      const mockFile = new File(['video data'], 'test.mp4', { type: 'video/mp4' });

      // Mock the methods
      jest.spyOn(analyzer as any, 'extractFrames').mockResolvedValue(['frame1', 'frame2']);
      jest.spyOn(analyzer as any, 'analyzeVisualHook').mockRejectedValue(new Error('Visual analysis failed'));
      jest.spyOn(analyzer as any, 'extractAudio').mockResolvedValue(new Blob());
      jest.spyOn(analyzer as any, 'transcribeAudio').mockResolvedValue('Hello world');
      jest.spyOn(analyzer as any, 'analyzeAudioHook').mockResolvedValue({
        audio_hook_score: 75,
        audio_breakdown: { audio_clarity: 80, engagement: 70 },
        audio_comments: ['Clear audio'],
        confidence: 85
      });

      const result = await analyzer.analyzeVideo(mockFile);

      // Should use fallback visual score
      expect(result.visual_hook_score).toBe(65);
      expect(result.overall_score).toBeDefined();
    });

    it('should continue with fallback when audio hook analysis fails', async () => {
      const mockFile = new File(['video data'], 'test.mp4', { type: 'video/mp4' });

      // Mock the methods
      jest.spyOn(analyzer as any, 'extractFrames').mockResolvedValue(['frame1', 'frame2']);
      jest.spyOn(analyzer as any, 'analyzeVisualHook').mockResolvedValue({
        visual_hook_score: 85,
        visual_breakdown: { sharpness: 90, exposure: 85, stability: 80, composition: 85 },
        visual_comments: ['Great visual quality'],
        confidence: 90
      });
      jest.spyOn(analyzer as any, 'extractAudio').mockResolvedValue(new Blob());
      jest.spyOn(analyzer as any, 'transcribeAudio').mockResolvedValue('Hello world');
      jest.spyOn(analyzer as any, 'analyzeAudioHook').mockRejectedValue(new Error('Audio analysis failed'));

      const result = await analyzer.analyzeVideo(mockFile);

      // Should use fallback audio score
      expect(result.audio_hook_score).toBe(50);
      expect(result.overall_score).toBeDefined();
    });

    it('should show error message when frame extraction fails', async () => {
      const mockFile = new File(['video data'], 'test.mp4', { type: 'video/mp4' });

      // Mock frame extraction failure
      jest.spyOn(analyzer as any, 'extractFrames').mockRejectedValue(new Error('Frame extraction failed'));

      await expect(analyzer.analyzeVideo(mockFile)).rejects.toThrow('Frame extraction failed');

      // Should show error message
      const errorCall = mockProgressCallback.mock.calls.find(call => 
        call[0].stage === 'error' && call[0].message.includes('Frame extraction failed')
      );
      expect(errorCall).toBeTruthy();
    });
  });

  describe('Result Combination', () => {
    it('should combine visual and audio results into final score', async () => {
      const mockFile = new File(['video data'], 'test.mp4', { type: 'video/mp4' });

      // Mock the methods
      jest.spyOn(analyzer as any, 'extractFrames').mockResolvedValue(['frame1', 'frame2']);
      jest.spyOn(analyzer as any, 'analyzeVisualHook').mockResolvedValue({
        visual_hook_score: 80,
        visual_breakdown: { sharpness: 80, exposure: 80, stability: 80, composition: 80 },
        visual_comments: ['Good visual quality'],
        confidence: 80
      });
      jest.spyOn(analyzer as any, 'extractAudio').mockResolvedValue(new Blob());
      jest.spyOn(analyzer as any, 'transcribeAudio').mockResolvedValue('Hello world');
      jest.spyOn(analyzer as any, 'analyzeAudioHook').mockResolvedValue({
        audio_hook_score: 70,
        audio_breakdown: { audio_clarity: 70, engagement: 70 },
        audio_comments: ['Good audio'],
        confidence: 70
      });

      const result = await analyzer.analyzeVideo(mockFile);

      // Should combine scores (80 * 0.6 + 70 * 0.4 = 48 + 28 = 76)
      expect(result.overall_score).toBe(76);
      expect(result.visual_hook_score).toBe(80);
      expect(result.audio_hook_score).toBe(70);
      expect(result.breakdown.sharpness).toBe(80);
      expect(result.breakdown.engagement).toBe(70);
    });
  });
});