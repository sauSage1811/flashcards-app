import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cardSchema } from '@/lib/validators';
import { ZodError } from 'zod';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const due = searchParams.get('due') === 'true';

    // Verify deck belongs to user
    const deck = await prisma.deck.findFirst({
      where: { 
        id,
        userId: user.id,
      },
    });

    if (!deck) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
    }

    let cards;
    if (due) {
      // Get cards due for review
      cards = await prisma.card.findMany({
        where: {
          deckId: id,
          nextReview: {
            lte: new Date(),
          },
        },
        orderBy: { nextReview: 'asc' },
      });
    } else {
      // Get all cards
      cards = await prisma.card.findMany({
        where: { deckId: id },
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Get cards error:', error);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const cardData = cardSchema.parse(body);

    // Verify deck belongs to user
    const deck = await prisma.deck.findFirst({
      where: { 
        id,
        userId: user.id,
      },
    });

    if (!deck) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
    }

    const card = await prisma.card.create({
      data: {
        ...cardData,
        deckId: id,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: err.issues },
        { status: 400 }
      );
    }
    
    console.error('Create card error:', err);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}



