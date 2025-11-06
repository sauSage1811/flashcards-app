'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deckSchema, type DeckInput } from '@/lib/validators';
import { toast } from 'sonner';

export default function EditDeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  interface DeckData {
    id: string;
    title: string;
    description: string | null;
  }
  const [deck, setDeck] = useState<DeckData | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeckInput>({
    resolver: zodResolver(deckSchema),
  });

  useEffect(() => {
    async function fetchDeck() {
      try {
        const response = await fetch(`/api/decks/${deckId}`);
        if (response.ok) {
          const deckData = await response.json();
          setDeck(deckData);
          reset({
            title: deckData.title,
            description: deckData.description || '',
          });
        } else {
          toast.error('Failed to load deck');
          router.push('/decks');
        }
      } catch {
        toast.error('Error loading deck');
        router.push('/decks');
      }
    }

    if (deckId) {
      fetchDeck();
    }
  }, [deckId, reset, router]);

  const onSubmit = async (data: DeckInput) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Deck updated successfully!');
        router.push(`/decks/${deckId}`);
      } else {
        toast.error(result.message || 'Failed to update deck');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!deck) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-500">Loading deck...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="btn btn-outline btn-sm btn-animate mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-neutral-900">Edit Deck</h1>
        <p className="text-neutral-500 mt-2">
          Update your flashcard collection
        </p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
              Deck Title *
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="input w-full input-focus"
              placeholder="e.g., Spanish Vocabulary"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="input w-full resize-none input-focus"
              placeholder="Optional description of what this deck covers..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline btn-md btn-animate flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-md btn-animate flex-1"
            >
              {isLoading ? 'Updating...' : 'Update Deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

