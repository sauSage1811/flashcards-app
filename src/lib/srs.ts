// lib/srs.ts

export interface CardSRSData {
  interval: number;
  repetitions: number;
  easiness: number;
}

export function calculateSRS(grade: number, card: CardSRSData): CardSRSData {
  if (grade < 3) {
    // Failed recall: reset repetitions and interval
    return {
      ...card,
      repetitions: 0,
      interval: 1,
    };
  }

  // Calculate new easiness factor
  const newEasiness = Math.max(
    1.3,
    card.easiness + 0.1 - (5.0 - grade) * (0.08 + (5.0 - grade) * 0.02)
  );

  let newInterval: number;
  const newRepetitions = card.repetitions + 1;

  if (newRepetitions === 1) {
    newInterval = 1;
  } else if (newRepetitions === 2) {
    newInterval = 6;
  } else {
    newInterval = Math.ceil(card.interval * newEasiness);
  }

  return {
    easiness: newEasiness,
    interval: newInterval,
    repetitions: newRepetitions,
  };
}

export function getNextReviewDate(interval: number): Date {
  const now = new Date();
  now.setDate(now.getDate() + interval);
  return now;
}



