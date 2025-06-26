# 40 Acres - Real Estate Investment Platform

## Overview

40 Acres is a full-stack real estate investment platform that enables fractional property ownership through tokenization. The platform allows property owners to list their properties for fractional investment while enabling investors to purchase shares starting at $10. Built with modern web technologies, it features a React frontend with TypeScript, Express.js backend, PostgreSQL database with Drizzle ORM, and comprehensive authentication through Replit Auth.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite with custom configuration for client/server separation

### Backend Architecture
- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js with custom middleware
- **Database**: PostgreSQL 16 with Neon serverless connection
- **ORM**: Drizzle ORM with schema-first approach
- **Authentication**: Replit Auth with OpenID Connect
- **File Uploads**: Multer for document and media handling

### Key Design Decisions
1. **Monorepo Structure**: Client, server, and shared code in single repository for easier development
2. **Type Safety**: Full TypeScript implementation with shared schema types
3. **Serverless-Ready**: Neon PostgreSQL for scalable database connections
4. **Component-Based UI**: Reusable component library with consistent design patterns

## Key Components

### Database Schema
- **Users**: Replit Auth integration with investor/business user types
- **Properties**: Real estate listings with tokenization support
- **Investments**: Fractional ownership tracking
- **Transactions**: Payment and transfer history
- **Documents**: Legal document verification system
- **Community Features**: Posts, comments, follows, and leaderboards
- **AI Services**: Recommendations and risk assessments

### Payment Integration
- **Stripe**: Primary payment processor for investments
- **PayPal**: Alternative payment option
- **Bitcoin Integration**: Price display and conversion features
- **Fee Calculation**: Dynamic listing fees based on property value and location

### AI-Powered Features
- **Property Recommendations**: OpenAI-powered investment suggestions
- **Risk Assessment**: Automated property risk analysis
- **Document Verification**: AI-assisted legal document review
- **Market Analytics**: Investment trend analysis

### Security Features
- **Session Management**: Secure session storage with PostgreSQL
- **Device Tracking**: Multi-device authentication monitoring
- **Document Encryption**: Secure file storage and access
- **Rate Limiting**: API protection against abuse

## Data Flow

### Investment Process
1. User browses properties on marketplace
2. Property details fetched from database with real-time availability
3. Investment modal calculates ownership percentages and tokenomics
4. Stripe payment intent created for secure processing
5. Transaction recorded and property shares updated atomically
6. User portfolio updated with new investment

### Property Listing Flow
1. Property owner uploads property details and documentation
2. AI services analyze property value and risk factors
3. Legal documents undergo verification process
4. Property goes live for fractional investment
5. Community features activated (chat, updates, etc.)

### Authentication Flow
1. Replit Auth handles user authentication via OpenID Connect
2. User sessions stored in PostgreSQL sessions table
3. User profiles created/updated with business/investor classification
4. Role-based access control for different platform features

## External Dependencies

### Core Services
- **Replit Auth**: Authentication and user management
- **Stripe**: Payment processing and customer management
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI**: AI-powered recommendations and analysis

### Optional Integrations
- **PayPal**: Alternative payment processing
- **HubSpot**: CRM integration for business users
- **Zoom**: Virtual property tours and meetings
- **Bitcoin Price API**: Cryptocurrency price conversion

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Server-side bundle optimization
- **PostCSS**: CSS processing with Tailwind
- **TypeScript**: Type checking and compilation

## Deployment Strategy

### Production Build
- Frontend built with Vite to `dist/public`
- Server bundled with ESBuild to `dist/index.js`
- Static assets served from Express with proper caching

### Environment Configuration
- **Development**: Local PostgreSQL with hot reload
- **Production**: Neon serverless PostgreSQL with connection pooling
- **Database Migrations**: Automated with Drizzle push commands

### Scaling Considerations
- Serverless-compatible database connections
- Stateless server design for horizontal scaling
- CDN-ready static asset organization
- Database connection pooling for high concurrency

## Recent Changes
- June 26, 2025: Enhanced dropdown navigation for profile settings with Membership tab and improved same-page navigation
- June 26, 2025: Fixed 40 Acres logo display on credit card graphic in Dashboard wallet container
- June 26, 2025: Fixed Community page Loop Feed to display as modern social media timeline with investor posts and property showcases
- June 26, 2025: Added cryptocurrency payment support to Investment modal with USD/Bitcoin payment method selector
- June 26, 2025: Implemented cryptocurrency wallet connection functionality for Bitcoin investments
- June 26, 2025: Added USD/Bitcoin switcher to 40 Acres Wallet container on Dashboard
- June 26, 2025: Updated Invest page dropdown hover colors to #A52A2A for "All Types", "All Prices", and "All Locations"
- June 26, 2025: Added USD/Bitcoin (BTC) currency switcher to Dashboard Investment Breakdown and Earnings containers with Bitcoin icon
- June 26, 2025: Added Property Screenshots upload section (up to 75 photos) to List Your Property form
- June 26, 2025: Added "Land" as new property type option in property listing form
- June 26, 2025: Added comprehensive tokenization education step to all tutorials covering cryptocurrency investing and blockchain benefits
- June 25, 2025: Created comprehensive Legal Disclaimer page for real estate crowdfunding and cryptocurrency investments
- June 25, 2025: Implemented payment method modal popup in Settings with full card entry form and billing address
- June 25, 2025: Fixed Investor Guide modal button overlap issue by hiding default close button
- June 25, 2025: Updated List Your Property form with consistent black colors and burgundy dropdown hover effects
- June 25, 2025: Fixed footer width to span full page across all pages
- June 25, 2025: Modernized Community page Loop Feed with timeline view
- June 25, 2025: Changed "Leaderboard" to "Open Houses" with zip code search functionality
- June 25, 2025: Applied consistent #A52A2A burgundy color scheme across all UI elements

## Changelog
- June 21, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.