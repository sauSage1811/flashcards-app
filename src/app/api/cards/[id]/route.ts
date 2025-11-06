import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cardSchema } from '@/lib/validators';
import { ZodError } from 'zod';

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
    const cardData = cardSchema.parse(body);

    // Verify card belongs to user's deck
    const card = await prisma.card.findFirst({
      where: {
        id,
        deck: {
          userId: user.id,
        },
      },
    });

    if (!card) {
      return NextResponse.json({ message: 'Card not found' }, { status: 404 });
    }

    const updatedCard = await prisma.card.update({
      where: { id },
      data: cardData,
    });

    return NextResponse.json(updatedCard);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: err.issues },
        { status: 400 }
      );
    }
    
    console.error('Update card error:', err);
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

    // Verify card belongs to user's deck
    const card = await prisma.card.findFirst({
      where: {
        id,
        deck: {
          userId: user.id,
        },
      },
    });

    if (!card) {
      return NextResponse.json({ message: 'Card not found' }, { status: 404 });
    }

    await prisma.card.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (err) {
    console.error('Delete card error:', err);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}



