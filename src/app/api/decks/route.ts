// app/api/decks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { deckSchema } from '@/lib/validators';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decks = await prisma.deck.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { cards: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(decks);
  } catch (error) {
    console.error('Get decks error:', error);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description } = deckSchema.parse(body);

    const deck = await prisma.deck.create({
      data: {
        title,
        description,
        userId: user.id,
      },
      include: {
        _count: {
          select: { cards: true },
        },
      },
    });

    return NextResponse.json(deck, { status: 201 });
 } catch (error) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "Invalid input data", errors: error.issues },
      { status: 400 }
    );
  }

  console.error("Create deck error:", error);
  return NextResponse.json(
    { message: "An internal error occurred" },
    { status: 500 }
  );
}

}




