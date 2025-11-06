'use client';

import { useQuery } from '@tanstack/react-query';
import { StudyView } from '@/components/flashcards/StudyView';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const fetchUserDecks = async () => {
  const response = await fetch('/api/decks');
  if (!response.ok) throw new Error('Failed to fetch decks');
  return response.json();
};

interface DeckSummary {
  id: string;
  title: string;
  description: string | null;
  _count: { cards: number };
}

export default function StudyPage() {
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const router = useRouter();

  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: fetchUserDecks,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-500">Loading your decks...</p>
        </div>
      </div>
    );
  }

  if (error || !decks || decks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="card p-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            No Decks Available
          </h2>
          <p className="text-neutral-500 mb-6">
            Create your first deck to start studying.
          </p>
          <button
            onClick={() => router.push('/decks/new')}
            className="btn btn-primary btn-md"
          >
            Create Deck
          </button>
        </div>
      </div>
    );
  }

  if (selectedDeckId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedDeckId(null)}
            className="btn btn-outline btn-sm mb-4"
          >
            ← Back to Deck Selection
          </button>
          <h1 className="text-2xl font-bold text-neutral-900">
            Study Session
          </h1>
          <p className="text-neutral-500">
            Study cards from your selected deck
          </p>
        </div>
        <StudyView deckId={selectedDeckId} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Study Mode</h1>
        <p className="text-neutral-500">
          Select a deck to start your study session
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck: DeckSummary) => (
          <div
            key={deck.id}
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedDeckId(deck.id)}
          >
            <h3 className="font-semibold text-neutral-900 mb-2">{deck.title}</h3>
            {deck.description && (
              <p className="text-neutral-500 text-sm mb-4">{deck.description}</p>
            )}
            <div className="flex items-center justify-between text-sm text-neutral-500">
              <span>{deck._count.cards} cards</span>
              <span className="text-primary font-medium">Start Studying →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



