# AI SDK v5 Beta Implementation Guide

## Overview

This document outlines the implementation of Vercel AI SDK v5 beta in the AI Hook Scorer project. The AI SDK v5 brings enhanced type safety, improved streaming capabilities, and a more flexible architecture for AI integrations.

## Dependencies

```json
{
  "ai": "^5.0.0-beta.15",
  "@ai-sdk/openai": "^2.0.0-beta.7",
  "@ai-sdk/react": "^2.0.0-beta.15"
}
```

## Key Features Used

### 1. Structured Data Generation with `generateObject`

We use `generateObject` for video analysis to ensure type-safe, structured responses from GPT-4o.

#### Implementation in API Route (`app/api/analyze-video/route.ts`)

```typescript
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Define schema for structured output
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

// Generate structured analysis
const { object } = await generateObject({
  model: openai('gpt-4o'),
  temperature: 0.3,
  schema: videoAnalysisSchema,
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent } // Multi-modal content with images and text
  ]
});
```

### 2. Audio Transcription with `experimental_transcribe`

Audio transcription uses the experimental transcription API for Whisper integration.

#### Implementation in API Route (`app/api/transcribe-audio/route.ts`)

```typescript
import { openai } from '@ai-sdk/openai';
import { experimental_transcribe as transcribe } from 'ai';

// Transcribe audio file
const audioBuffer = await audioFile.arrayBuffer();

const { text } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: audioBuffer,
});
```

### 3. LLM Client Integration (`lib/video-analysis/llm-client.ts`)

The LLM client class wraps AI SDK functionality for reusable video analysis.

```typescript
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export class LLMVideoAnalyzer {
  async analyzeVideo(
    processedVideo: ProcessedVideo,
    transcription?: TranscriptionResult
  ): Promise<VideoAnalysisResult> {
    const { object } = await generateObject({
      model: openai(this.config.model || 'gpt-4o'),
      temperature: this.config.temperature,
      schema: videoAnalysisSchema,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ]
    });

    return {
      overall_score: object.overall_score,
      breakdown: object.breakdown,
      comments: object.comments,
      confidence: object.confidence,
      transcription
    };
  }
}
```

## Key Changes from v4 to v5

### 1. API Simplification

**v4 (messages-based):**
```typescript
messages: [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: userContent }
]
```

**v5 (messages-based):**
```typescript
messages: [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: userContent }
]
```

### 2. Enhanced Type Safety

- Zod schemas ensure runtime validation
- TypeScript types automatically inferred from schemas
- Compile-time guarantees for response structure

### 3. Better Error Handling

- `AI_NoObjectGeneratedError` for failed generations
- More descriptive error messages
- Automatic retry mechanisms in SDK

## Multi-Modal Content Support

AI SDK v5 supports multi-modal content seamlessly:

```typescript
const userContent = [
  {
    type: 'text' as const,
    text: `Analyze these ${frames.length} frames from a hook video:`
  },
  ...frames.map(frame => ({
    type: 'image' as const,
    image: frame // Base64 data URL
  }))
];
```

## Environment Configuration

Ensure your environment variables are set:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

## Error Handling Best Practices

### 1. Graceful Degradation

```typescript
try {
  const { object } = await generateObject({...});
  return object;
} catch (error) {
  console.error('AI analysis failed:', error);
  return getFallbackResult();
}
```

### 2. Timeout Management

```typescript
export const maxDuration = 30; // Vercel function timeout
```

### 3. Payload Size Optimization

```typescript
// Limit frames for production
const maxFrames = process.env.NODE_ENV === 'production' ? 8 : 12;
const limitedFrames = frames.slice(0, maxFrames);
```

## Performance Considerations

### 1. Token Optimization

- Use `maxTokens: 1000` to balance detail and speed
- Employ `temperature: 0.3` for consistent results

### 2. Content Optimization

- Limit image frames to prevent timeout
- Compress images to reduce payload size
- Use efficient prompts

### 3. Caching Strategy

- Consider caching common analysis results
- Use IndexedDB for client-side video storage

## Testing

### Build Verification

```bash
yarn build  # Verify TypeScript compilation
```

### Development Testing

```bash
yarn dev    # Test in development mode
```

## Migration Notes

### From OpenAI SDK Direct Usage

**Before:**
```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify(prompt)
});
```

**After:**
```typescript
const { object } = await generateObject({
  model: openai('gpt-4o'),
  schema: mySchema,
  messages: [
    { role: 'user', content: content }
  ]
});
```

### Benefits of Migration

1. **Type Safety**: Compile-time validation of AI responses
2. **Error Handling**: Built-in retry and error management
3. **Simpler API**: Reduced boilerplate code
4. **Future-Proof**: Access to latest AI SDK features

## Troubleshooting

### Common Issues

1. **Schema Validation Errors**: Ensure Zod schema matches expected output
2. **Timeout Issues**: Reduce frame count or increase `maxDuration`
3. **API Key Errors**: Verify `OPENAI_API_KEY` environment variable

### Debug Tips

```typescript
console.log('Payload size:', JSON.stringify(content).length);
console.log('Frame count:', frames.length);
```

## Resources

- [AI SDK v5 Beta Announcement](https://v5.ai-sdk.dev/docs/announcing-ai-sdk-5-beta)
- [Structured Data Generation](https://v5.ai-sdk.dev/docs/ai-sdk-core/generating-structured-data)
- [Audio Transcription](https://v5.ai-sdk.dev/docs/ai-sdk-core/transcription)
- [OpenAI Provider](https://v5.ai-sdk.dev/providers/ai-sdk-providers/openai)

---

**Last Updated**: 2025-07-12  
**AI SDK Version**: v5.0.0-beta.15  
**Status**: Production Ready