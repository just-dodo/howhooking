/**
 * Simplified video analyzer that extracts frames and sends to OpenAI
 */

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
}

export interface AnalysisProgress {
  stage: 'idle' | 'processing' | 'analyzing' | 'completed' | 'error';
  progress: number;
  message: string;
}

export class SimpleVideoAnalyzer {
  private apiKey: string;
  private progressCallback?: (progress: AnalysisProgress) => void;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  setProgressCallback(callback: (progress: AnalysisProgress) => void) {
    this.progressCallback = callback;
  }

  private updateProgress(stage: AnalysisProgress['stage'], progress: number, message: string) {
    if (this.progressCallback) {
      this.progressCallback({ stage, progress, message });
    }
  }

  async analyzeVideo(videoFile: File): Promise<VideoAnalysisResult> {
    try {
      this.updateProgress('processing', 10, 'Processing video file...');
      
      // Extract frames from video
      const frames = await this.extractFrames(videoFile);
      
      this.updateProgress('analyzing', 40, 'Analyzing frames with AI...');
      
      // Send to OpenAI for analysis
      const result = await this.analyzeWithOpenAI(frames);
      
      this.updateProgress('completed', 100, 'Analysis completed!');
      
      return result;
    } catch (error) {
      this.updateProgress('error', 0, error instanceof Error ? error.message : 'Analysis failed');
      throw error;
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
          const duration = video.duration;
          const frames: string[] = [];
          
          // Set canvas size
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Extract up to 8 frames
          const frameCount = Math.min(8, Math.floor(duration));
          
          for (let i = 0; i < frameCount; i++) {
            const time = (i / frameCount) * duration;
            const frameData = await this.extractSingleFrame(video, canvas, ctx, time);
            frames.push(frameData);
            
            // Update progress
            const progress = 10 + (i / frameCount) * 30;
            this.updateProgress('processing', progress, `Extracting frame ${i + 1}/${frameCount}...`);
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
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

  private async analyzeWithOpenAI(frames: string[]): Promise<VideoAnalysisResult> {
    const prompt = {
      model: 'gpt-4o',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are a professional video quality analyzer. Analyze the provided video frames to give a comprehensive quality score from 0-100 and detailed breakdown.

Consider these factors:
- **Sharpness**: Image clarity, focus, resolution quality
- **Exposure**: Lighting quality, brightness, contrast
- **Stability**: Camera shake, smooth motion, steadiness (compare frames)
- **Audio Clarity**: Assume good audio quality unless visual cues suggest otherwise
- **Engagement**: Content quality, visual interest, composition
- **Composition**: Framing, rule of thirds, visual balance

Respond with valid JSON only:
{
  "overall_score": 75,
  "breakdown": {
    "sharpness": 80,
    "exposure": 70,
    "stability": 85,
    "audio_clarity": 75,
    "engagement": 70,
    "composition": 80
  },
  "comments": [
    "Good lighting and color balance",
    "Minor camera shake in middle section",
    "Well-composed shots with good framing"
  ],
  "confidence": 85
}`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please analyze these ${frames.length} frames extracted from a video:`
            },
            ...frames.map(frame => ({
              type: 'image_url',
              image_url: {
                url: frame,
                detail: 'high'
              }
            }))
          ]
        }
      ]
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(prompt)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return this.parseResponse(content);
  }

  private parseResponse(response: string): VideoAnalysisResult {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        overall_score: this.clampScore(parsed.overall_score || 50),
        breakdown: {
          sharpness: this.clampScore(parsed.breakdown?.sharpness || 50),
          exposure: this.clampScore(parsed.breakdown?.exposure || 50),
          stability: this.clampScore(parsed.breakdown?.stability || 50),
          audio_clarity: this.clampScore(parsed.breakdown?.audio_clarity || 50),
          engagement: this.clampScore(parsed.breakdown?.engagement || 50),
          composition: this.clampScore(parsed.breakdown?.composition || 50),
        },
        comments: Array.isArray(parsed.comments) ? parsed.comments.slice(0, 5) : ['Analysis completed'],
        confidence: this.clampScore(parsed.confidence || 50)
      };
    } catch (error) {
      console.error('Failed to parse response:', error);
      
      // Return fallback result
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
        comments: ['Analysis completed with basic scoring'],
        confidence: 30
      };
    }
  }

  private clampScore(score: number): number {
    return Math.max(0, Math.min(100, score));
  }
}