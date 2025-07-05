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
- July 5, 2025: Updated homepage description text to change "rental properties" to "properties" for broader property type inclusivity
- July 5, 2025: Fixed website favicon proportions to prevent stretching - created square SVG favicon that maintains 40 Acres logo proportions properly in browser tabs
- July 5, 2025: Successfully rebranded Share Property modal from "Twitter" to "X" - updated all text references, replaced Twitter icon with provided X logo image, changed button styling to black theme, and updated social media URLs to use X branding throughout the modal
- July 5, 2025: Fixed overlapping buttons in tutorial popups by moving "Skip Tutorial" button to left side with proper spacing in InvestorTour, BusinessOwnerTour, and OnboardingTour components
- July 5, 2025: Updated Invest page dropdown menus (All Types, All Prices, All Locations) to use black selection color instead of yellow for consistent styling
- July 5, 2025: Enhanced Invest page authentication flow - "Invest Now" buttons now show "Join 40 Acres" registration popup for unauthenticated users
- July 5, 2025: Completed authentication system rebuild using React Context to eliminate excessive API calls and prevent property listing flickering
- July 4, 2025: Fixed container shaking/flickering issue by optimizing useAuth hook with aggressive caching and preventing excessive API calls
- July 4, 2025: Added React.memo to PropertyCard component to prevent unnecessary re-renders and stabilize UI
- July 4, 2025: Enhanced authentication flow - Invest Now button shows registration modal for unauthenticated users and investment modal for authenticated users
- July 4, 2025: Fixed share popup modal flashing issue by preventing auto-close on interaction outside and adding proper close buttons
- July 4, 2025: Restored Get Started and Login buttons to homepage header that were accidentally removed
- June 26, 2025: Fixed Share button modal responsiveness with scrollable content and max height constraints for mobile devices
- June 26, 2025: Added authentication requirement for favorites/save functionality on PropertyCard component across all pages
- June 26, 2025: Updated PropertyCard component to show registration modal when unauthenticated users try to save properties
- June 26, 2025: Enhanced Homepage and Invest page PropertyCard usage with authentication props for Save button functionality
- June 26, 2025: Added login requirement for "Invest Now" buttons on Invest page and "Start Property Listing" buttons on List Property page to show registration modal
- June 26, 2025: Removed "Max Amount $2,000" text from homepage passive income container and added login requirement for "Invest Now" buttons
- June 26, 2025: Updated "Upgrade Now" button in Gold membership modal to use gold gradient styling
- June 26, 2025: Updated "Get Started" registration modal to display 40 Acres logo instead of generic icon in header
- June 26, 2025: Updated Invest page with centered tour/upgrade buttons and enhanced styling for better user experience
- June 26, 2025: Updated Learn page "Start Learning" button to scroll to featured articles section and removed "Watch Video Guide" button
- June 26, 2025: Updated Learn page banner to match website color palette (changed from blue/purple gradient to black background) and adjusted heading font size to be consistent with other page headings
- June 26, 2025: Fixed Learn page navigation URL from /tokenomics to /learn in Header component
- June 26, 2025: Reverted Learn page back to original content with articles and guides on crowdfunding and real estate investing, moved tokenomics section to bottom
- June 26, 2025: Removed white background from Schedule Consultation link in footer, restored original gray text styling
- June 26, 2025: Updated Schedule Consultation button on List Property page "Ready to list your property" section to have white background with black text
- June 26, 2025: Added Step 5 "Business Verification & Review" to BusinessOwnerTour to match CreatePropertyModal's 6-step structure
- June 26, 2025: Changed 40 Acres credit card graphic to black color on Dashboard page
- June 26, 2025: Fixed Download import error on Learn (Tokenomics) page by adding Download to lucide-react imports
- June 26, 2025: Removed Step 6 "Build Your Community" from List Your Property modal, reducing total steps from 7 to 6
- June 26, 2025: Updated Create Account modal colors: changed blue icons to black, Continue/Complete Registration buttons to black, and added #A52A2A burgundy hover colors for dropdown menus
- June 26, 2025: Implemented Business Owner registration flow with "Property Listing Preferences" instead of "Investment Preferences" and property type dropdown with common property types
- June 26, 2025: Fixed navigation menu positioning to prevent overlap with logo and authentication buttons by adjusting left positioning
- June 26, 2025: Moved Step 5 property images and videos sections to Step 3 in List Your Property form, placing them below property description
- June 26, 2025: Updated List Your Property Step 3: Changed "Visual Appeal" to "Property Details", "Property Image URL" to "Featured Image" with file upload, removed Property Screenshots section, and updated button hover colors to black with white text
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