# Quick Setup Guide

Follow these steps to get your flashcard application running:

## 1. Environment Setup

```bash
# Copy the environment template
cp env.example .env.local

# Edit .env.local with your database credentials
# You'll need:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (any secure random string)
# - NEXT_PUBLIC_APP_URL (http://localhost:3000 for development)
```

## 2. Database Setup

### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally, then:
createdb flashcards_db
# Update DATABASE_URL in .env.local to point to your local database
```

### Option B: Free Cloud Database (Recommended)
1. Go to [Supabase](https://supabase.com/) or [Railway](https://railway.app/)
2. Create a new PostgreSQL project
3. Copy the connection string to your `.env.local` file

## 3. Initialize the Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (includes test user)
npm run db:seed
```

## 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Test Login

Use the seeded test account:
- **Email**: test@example.com
- **Password**: password123

## 6. Explore Features

1. **Dashboard**: View your decks and progress
2. **Create Decks**: Add new flashcard collections
3. **Add Cards**: Populate your decks with flashcards
4. **Study Mode**: Use spaced repetition to study
5. **Keyboard Shortcuts**: 
   - Space: Flip card
   - 1-5: Grade your performance

## 7. Run Tests

```bash
# Unit tests
npm run test

# E2E tests (requires running app)
npm run test:e2e
```

## Troubleshooting

- **Database connection issues**: Check your DATABASE_URL format
- **Build errors**: Run `npm run db:generate` after schema changes
- **Auth issues**: Ensure JWT_SECRET is set in .env.local

## Next Steps

- Customize the UI colors in `tailwind.config.ts`
- Add more features like card import/export
- Deploy to Vercel or your preferred platform
- Set up production database



