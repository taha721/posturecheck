# PostureCheck - Posture Analysis Application

## Overview

PostureCheck is a web-based posture analysis application that uses computer vision and machine learning to analyze sitting posture from video recordings. Users upload a side-profile video of themselves working, and the application processes it using TensorFlow.js pose detection models to provide visual feedback with skeletal overlays (green for good posture, red for poor posture) along with detailed metrics and timeline analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Client-side routing using Wouter (lightweight alternative to React Router)
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**UI Component System**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui design system (New York variant) for pre-built components
- Tailwind CSS for utility-first styling with custom design tokens
- Dark mode support with theme toggle functionality (defaults to dark mode)

**State Management**
- TanStack Query (React Query) for server state and data fetching
- Local React state for component-specific state
- Session storage for temporary data persistence (video URLs between page navigations)

**Design System**
- Custom color palette focused on health/wellness aesthetics
- Posture-specific colors: green (good), yellow (warning), red (poor)
- Typography using Inter for UI and JetBrains Mono for metrics/timestamps
- Responsive design with mobile-first approach

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- Development mode uses Vite middleware for HMR
- Production build uses esbuild for server bundling
- HTTP server creation for potential WebSocket support

**API Structure**
- RESTful API design with `/api` prefix
- Centralized route registration pattern
- Custom error handling middleware
- Request/response logging with duration tracking

**Storage Layer**
- In-memory storage implementation (MemStorage) as default
- Interface-based design (IStorage) for easy swapping to database
- Prepared for PostgreSQL integration via Drizzle ORM
- Schema definitions in shared directory for type safety

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL
- Neon Database serverless driver for connection pooling
- Migration system with schema versioning
- Type-safe schema definitions using drizzle-zod

**Current Schema**
- Users table with UUID primary keys
- Username/password authentication structure
- Schema designed for extension (posture sessions, analysis results)

### Core Features

**Pose Detection & Analysis**
- TensorFlow.js with WebGL backend for client-side ML inference
- MoveNet model (SinglePose Lightning variant) for real-time pose estimation
- Custom posture analysis algorithm calculating neck and back angles
- Frame-by-frame processing at 30 FPS
- Quality classification: good/warning/poor based on angle thresholds

**Video Processing Pipeline**
1. Client-side video upload with drag-and-drop support
2. Local video processing without server upload (privacy-focused)
3. Pose detection on each frame
4. Posture quality analysis and timeline generation
5. Event detection for posture changes
6. Statistical aggregation (percentages, durations)

**Visualization Components**
- VideoPlayer with skeletal overlay rendering on HTML5 Canvas
- Color-coded skeleton based on posture quality
- Interactive timeline with seekable segments
- Metrics dashboard showing session statistics
- Event list with timestamps and descriptions
- Real-time progress tracking during processing

### External Dependencies

**Machine Learning**
- @tensorflow-models/pose-detection: Pre-trained pose estimation models
- @tensorflow/tfjs-core: Core TensorFlow.js runtime
- @tensorflow/tfjs-backend-webgl: GPU-accelerated computation

**Database & ORM**
- @neondatabase/serverless: Serverless PostgreSQL driver
- drizzle-orm: Type-safe ORM with schema migrations
- drizzle-kit: CLI tools for migrations

**UI Libraries**
- @radix-ui/*: 20+ accessible primitive components
- @tanstack/react-query: Data fetching and caching
- lucide-react: Icon library
- class-variance-authority: Type-safe variant styling
- tailwind-merge: Utility class merging

**Form & Validation**
- react-hook-form: Form state management
- @hookform/resolvers: Validation schema resolvers
- zod: TypeScript-first schema validation

**Development Tools**
- @replit/vite-plugin-*: Replit-specific development tooling
- tsx: TypeScript execution for development server
- esbuild: Fast production bundling

**Fonts**
- Google Fonts: Inter (primary UI) and JetBrains Mono (metrics)

### Authentication & Authorization

Currently implemented with basic user schema structure. Authentication system is prepared but not actively enforced on routes. The application operates in a stateless mode where video processing happens entirely client-side without user accounts required.

### Key Architectural Decisions

**Client-Side Video Processing**
- **Decision**: Process videos entirely in the browser using TensorFlow.js
- **Rationale**: Privacy-focused approach avoiding video uploads, reduces server costs, provides instant feedback
- **Trade-offs**: Requires capable client hardware, longer processing times on slower devices

**Monorepo Structure**
- **Decision**: Single repository with client/, server/, and shared/ directories
- **Rationale**: Type sharing between frontend/backend, simplified deployment, easier development
- **Trade-offs**: Tighter coupling, larger bundle if not careful with imports

**In-Memory Storage Default**
- **Decision**: Start with MemStorage, easy migration to database
- **Rationale**: Faster prototyping, simple deployment, database-ready architecture
- **Trade-offs**: Data loss on server restart, not suitable for production without migration

**shadcn/ui Component System**
- **Decision**: Copy-paste component library instead of npm package
- **Rationale**: Full customization control, no version lock-in, tree-shakeable
- **Trade-offs**: Manual updates required, larger initial codebase