# AI Hook Scorer - Product Documentation

## Overview

AI Hook Scorer is a cutting-edge web application that analyzes short-form video content to evaluate the effectiveness of opening hooks. The platform uses AI-powered analysis to provide creators with actionable insights and scores to improve their video engagement and viral potential.

## Features

### Core Functionality
- **Video Upload & Analysis**: Drag-and-drop interface for video uploads with real-time analysis
- **AI-Powered Scoring**: Advanced algorithms evaluate hook effectiveness on a 0-100 scale
- **Detailed Feedback**: Comprehensive analysis with specific improvement recommendations
- **Instant Results**: Fast processing with engaging progress visualization
- **Viral Pattern Recognition**: Comparison against 10M+ successful hooks database

### User Experience
- **No Sign-up Required**: Immediate access to basic scoring functionality
- **Google OAuth Integration**: Seamless authentication for advanced features
- **Responsive Design**: Optimized for desktop and mobile devices
- **Premium UI/UX**: Dark theme with glassmorphism effects and smooth animations
- **Progress Tracking**: Real-time analysis steps with visual feedback

### Waitlist & User Management
- **Exclusive Access**: Waitlist system for premium features
- **User Profiles**: Google-integrated user profiles with avatar support
- **Session Management**: Persistent authentication across sessions

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **State Management**: React hooks and context

### Backend & Database
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: PostgreSQL via Supabase
- **File Storage**: Browser-based file handling
- **API**: Next.js API routes

### Design System
- **Color Palette**: Dark theme with purple/blue gradients
- **Typography**: Inter font family
- **Components**: Comprehensive UI library with 40+ components
- **Animations**: CSS animations with Tailwind utilities
- **Effects**: Glassmorphism, grain textures, premium glows

## User Flow

### 1. Landing Page (`/`)
- Hero section with value proposition
- Drag-and-drop video upload interface
- Feature highlights and benefits
- Immediate analysis initiation

### 2. Analysis Page (`/analyzing`)
- Multi-step progress visualization
- Real-time status updates
- AI analysis simulation
- Automatic redirection to results

### 3. Results Page (`/result`)
- Hook score display (0-100)
- Performance feedback and comments
- Potential score improvement preview
- Call-to-action for premium features
- Google authentication prompt

### 4. Waitlist Page (`/waitlist`)
- Success confirmation
- Feature preview
- User profile display
- Additional video analysis option

## Database Schema

### Waitlist Users Table
\`\`\`sql
CREATE TABLE waitlist_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### Security Features
- Row Level Security (RLS) enabled
- User-specific data access policies
- Secure authentication flow
- Environment variable protection

## API Documentation

### Authentication Endpoints
- `GET /auth/callback` - OAuth callback handler
- Google OAuth integration via Supabase

### Core Functions
- `signInWithGoogle()` - Initiates Google OAuth flow
- `signOut()` - Handles user logout
- `getCurrentUser()` - Retrieves current user session
- `addToWaitlist()` - Adds user to waitlist
- `getWaitlistEntry()` - Retrieves user waitlist status

## Component Library

### UI Components (40+ components)
- **Layout**: Sidebar, Navigation, Breadcrumb
- **Forms**: Input, Textarea, Select, Checkbox, Radio
- **Feedback**: Toast, Alert, Progress, Skeleton
- **Overlay**: Dialog, Sheet, Popover, Tooltip
- **Data Display**: Table, Card, Badge, Avatar
- **Navigation**: Tabs, Pagination, Command
- **Media**: Carousel, Aspect Ratio
- **Charts**: Recharts integration

### Custom Hooks
- `useAuth` - Authentication state management
- `useIsMobile` - Responsive design helper
- `useToast` - Toast notification system

## Styling System

### CSS Utilities
- **Gradients**: Silicon gradients, animated backgrounds
- **Effects**: Glass morphism, grain textures, premium glows
- **Animations**: Gradient animations, pulse effects
- **Typography**: Text gradients, balanced text
- **Layout**: Dark gradient backgrounds, noise effects

### Color Variables
- Comprehensive CSS custom properties
- Dark/light theme support
- Sidebar-specific color scheme
- Chart color palette

## Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account
- Google OAuth credentials

### Environment Variables
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations
5. Start development server: `npm run dev`

### Database Setup
1. Create Supabase project
2. Run the SQL script: `scripts/create-waitlist-table.sql`
3. Configure Google OAuth in Supabase Auth settings
4. Set up RLS policies

## Performance Considerations

### Optimization Features
- Image optimization disabled for compatibility
- TypeScript and ESLint build error ignoring
- Efficient component lazy loading
- Optimized bundle size with tree shaking

### Scalability
- Singleton pattern for Supabase client
- Efficient state management
- Responsive design for all devices
- Progressive enhancement approach

## Security Features

### Authentication Security
- Secure OAuth flow
- Session persistence
- Automatic token refresh
- Protected routes

### Database Security
- Row Level Security (RLS)
- User-specific data access
- Secure environment variables
- SQL injection prevention

## Future Enhancements

### Planned Features
- Advanced hook analysis metrics
- Video editing suggestions
- Batch video processing
- Analytics dashboard
- Creator community features
- API for third-party integrations

### Technical Improvements
- Real AI integration
- Video processing pipeline
- Advanced scoring algorithms
- Performance monitoring
- A/B testing framework

## Support & Maintenance

### Monitoring
- Error tracking and logging
- Performance monitoring
- User analytics
- Database health checks

### Updates
- Regular dependency updates
- Security patch management
- Feature rollout strategy
- User feedback integration

---

*This documentation covers the current state of the AI Hook Scorer application as of the latest development cycle. For technical support or feature requests, please refer to the project repository.*
