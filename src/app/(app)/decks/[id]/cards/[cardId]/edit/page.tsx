'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cardSchema, type CardInput } from '@/lib/validators';
import { toast } from 'sonner';

export default function EditCardPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;
  const cardId = params.cardId as string;
  const [isLoading, setIsLoading] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CardInput>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      tags: [],
      partOfSpeech: 'OTHER',
    },
  });

  useEffect(() => {
    async function fetchCard() {
      try {
        const response = await fetch(`/api/decks/${deckId}/cards`);
        if (response.ok) {
          const cards = await response.json();
          const currentCard = cards.find((c: any) => c.id === cardId);
          if (currentCard) {
            setCard(currentCard);
            setTags(currentCard.tags || []);
            reset({
              term: currentCard.term,
              definition: currentCard.definition,
              partOfSpeech: currentCard.partOfSpeech,
              phonetics: currentCard.phonetics || '',
              exampleSentence: currentCard.exampleSentence || '',
            });
          } else {
            toast.error('Card not found');
            router.push(`/decks/${deckId}`);
          }
        } else {
          toast.error('Failed to load card');
          router.push(`/decks/${deckId}`);
        }
      } catch (error) {
        toast.error('Error loading card');
        router.push(`/decks/${deckId}`);
      }
    }

    if (deckId && cardId) {
      fetchCard();
    }
  }, [deckId, cardId, reset, router]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  const onSubmit = async (data: CardInput) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, tags }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Card updated successfully!');
        router.push(`/decks/${deckId}`);
      } else {
        toast.error(result.message || 'Failed to update card');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!card) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-500">Loading card...</p>
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
        <h1 className="text-3xl font-bold text-neutral-900">Edit Card</h1>
        <p className="text-neutral-500 mt-2">
          Update your flashcard
        </p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-neutral-700 mb-2">
              Term *
            </label>
            <input
              {...register('term')}
              type="text"
              id="term"
              className="input w-full input-focus"
              placeholder="e.g., hello"
            />
            {errors.term && (
              <p className="text-red-500 text-sm mt-1">{errors.term.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="definition" className="block text-sm font-medium text-neutral-700 mb-2">
              Definition *
            </label>
            <input
              {...register('definition')}
              type="text"
              id="definition"
              className="input w-full input-focus"
              placeholder="e.g., a greeting used when meeting someone"
            />
            {errors.definition && (
              <p className="text-red-500 text-sm mt-1">{errors.definition.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phonetics" className="block text-sm font-medium text-neutral-700 mb-2">
              Phonetics
            </label>
            <input
              {...register('phonetics')}
              type="text"
              id="phonetics"
              className="input w-full input-focus"
              placeholder="e.g., /həˈloʊ/"
            />
            {errors.phonetics && (
              <p className="text-red-500 text-sm mt-1">{errors.phonetics.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="exampleSentence" className="block text-sm font-medium text-neutral-700 mb-2">
              Example Sentence
            </label>
            <textarea
              {...register('exampleSentence')}
              id="exampleSentence"
              rows={3}
              className="input w-full resize-none input-focus"
              placeholder="e.g., Hello, how are you today?"
            />
            {errors.exampleSentence && (
              <p className="text-red-500 text-sm mt-1">{errors.exampleSentence.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="partOfSpeech" className="block text-sm font-medium text-neutral-700 mb-2">
              Part of Speech
            </label>
            <select
              {...register('partOfSpeech')}
              id="partOfSpeech"
              className="input w-full input-focus"
            >
              <option value="OTHER">Other</option>
              <option value="NOUN">Noun</option>
              <option value="VERB">Verb</option>
              <option value="ADJECTIVE">Adjective</option>
              <option value="ADVERB">Adverb</option>
              <option value="PRONOUN">Pronoun</option>
              <option value="PREPOSITION">Preposition</option>
              <option value="CONJUNCTION">Conjunction</option>
              <option value="INTERJECTION">Interjection</option>
            </select>
            {errors.partOfSpeech && (
              <p className="text-red-500 text-sm mt-1">{errors.partOfSpeech.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input flex-1 input-focus"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="btn btn-outline btn-md btn-animate"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full transition-all duration-300 hover:bg-primary-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-500 hover:text-primary-700 transition-colors duration-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
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
              {isLoading ? 'Updating...' : 'Update Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

