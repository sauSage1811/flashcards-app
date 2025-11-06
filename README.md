# Flashcard App

A modern, full-stack flashcard application built with Next.js, featuring spaced repetition learning algorithms to help you retain knowledge effectively.

## Features

- 🎯 **Spaced Repetition**: Scientifically-proven algorithm for optimal learning
- 📚 **Deck Management**: Create, organize, and manage your flashcard decks
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔐 **Authentication**: Secure user registration and login
- 📊 **Progress Tracking**: Monitor your learning progress
- ⌨️ **Keyboard Shortcuts**: Efficient study experience with keyboard navigation
- 🧪 **Testing**: Comprehensive unit and E2E tests

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **State Management**: TanStack Query (React Query)
- **Testing**: Jest, Playwright
- **Validation**: Zod schemas

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd flashcards-app
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your database URL and JWT secret:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/flashcards_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Test Account

After seeding, you can log in with:
- **Email**: test@example.com
- **Password**: password123

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
flashcards-app/
├── app/                    # Next.js App Router
│   ├── (app)/             # Protected routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── decks/         # Deck management
│   │   └── study/         # Study interface
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       ├── decks/         # Deck CRUD operations
│       └── study/         # Study functionality
├── components/            # React components
│   ├── flashcards/        # Flashcard components
│   ├── providers/         # Context providers
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database client
│   ├── srs.ts            # Spaced repetition algorithm
│   └── validators.ts     # Zod validation schemas
├── prisma/               # Database schema and migrations
└── tests/                # End-to-end tests
```

## Key Features Explained

### Spaced Repetition Algorithm

The app implements a simplified SM-2 algorithm that:
- Increases intervals for cards you know well
- Decreases intervals for cards you struggle with
- Resets progress for failed cards
- Adapts difficulty based on your performance

### Study Interface

- **Flip Cards**: Click or press Space to reveal answers
- **Grade Cards**: Use number keys 1-5 to rate your performance
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Visual Feedback**: Smooth animations and clear UI states

### Authentication

- Secure JWT-based authentication
- Password hashing with bcrypt
- HttpOnly cookies for security
- Protected route middleware

## Database Schema

The app uses a relational schema with:
- **Users**: Authentication and profile data
- **Decks**: Collections of flashcards
- **Cards**: Individual flashcards with SRS data
- **ReviewLogs**: History of study sessions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.