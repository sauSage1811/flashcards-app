import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { deckSchema } from '@/lib/validators';
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

    const deck = await prisma.deck.findFirst({
      where: { 
        id,
        userId: user.id,
      },
      include: {
        cards: {
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { cards: true },
        },
      },
    });

    if (!deck) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
    }

    return NextResponse.json(deck);
  } catch (err) {
    console.error('Get deck error:', err);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { title, description } = deckSchema.parse(body);

    const deck = await prisma.deck.updateMany({
      where: { 
        id,
        userId: user.id,
      },
      data: { title, description },
    });

    if (deck.count === 0) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
    }

    const updatedDeck = await prisma.deck.findUnique({
      where: { id },
      include: {
        _count: {
          select: { cards: true },
        },
      },
    });

    return NextResponse.json(updatedDeck);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: err.issues },
        { status: 400 }
      );
    }
    
    console.error('Update deck error:', err);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const deck = await prisma.deck.deleteMany({
      where: { 
        id,
        userId: user.id,
      },
    });

    if (deck.count === 0) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deck deleted successfully' });
  } catch (err) {
    console.error('Delete deck error:', err);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}



