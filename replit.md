# 40 Acres - Real Estate Investment Platform

## Overview
40 Acres is a full-stack real estate investment platform designed to facilitate fractional property ownership through tokenization. It enables property owners to list their assets for fractional investment, while allowing investors to purchase shares starting from $10. The platform aims to democratize real estate investment, making it accessible to a wider audience, and leverages modern web technologies for a robust and scalable solution. Key capabilities include AI-powered recommendations, comprehensive security features, and integrated payment solutions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
**Core Design Principles:**
- **Monorepo Structure**: Centralized code management for client, server, and shared components.
- **Type Safety**: End-to-end type safety using TypeScript for enhanced code quality.
- **Serverless-Ready**: Designed for scalability with serverless database connections.
- **Component-Based UI**: Modular and reusable UI components for consistent design.

**Frontend:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query
- **UI Framework**: Shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom design system
- **Build Tool**: Vite

**Backend:**
- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 16 (Neon serverless connection)
- **ORM**: Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **File Uploads**: Multer

**Key Features & Implementations:**
- **Database Schema**: Manages Users (integrated with Replit Auth, supporting investor/business types), Properties (with tokenization), Investments, Transactions, Documents, and Community Features (posts, comments, leaderboards). Includes AI Services for recommendations and risk assessments.
- **Payment Integration**: Supports Stripe and PayPal for investment processing, with dynamic fee calculation. Displays Bitcoin price and supports cryptocurrency payment options.
- **AI-Powered Features**: Provides property recommendations, risk assessments, document verification, and market analytics using AI.
- **Security Features**: Incorporates secure session management, device tracking, document encryption, and API rate limiting.
- **Comprehensive Wallet Security**: Integrated E0G Trust API and Bridge Analytics API for complete cryptocurrency wallet verification. Provides real-time security analysis with threat level scoring (LOW/MEDIUM/HIGH), transaction history tracking, compliance scoring, and risk pattern detection. High-risk wallets are automatically blocked from making cryptocurrency investments.
- **Investment Process**: Streamlined flow from property browsing to secure payment processing and portfolio updates, with integrated wallet security verification for cryptocurrency transactions.
- **Property Listing Flow**: Guided process for property owners, including AI analysis, legal document verification, and community activation.
- **Authentication Flow**: Handles user authentication via Replit Auth, manages user sessions in PostgreSQL, and implements role-based access control.

## External Dependencies
- **Replit Auth**: For authentication and user management.
- **Stripe**: Primary payment processing and customer management.
- **Neon Database**: Serverless PostgreSQL hosting.
- **OpenAI**: Powers AI-driven recommendations and analysis.
- **PayPal**: Alternative payment processing.
- **E0G Trust API**: Wallet security analysis and cryptocurrency risk assessment.
- **Bridge Analytics API**: Transaction history tracking and compliance scoring for wallet verification.
- **HubSpot**: (Optional) CRM integration for business users.
- **Zoom**: (Optional) For virtual property tours and meetings.
- **Bitcoin Price API**: For cryptocurrency price conversion.