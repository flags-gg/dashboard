# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint and Next.js lint checks
- `pnpm test` - Run Jest tests

### Installation
- This project uses `pnpm` (v9.12.0) as the package manager
- Run `pnpm install` to install dependencies

## Architecture

### Tech Stack
- **Framework**: Next.js 15.3.2 with App Router
- **UI**: React 19, shadcn/ui components, Radix UI
- **Styling**: Tailwind CSS v4 with PostCSS
- **Authentication**: Clerk
- **State**: Jotai + React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **TypeScript**: Strict mode enabled with path aliases (`~/*` → `./src/*`)

### Project Structure
- `/src/app/` - Next.js App Router pages and API routes
- `/src/app/(dashboard)/` - Authenticated dashboard routes
- `/src/app/api/` - API route handlers (proxy to external API)
- `/src/components/ui/` - shadcn/ui components
- `/src/hooks/` - Custom React hooks for data fetching
- `/src/lib/` - Utilities, interfaces, and state management

### API Communication Pattern
The app uses Next.js API routes as a proxy layer to the external API server (`https://api.flags.gg/v1`):

1. **Client → Next.js API Route**: 
   ```typescript
   fetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) })
   ```

2. **API Route → External API**:
   ```typescript
   fetch(`${env.API_SERVER}/endpoint`, {
     headers: { 'x-user-subject': user.id },
     body: JSON.stringify(data)
   })
   ```

3. **Authentication**: All routes use Clerk middleware. In API routes:
   ```typescript
   const user = await currentUser();
   if (!user) return new NextResponse('Unauthorized', { status: 401 })
   ```

### State Management
- **Global State**: Jotai atoms with persistence in `/src/lib/statemanager/`
- **Server State**: React Query hooks in `/src/hooks/`
- **Forms**: React Hook Form with Zod schemas

### Environment Variables
Required environment variables (see `/src/env.ts`):
- `CLERK_SECRET_KEY` - Clerk authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `UPLOADTHING_TOKEN` - File upload service
- `STRIPE_KEY`, `STRIPE_SECRET` - Payment processing
- `API_SERVER` - External API URL (defaults to https://api.flags.gg/v1)
- `NEXT_PUBLIC_FLAGS_*` - Feature flag IDs

### Key Patterns
- **Error Handling**: Consistent try-catch with NextResponse.json error responses
- **Data Fetching**: React Query with retry logic and 5-minute stale time
- **Type Safety**: Comprehensive interfaces in `/src/lib/interfaces.ts`
- **File Uploads**: UploadThing integration in `/src/app/api/uploadthing/`

### Testing
- Jest configured with TypeScript support
- Testing Library for React component testing
- Run tests with `pnpm test`