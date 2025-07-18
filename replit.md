# File Upload Component Application

## Overview

This is a full-stack TypeScript application featuring a modern React file upload component with drag-and-drop functionality. The application is built with a React frontend using Vite, an Express backend, and includes a comprehensive UI component library based on shadcn/ui. The project is structured as a monorepo with shared schemas and includes database integration capabilities with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: TailwindCSS with CSS custom properties for theming
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Icons**: Lucide React for consistent iconography

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (configured but not actively used)
- **Storage**: In-memory storage implementation (MemStorage class)
- **API**: RESTful API structure with `/api` prefix

### Development Setup
- **Development Server**: Vite dev server with HMR
- **Production Build**: Vite build + esbuild for server bundling
- **Database Migration**: Drizzle Kit for schema management
- **Environment**: Replit-optimized with custom plugins

## Key Components

### File Upload Component
- **Core Feature**: Drag-and-drop file upload with visual feedback
- **File Validation**: Type and size validation with configurable limits
- **Preview System**: Image previews with loading states
- **Progress Tracking**: Upload progress indicators with parallel processing
- **File Management**: View, download, and delete functionality
- **Accessibility**: ARIA labels and keyboard navigation support

### UI Component Library
- **Base Components**: 40+ pre-built components (buttons, inputs, dialogs, etc.)
- **Styling System**: Consistent design tokens with dark/light mode support
- **Responsive Design**: Mobile-first approach with breakpoint utilities
- **Animation**: Smooth transitions and micro-interactions

### Storage Layer
- **Interface**: `IStorage` interface for CRUD operations
- **Implementation**: In-memory storage with user management
- **Extensibility**: Ready for database integration

## Data Flow

1. **File Upload Process**:
   - User selects or drops files into the upload area
   - Files are validated against type and size constraints
   - Valid files are queued for upload with progress tracking
   - Upload simulation provides realistic progress feedback
   - Completed uploads are displayed in the file management panel

2. **API Communication**:
   - Frontend uses TanStack Query for server state management
   - API requests are handled through a centralized request function
   - Error handling with toast notifications for user feedback

3. **State Management**:
   - Component-level state for file upload functionality
   - Server state cached and synchronized via TanStack Query
   - UI state managed through React hooks and context

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Libraries**: Radix UI primitives, Lucide React icons
- **Styling**: TailwindCSS, class-variance-authority for component variants
- **Database**: Drizzle ORM with PostgreSQL adapter
- **Utilities**: date-fns for date manipulation, clsx for conditional classes

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript compiler
- **Code Quality**: ESLint, Prettier (configured but not in main package.json)
- **Replit Integration**: Custom Vite plugins for development environment

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Full HMR support for both frontend and backend
- **Environment Variables**: DATABASE_URL for database connection
- **Replit Integration**: Custom banners and development tools

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: esbuild bundles server code for Node.js execution
- **Output**: Separate dist folders for client and server builds
- **Deployment**: Single command builds both frontend and backend

### Database Strategy
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Connection**: PostgreSQL via Neon serverless database
- **Fallback**: In-memory storage for development without database
- **Migration**: `db:push` command for schema synchronization

The application is designed to be easily deployable on Replit or similar platforms, with a focus on developer experience and modern web development practices.