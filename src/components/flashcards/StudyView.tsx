'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Card } from '@prisma/client';
import { LuFlipVertical } from 'react-icons/lu';
import { toast } from 'sonner';

// --- API Fetcher ---
const fetchDueCards = async (deckId: string): Promise<Card[]> => {
  const res = await fetch(`/api/decks/${deckId}/cards?due=true`);
  if (!res.ok) throw new Error('Failed to fetch due cards.');
  return res.json();
};

const submitReview = async ({ cardId, grade }: { cardId: string; grade: number }) => {
  const res = await fetch(`/api/study/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, grade }),
  });
  if (!res.ok) throw new Error('Failed to submit review.');
  return res.json();
};

// --- Component ---
export function StudyView({ deckId }: { deckId: string }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const queryClient = useQueryClient();

  const { data: cards, isLoading, error } = useQuery<Card[]>({
    queryKey: ['dueCards', deckId],
    queryFn: () => fetchDueCards(deckId),
  });

  const reviewMutation = useMutation({
    mutationFn: submitReview,
    onMutate: async (newReview) => {
      // Optimistic update: remove the card from the list immediately
      await queryClient.cancelQueries({ queryKey: ['dueCards', deckId] });
      const previousCards = queryClient.getQueryData<Card[]>(['dueCards', deckId]);
      queryClient.setQueryData<Card[]>(
        ['dueCards', deckId],
        (old) => old?.filter((card) => card.id !== newReview.cardId) ?? []
      );
      return { previousCards };
    },
    onError: (err, newReview, context) => {
      // Rollback on error
      toast.error('Failed to save review. Please try again.');
      if (context?.previousCards) {
        queryClient.setQueryData(['dueCards', deckId], context.previousCards);
      }
    },
    onSettled: () => {
      // Invalidate queries to refetch stats/due counts elsewhere
      queryClient.invalidateQueries({ queryKey: ['deckStats', deckId] });
      queryClient.invalidateQueries({ queryKey: ['dueCards', deckId] });
    },
  });

  const currentCard = cards?.[0];

  const handleReview = (grade: number) => {
    if (!currentCard) return;
    setIsFlipped(false);
    toast.success(`Card graded!`);
    reviewMutation.mutate({ cardId: currentCard.id, grade });
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!currentCard) return;
        if (e.code === 'Space') {
            e.preventDefault();
            setIsFlipped(prev => !prev);
        }
        if (isFlipped && ['1', '2', '3', '4', '5'].includes(e.key)) {
            e.preventDefault();
            handleReview(parseInt(e.key));
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentCard]);

  if (isLoading) return <div>Loading cards...</div>;
  if (error) return <div>Error loading cards. Please try again later.</div>;
  if (!currentCard) return <div className="text-center p-8">🎉 You've finished all your reviews for today!</div>;

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={`w-full max-w-2xl h-80 perspective-1000`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of Card */}
          <div className="absolute w-full h-full backface-hidden bg-white shadow-lg rounded-lg flex flex-col justify-center items-center p-6 border border-neutral-200">
            <p className="text-neutral-500 text-sm">{currentCard.phonetics}</p>
            <h2 className="text-4xl font-bold text-neutral-900">{currentCard.term}</h2>
          </div>
          {/* Back of Card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-primary-100 shadow-lg rounded-lg flex flex-col justify-center items-center p-6 border border-primary-700">
            <h3 className="text-2xl font-semibold text-primary-700">{currentCard.definition}</h3>
            <p className="text-primary-700/80 mt-4 italic">"{currentCard.exampleSentence}"</p>
          </div>
        </div>
      </div>

      {!isFlipped ? (
        <button onClick={() => setIsFlipped(true)} className="flex items-center gap-2 px-4 py-2 text-primary-700">
            <LuFlipVertical /> Flip Card (Space)
        </button>
      ) : (
        <div className="flex justify-center gap-2">
            <button onClick={() => handleReview(1)} className="btn-grade">Again (1)</button>
            <button onClick={() => handleReview(3)} className="btn-grade">Hard (2)</button>
            <button onClick={() => handleReview(4)} className="btn-grade">Good (3)</button>
            <button onClick={() => handleReview(5)} className="btn-grade">Easy (4)</button>
        </div>
      )}
    </div>
  );
}



