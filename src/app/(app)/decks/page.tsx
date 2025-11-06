'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Deck {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    cards: number;
  };
}

const fetchDecks = async (): Promise<Deck[]> => {
  const response = await fetch('/api/decks');
  if (!response.ok) throw new Error('Failed to fetch decks');
  return response.json();
};

const deleteDeck = async (deckId: string) => {
  const response = await fetch(`/api/decks/${deckId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete deck');
  return response.json();
};

export default function DecksPage() {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: fetchDecks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      toast.success('Deck deleted successfully');
      setDeleteConfirm(null);
    },
    onError: () => {
      toast.error('Failed to delete deck');
    },
  });

  const handleDelete = (deckId: string) => {
    deleteMutation.mutate(deckId);
  };

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading decks. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Decks</h1>
          <p className="text-neutral-500 mt-2">Manage your flashcard collections</p>
        </div>
        <Link
          href="/decks/new"
          className="btn btn-primary btn-md btn-animate flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          <span>New Deck</span>
        </Link>
      </div>

      {!decks || decks.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No decks yet</h3>
          <p className="text-neutral-500 mb-6">Create your first deck to start organizing your flashcards.</p>
          <Link
            href="/decks/new"
            className="btn btn-primary btn-md"
          >
            Create Your First Deck
          </Link>
        </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck, index) => (
            <div 
              key={deck.id} 
              className="card p-6 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-2 transition-colors duration-300">{deck.title}</h3>
                  {deck.description && (
                    <p className="text-neutral-500 text-sm transition-colors duration-300">{deck.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    href={`/decks/${deck.id}/edit`}
                    className="p-2 text-neutral-400 hover:text-neutral-600 transition-all duration-300 hover:scale-110"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(deck.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-all duration-300 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                <span className="transition-colors duration-300">{deck._count.cards} cards</span>
                <span className="transition-colors duration-300">{new Date(deck.updatedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/decks/${deck.id}`}
                  className="btn btn-outline btn-sm btn-animate flex-1 text-center"
                >
                  View Cards
                </Link>
                <Link
                  href={`/study?deck=${deck.id}`}
                  className="btn btn-primary btn-sm btn-animate flex-1 text-center"
                >
                  Study
                </Link>
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
              Delete Deck
            </h3>
            <p className="text-neutral-500 mb-6">
              Are you sure you want to delete this deck? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-outline btn-sm btn-animate flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="btn bg-red-500 text-white hover:bg-red-600 btn-sm btn-animate flex-1"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



