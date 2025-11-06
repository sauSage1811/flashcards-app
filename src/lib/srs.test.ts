import { calculateSRS } from './srs';

describe('Spaced Repetition System (SRS) Calculator', () => {
  it('should reset card if grade is below 3 (e.g., grade 1)', () => {
    const card = { interval: 10, repetitions: 3, easiness: 2.5 };
    const result = calculateSRS(1, card);
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
    expect(result.easiness).toBeLessThan(2.5);
  });

  it('should correctly calculate the next interval for a good grade (4)', () => {
    const card = { interval: 6, repetitions: 2, easiness: 2.5 };
    const result = calculateSRS(4, card);
    expect(result.repetitions).toBe(3);
    // newInterval = ceil(6 * 2.5) = 15
    expect(result.interval).toBe(15);
    // easiness should not change for grade 4
    expect(result.easiness).toBe(2.5);
  });

  it('should increase easiness for a perfect grade (5)', () => {
    const card = { interval: 1, repetitions: 1, easiness: 2.5 };
    const result = calculateSRS(5, card);
    expect(result.easiness).toBeGreaterThan(2.5);
    expect(result.repetitions).toBe(2);
    expect(result.interval).toBe(6); // Second interval is always 6
  });
});



