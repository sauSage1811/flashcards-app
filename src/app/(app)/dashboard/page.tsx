'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, BookOpen, Brain, TrendingUp } from 'lucide-react';

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

export default function DashboardPage() {
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: fetchDecks,
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading decks. Please try again.</p>
      </div>
    );
  }

  const totalCards = decks?.reduce((sum, deck) => sum + deck._count.cards, 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500 mt-2">Welcome back! Here&#39;s your learning overview.</p>
        </div>
        <Link
          href="/decks/new"
          className="btn btn-primary btn-md btn-animate flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          <span>New Deck</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 card-hover">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <BookOpen className="w-6 h-6 text-primary transition-transform duration-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 transition-all duration-300">{decks?.length || 0}</p>
              <p className="text-neutral-500">Total Decks</p>
            </div>
          </div>
        </div>

        <div className="card p-6 card-hover">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <Brain className="w-6 h-6 text-green-600 transition-transform duration-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 transition-all duration-300">{totalCards}</p>
              <p className="text-neutral-500">Total Cards</p>
            </div>
          </div>
        </div>

        <div className="card p-6 card-hover">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <TrendingUp className="w-6 h-6 text-blue-600 transition-transform duration-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 transition-all duration-300">0</p>
              <p className="text-neutral-500">Cards Due Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Decks */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Recent Decks</h2>
          <Link href="/decks" className="text-primary hover:underline text-sm">
            View All
          </Link>
        </div>

        {!decks || decks.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No decks yet</h3>
            <p className="text-neutral-500 mb-6">Create your first deck to start learning with flashcards.</p>
            <Link
              href="/decks/new"
              className="btn btn-primary btn-md"
            >
              Create Your First Deck
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.slice(0, 6).map((deck, index) => (
              <Link
                key={deck.id}
                href={`/decks/${deck.id}`}
                className="card p-6 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-semibold text-neutral-900 mb-2 transition-colors duration-300">{deck.title}</h3>
                {deck.description && (
                  <p className="text-neutral-500 text-sm mb-4 transition-colors duration-300">{deck.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span className="transition-colors duration-300">{deck._count.cards} cards</span>
                  <span className="transition-colors duration-300">{new Date(deck.updatedAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
