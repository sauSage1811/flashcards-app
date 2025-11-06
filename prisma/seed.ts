import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: hashedPassword,
    },
  });

  console.log('✅ Created user:', user.email);

  // Create a sample deck
  const deck = await prisma.deck.upsert({
    where: { id: 'sample-deck-1' },
    update: {},
    create: {
      id: 'sample-deck-1',
      title: 'Spanish Vocabulary',
      description: 'Basic Spanish words for beginners',
      userId: user.id,
    },
  });

  console.log('✅ Created deck:', deck.title);

  // Create sample cards
  const cards = [
    {
      term: 'hola',
      definition: 'hello',
      phonetics: '/ˈola/',
      exampleSentence: 'Hola, ¿cómo estás?',
      partOfSpeech: 'INTERJECTION' as const,
      tags: ['greeting', 'basic'],
    },
    {
      term: 'gracias',
      definition: 'thank you',
      phonetics: '/ˈɡɾaθjas/',
      exampleSentence: 'Gracias por tu ayuda.',
      partOfSpeech: 'INTERJECTION' as const,
      tags: ['gratitude', 'basic'],
    },
    {
      term: 'agua',
      definition: 'water',
      phonetics: '/ˈaɣwa/',
      exampleSentence: 'Necesito beber agua.',
      partOfSpeech: 'NOUN' as const,
      tags: ['nature', 'basic'],
    },
    {
      term: 'casa',
      definition: 'house',
      phonetics: '/ˈkasa/',
      exampleSentence: 'Mi casa es muy bonita.',
      partOfSpeech: 'NOUN' as const,
      tags: ['home', 'basic'],
    },
    {
      term: 'comer',
      definition: 'to eat',
      phonetics: '/koˈmeɾ/',
      exampleSentence: 'Me gusta comer pizza.',
      partOfSpeech: 'VERB' as const,
      tags: ['action', 'basic'],
    },
  ];

  for (const cardData of cards) {
    await prisma.card.upsert({
      where: {
        id: `sample-card-${cardData.term}`,
      },
      update: {},
      create: {
        id: `sample-card-${cardData.term}`,
        ...cardData,
        deckId: deck.id,
      },
    });
  }

  console.log('✅ Created', cards.length, 'sample cards');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



