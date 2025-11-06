'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Card {
  id: string;
  term: string;
  definition: string;
  partOfSpeech: string;
  phonetics: string | null;
  exampleSentence: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Deck {
  id: string;
  title: string;
  description: string | null;
  cards: Card[];
  _count: {
    cards: number;
  };
}

const fetchDeck = async (deckId: string): Promise<Deck> => {
  const response = await fetch(`/api/decks/${deckId}`);
  if (!response.ok) throw new Error('Failed to fetch deck');
  return response.json();
};

const deleteCard = async (cardId: string) => {
  const response = await fetch(`/api/cards/${cardId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete card');
  return response.json();
};

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: deck, isLoading, error } = useQuery({
    queryKey: ['deck', deckId],
    queryFn: () => fetchDeck(deckId),
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deck', deckId] });
      toast.success('Card deleted successfully');
      setDeleteConfirm(null);
    },
    onError: () => {
      toast.error('Failed to delete card');
    },
  });

  const handleDeleteCard = (cardId: string) => {
    deleteCardMutation.mutate(cardId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-500">Loading deck...</p>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading deck. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="btn btn-outline btn-sm mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-neutral-900">{deck.title}</h1>
          {deck.description && (
            <p className="text-neutral-500 mt-2">{deck.description}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/decks/${deckId}/edit`}
            className="btn btn-outline btn-md btn-animate flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Deck</span>
          </Link>
          <Link
            href={`/study?deck=${deckId}`}
            className="btn btn-primary btn-md btn-animate flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Study</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Cards ({deck.cards.length})</h2>
          <p className="text-neutral-500">Manage your flashcards</p>
        </div>
        <Link
          href={`/decks/${deckId}/cards/new`}
          className="btn btn-primary btn-md flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Card</span>
        </Link>
      </div>

      {deck.cards.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No cards yet</h3>
          <p className="text-neutral-500 mb-6">Add your first flashcard to this deck.</p>
          <Link
            href={`/decks/${deckId}/cards/new`}
            className="btn btn-primary btn-md"
          >
            Add Your First Card
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deck.cards.map((card) => (
            <div key={card.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-2">{card.term}</h3>
                  <p className="text-neutral-600 text-sm">{card.definition}</p>
                  {card.phonetics && (
                    <p className="text-neutral-500 text-xs mt-1">/{card.phonetics}/</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <Link
                    href={`/decks/${deckId}/cards/${card.id}/edit`}
                    className="p-2 text-neutral-400 hover:text-neutral-600 transition-all duration-300 hover:scale-110"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(card.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-all duration-300 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {card.exampleSentence && (
                <p className="text-neutral-500 text-sm italic mb-3">
                  "{card.exampleSentence}"
                </p>
              )}
              
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-neutral-400">
                {new Date(card.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className="bg-white rounded-lg p-6 max-w-md w-full modal-content">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Delete Card
            </h3>
            <p className="text-neutral-500 mb-6">
              Are you sure you want to delete this card? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-outline btn-sm btn-animate flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCard(deleteConfirm)}
                disabled={deleteCardMutation.isPending}
                className="btn bg-red-500 text-white hover:bg-red-600 btn-sm btn-animate flex-1"
              >
                {deleteCardMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



