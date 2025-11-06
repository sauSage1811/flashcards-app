// app/api/study/review/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { reviewSchema } from '@/lib/validators';
import { calculateSRS, getNextReviewDate } from '@/lib/srs';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cardId, grade } = reviewSchema.parse(body);

    // Get the card and verify ownership
    const card = await prisma.card.findFirst({
      where: { 
        id: cardId,
        deck: { userId: user.id },
      },
    });

    if (!card) {
      return NextResponse.json({ message: 'Card not found' }, { status: 404 });
    }

    // Calculate new SRS values
    const newSRSData = calculateSRS(grade, {
      interval: card.interval,
      repetitions: card.repetitions,
      easiness: card.easiness,
    });

    const nextReview = getNextReviewDate(newSRSData.interval);

    // Update the card with new SRS data
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        easiness: newSRSData.easiness,
        interval: newSRSData.interval,
        repetitions: newSRSData.repetitions,
        nextReview,
      },
    });

    // Create review log
    await prisma.reviewLog.create({
      data: {
        cardId,
        userId: user.id,
        grade,
      },
    });

    return NextResponse.json({
      message: 'Review submitted successfully',
      card: updatedCard,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Submit review error:', error);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}



