import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cardSchema } from '@/lib/validators';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const cardData = cardSchema.parse(body);

    // Verify card belongs to user's deck
    const card = await prisma.card.findFirst({
      where: {
        id: params.id,
        deck: {
          userId: user.id,
        },
      },
    });

    if (!card) {
      return NextResponse.json({ message: 'Card not found' }, { status: 404 });
    }

    const updatedCard = await prisma.card.update({
      where: { id: params.id },
      data: cardData,
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Invalid input data', errors: (error as any).errors },
        { status: 400 }
      );
    }
    
    console.error('Update card error:', error);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify card belongs to user's deck
    const card = await prisma.card.findFirst({
      where: {
        id: params.id,
        deck: {
          userId: user.id,
        },
      },
    });

    if (!card) {
      return NextResponse.json({ message: 'Card not found' }, { status: 404 });
    }

    await prisma.card.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Delete card error:', error);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}



