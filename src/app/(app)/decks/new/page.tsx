'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deckSchema, type DeckInput } from '@/lib/validators';
import { toast } from 'sonner';

export default function NewDeckPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeckInput>({
    resolver: zodResolver(deckSchema),
  });

  const onSubmit = async (data: DeckInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Deck created successfully!');
        router.push(`/decks/${result.id}`);
      } else {
        toast.error(result.message || 'Failed to create deck');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="btn btn-outline btn-sm mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-neutral-900">Create New Deck</h1>
        <p className="text-neutral-500 mt-2">
          Create a new collection of flashcards
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
              className="input w-full"
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
              className="input w-full resize-none"
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
              className="btn btn-outline btn-md flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-md flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



