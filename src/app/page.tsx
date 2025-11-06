import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">
            Master Anything with
            <span className="text-primary"> Spaced Repetition</span>
          </h1>
          <p className="text-xl text-neutral-500 mb-8 max-w-2xl mx-auto">
            Create flashcards, study smarter, and retain knowledge longer with our scientifically-proven spaced repetition algorithm.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/login"
              className="btn btn-primary btn-lg btn-animate"
            >
              Get Started
            </Link>
            <Link
              href="/auth/register"
              className="btn btn-outline btn-lg btn-animate"
            >
              Sign Up
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 text-center card-hover">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
              <span className="text-primary text-2xl transition-transform duration-300">📚</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 transition-colors duration-300">Create Decks</h3>
            <p className="text-neutral-500 transition-colors duration-300">
              Organize your flashcards into custom decks for different subjects or topics.
            </p>
          </div>
          
          <div className="card p-6 text-center card-hover">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
              <span className="text-primary text-2xl transition-transform duration-300">🧠</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 transition-colors duration-300">Smart Learning</h3>
            <p className="text-neutral-500 transition-colors duration-300">
              Our algorithm schedules reviews at optimal intervals for maximum retention.
            </p>
          </div>
          
          <div className="card p-6 text-center card-hover">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
              <span className="text-primary text-2xl transition-transform duration-300">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 transition-colors duration-300">Track Progress</h3>
            <p className="text-neutral-500 transition-colors duration-300">
              Monitor your learning progress with detailed statistics and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}