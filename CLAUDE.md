# AI Hook Scorer - Claude Code Project Guide

## Project Overview
AI Hook Scorer is a Next.js application that analyzes video hooks using multi-modal AI (GPT-4o + Whisper) to help content creators optimize their video openings for maximum viewer retention.

## Essential Commands

### Development
```bash
cd ai-hook-scorer_main
yarn dev             # Start development server at localhost:3000
yarn build           # Build for production
yarn start           # Start production server
yarn lint            # Run ESLint
```

### Testing
```bash
yarn test            # Run test suite
yarn test:watch      # Run tests in watch mode
```

### Git Operations
```bash
gh pr create        # Create pull request (GitHub CLI installed)
gh issue list       # List issues
gh repo view        # View repository details
```

## Project Structure

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable UI components (shadcn/ui)
- `lib/` - Core business logic and utilities
- `lib/video-analysis/` - Video processing and AI integration
- `hooks/` - Custom React hooks
- `documentations/` - Project documentation

### Important Files
- `app/layout.tsx` - Root layout with theme provider
- `lib/video-analysis/video-processor.ts` - Frame extraction logic
- `lib/video-analysis/llm-client.ts` - OpenAI integration
- `components.json` - shadcn/ui configuration

## Code Style Guidelines

### TypeScript
- Strict TypeScript configuration enabled
- All files must be typed
- Use interfaces for object shapes
- Prefer type-safe patterns

### React/Next.js
- Use App Router (not Pages Router)
- Prefer server components when possible
- Use client components only when needed ('use client')
- Follow React hooks best practices

### Styling
- Tailwind CSS for all styling
- Use shadcn/ui components
- Follow existing design patterns
- Mobile-first responsive design

### Code Organization
- Group related functionality in lib/ folders
- Export from index files when appropriate
- Use descriptive, clear naming
- Separate concerns (UI, business logic, API)

## Environment Setup

### Required Environment Variables
```bash
OPENAI_API_KEY=sk-your-api-key-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

### Development Dependencies
- Node.js 18+
- yarn (preferred package manager)
- OpenAI API access (GPT-4o + Whisper)
- Supabase account (optional)

## Key Features & Architecture

### Video Analysis Pipeline
1. **Video Upload** - Client-side file handling with IndexedDB
2. **Frame Extraction** - 12fps extraction from first 3 seconds
3. **Audio Transcription** - Whisper API integration
4. **AI Analysis** - GPT-4o multi-modal analysis
5. **Scoring** - 6-category breakdown (0-100 scale)

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI primitives
- **AI/ML**: OpenAI GPT-4o, Whisper API
- **Storage**: IndexedDB (client), Supabase (optional)
- **Deployment**: Vercel

## Testing Guidelines

### Test Files Location
- Unit tests: `lib/video-analysis/__tests__/`
- Integration tests: Near feature implementation
- Test files: `*.test.ts` or `*.test.tsx`

### Testing Patterns
- Test business logic thoroughly
- Mock external API calls (OpenAI)
- Test error handling and edge cases
- Verify TypeScript types in tests

## Repository Etiquette

### Commit Guidelines
- Use conventional commits format
- Include clear, descriptive messages
- Reference issues when applicable
- Keep commits focused and atomic

### Branch Strategy
- `main` - Production ready code
- Feature branches for new development
- Use descriptive branch names

### Pull Request Process
1. Create feature branch
2. Implement changes with tests
3. Run linting and build checks
4. Create PR with clear description
5. Address review feedback

## Common Tasks

### Adding New API Route
```bash
# Create new API route
touch app/api/your-endpoint/route.ts
# Follow existing patterns in app/api/analyze-video/route.ts
```

### Adding New Component
```bash
# Use shadcn/ui CLI when possible
npx shadcn-ui@latest add component-name
# Or create in components/ following existing patterns
```

### Video Analysis Development
- Main logic in `lib/video-analysis/`
- Follow existing service patterns
- Include proper error handling
- Add unit tests for new features

## Performance Considerations

### Video Processing
- Client-side frame extraction to reduce server load
- IndexedDB for large file storage
- Optimize canvas operations
- Limit analysis to first 3 seconds

### API Optimization
- Server-side API key protection
- Implement rate limiting
- Use efficient prompts for AI models
- Handle API failures gracefully

## Security Notes

### API Keys
- Never expose OpenAI API keys client-side
- Use server-side API routes for AI calls
- Validate all user inputs
- Implement proper error handling

### File Handling
- Validate file types and sizes
- Use secure file processing
- Clean up temporary files
- Sanitize user uploads

## Troubleshooting

### Common Issues
1. **Build Failures** - Check TypeScript errors, run `yarn lint`
2. **API Errors** - Verify environment variables and API keys
3. **Video Processing** - Check file format support and size limits
4. **Performance** - Monitor frame extraction and API call timing

### Debug Commands
```bash
yarn build 2>&1 | tee build.log     # Capture build output
yarn lint --fix                     # Auto-fix linting issues
```

## Resources

### Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Project-Specific Docs
- `documentations/HOOK_ANALYSIS_IMPLEMENTATION.md` - Technical implementation
- `documentations/PRODUCT_DOCUMENTATION.md` - User-facing features
- `documentations/AI_VIDEO_ANALYSIS_SCORING_ISSUE.md` - Original requirements

---

**Last Updated**: 2025-07-11
**Claude Code Version**: Latest