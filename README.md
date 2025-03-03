# Event Ticketing System

A full-stack web application for event ticketing with a Next.js frontend and Supabase backend.

## Features

- User authentication (register, login, profile management)
- Event browsing and searching
- Venue information
- Ticket booking and management
- Order processing and payment
- User dashboard with ticket history

## Tech Stack

### Frontend
- Next.js with TypeScript
- Tailwind CSS for styling
- Redux Toolkit for state management
- Shadcn UI components
- React Hook Form for form handling
- Zod for validation

### Backend
- Supabase for database and authentication
- PostgreSQL database
- Row-level security policies

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Create a new Supabase project
2. Run the migration scripts in the `supabase/migrations` folder to set up the database schema
3. The seed data script will populate the database with initial test data

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable UI components
- `/lib` - Utility functions, Redux store, and API clients
- `/supabase` - Database migrations and seed data
- `/public` - Static assets

## Database Schema

The application uses the following database tables:

- `users` - User accounts and profiles
- `events` - Event details
- `venues` - Venue information
- `speakers` - Event speakers
- `tickets` - Available tickets for events
- `orders` - User orders
- `order_items` - Items in each order
- `payments` - Payment information

## Authentication

The application uses Supabase Auth for authentication with JWT tokens. Users can register with email and password, and have different roles (admin, organizer, attendee).

## License

This project is licensed under the MIT License.#   d b m s D a  
 