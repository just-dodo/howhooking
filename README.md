# 🎯 AI Hook Scorer

> **Professional video hook analysis powered by multi-modal AI**

AI Hook Scorer is an advanced video analysis platform that helps content creators optimize their video openings for maximum viewer retention. Using cutting-edge multi-modal AI technology, it analyzes the critical first 3 seconds of videos to provide actionable insights and professional scoring.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/justdodos-projects/v0-ai-hook-scorer-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/0W2FOYHl7sY)

## ✨ Features

### 🔍 Multi-Modal Analysis
- **Visual Analysis**: 12 fps frame extraction from first 3 seconds
- **Audio Transcription**: Real-time speech-to-text using OpenAI Whisper
- **AI-Powered Scoring**: GPT-4o provides comprehensive hook effectiveness analysis

### 📊 Comprehensive Scoring
- **6-Category Breakdown**: Sharpness, Exposure, Stability, Audio Clarity, Engagement, Composition
- **0-100 Scoring System**: Normalized, explainable scores with confidence levels
- **AI Commentary**: Detailed insights and improvement suggestions
- **Hook Specialization**: Focused on viewer retention and attention-grabbing elements

### 🚀 Real-Time Processing
- **Progress Tracking**: Live updates through processing, transcription, and analysis stages
- **< 30 Second Analysis**: Optimized for quick feedback
- **Fallback Systems**: Graceful degradation with baseline scoring

### 🔒 Production-Ready
- **Secure Architecture**: Server-side API key protection
- **Scalable Storage**: IndexedDB for large file handling
- **Error Handling**: Comprehensive retry logic and fallback mechanisms
- **Type Safety**: Full TypeScript implementation

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon system

### Backend
- **OpenAI GPT-4o**: Multi-modal vision + language model
- **OpenAI Whisper**: Speech-to-text transcription
- **Next.js API Routes**: Serverless backend functions
- **Web Audio API**: Client-side audio processing

### Storage & Processing
- **IndexedDB**: Large video file storage
- **Canvas API**: Optimized frame extraction
- **Supabase**: Authentication and data management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key with GPT-4o and Whisper access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ai-hook-scorer.git
   cd ai-hook-scorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Usage

1. **Upload Video**: Select a video file (MP4, WebM, MOV, AVI)
2. **Analysis**: Watch real-time progress through processing stages
3. **Results**: Review comprehensive scoring breakdown and AI insights
4. **Optimization**: Use feedback to improve your video hooks

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── analyze-video/        # Main analysis endpoint
│   │   └── transcribe-audio/     # Audio transcription endpoint
│   ├── analyzing/                # Analysis progress page
│   ├── result/                   # Results display page
│   └── waitlist/                 # User waitlist page
├── lib/                          # Core libraries
│   ├── video-analysis/           # Video processing & AI integration
│   │   ├── video-processor.ts    # Frame & audio extraction
│   │   ├── audio-transcription.ts # Whisper API integration
│   │   ├── client-video-analyzer.ts # Client orchestration
│   │   └── llm-client.ts         # GPT-4o integration
│   ├── video-storage.ts          # IndexedDB wrapper
│   └── auth.ts                   # Authentication utilities
├── components/                   # Reusable UI components
├── hooks/                        # Custom React hooks
└── documentations/               # Project documentation
```

## 🎯 Core Analysis Pipeline

### 1. Video Processing
```typescript
// Extract frames at 12 fps from first 3 seconds
const options = {
  frameRate: 12,           // 12 fps for detailed analysis
  maxFrames: 36,          // 3 seconds * 12 fps
  audioDuration: 3,       // First 3 seconds only
  maxDuration: 3          // Hard limit at 3 seconds
};
```

### 2. Audio Transcription
```typescript
// OpenAI Whisper integration
const transcription = await openai.audio.transcriptions.create({
  file: audioBlob,
  model: 'whisper-1',
  language: 'en',
  response_format: 'verbose_json'
});
```

### 3. Multi-Modal Analysis
```typescript
// GPT-4o with hook-focused prompts
const analysis = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: 'Analyze this hook for viewer retention effectiveness...'
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Transcription: "' + transcription + '"' },
        ...frames.map(frame => ({ type: 'image_url', image_url: { url: frame } }))
      ]
    }
  ]
});
```

## 📊 Analysis Output

### Score Breakdown
```json
{
  "overall_score": 85,
  "breakdown": {
    "sharpness": 90,      // Image clarity, focus quality
    "exposure": 85,       // Lighting, brightness, contrast
    "stability": 80,      // Camera shake, steadiness
    "audio_clarity": 88,  // Sound quality, noise levels
    "engagement": 90,     // Hook effectiveness, attention-grabbing
    "composition": 82     // Framing, visual balance
  },
  "comments": [
    "Strong opening hook that immediately captures attention",
    "Excellent lighting and sharp focus throughout",
    "Clear audio with compelling opening statement"
  ],
  "confidence": 92,
  "transcription": {
    "text": "Here's the secret that changed everything for me",
    "confidence": 0.95
  }
}
```

## 🔧 Configuration

### Environment Variables
```env
# Required
OPENAI_API_KEY=sk-your-api-key-here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

### Analysis Settings
Customize analysis parameters in `lib/video-analysis/video-processor.ts`:
- Frame rate (default: 12 fps)
- Maximum frames (default: 36)
- Analysis duration (default: 3 seconds)
- Canvas resolution (default: 800px max width)

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

Your project is live at: **[https://vercel.com/justdodos-projects/v0-ai-hook-scorer-design](https://vercel.com/justdodos-projects/v0-ai-hook-scorer-design)**

### Environment Setup
- Ensure OpenAI API key is configured
- Set up proper CORS policies for your domain
- Configure rate limiting for production usage

## 📈 Performance

### Metrics
- **Analysis Time**: < 30 seconds average
- **Frame Processing**: 36 frames at 12 fps
- **Audio Processing**: 3-second segments
- **API Efficiency**: Optimized multi-modal prompts

### Optimization
- Client-side frame extraction reduces server load
- IndexedDB prevents memory overflow for large files
- Retry logic with exponential backoff for reliability
- Fallback scoring ensures consistent user experience

## 📖 Documentation

- **[Implementation Guide](./documentations/HOOK_ANALYSIS_IMPLEMENTATION.md)**: Technical details
- **[Original Issue](./documentations/AI_VIDEO_ANALYSIS_SCORING_ISSUE.md)**: Project requirements completed
- **[Product Documentation](./documentations/PRODUCT_DOCUMENTATION.md)**: User guides

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Coverage
- Unit tests for video processing utilities
- Integration tests for API endpoints
- E2E tests for complete analysis pipeline
- Performance tests for large video files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation for API changes
- Ensure build passes before submitting PR

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **OpenAI**: For GPT-4o and Whisper API capabilities
- **Vercel**: For Next.js framework and hosting platform
- **v0.dev**: For rapid prototyping and development
- **Lucide**: For beautiful icon system
- **Tailwind CSS**: For utility-first styling approach

## 📞 Support

- **Documentation**: Check our comprehensive guides in `/documentations`
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Continue Building**: [https://v0.dev/chat/projects/0W2FOYHl7sY](https://v0.dev/chat/projects/0W2FOYHl7sY)

---

**🎯 Help creators optimize their video hooks for maximum viewer retention with AI-powered analysis!**