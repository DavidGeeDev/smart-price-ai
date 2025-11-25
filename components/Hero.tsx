import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, isSearching }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 pb-16 pt-20 sm:pb-24 lg:pb-32">
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Find the <span className="text-emerald-400">Perfect Price</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            SmartPrice AI scours the web for real-time deals and analyzes price history to tell you exactly when to buy.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto relative">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste a product name (e.g., Sony WH-1000XM5)..."
                  className="block w-full rounded-lg border-0 bg-slate-800 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 shadow-2xl"
                  disabled={isSearching}
                />
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSearching ? (
                    <span className="animate-pulse">Searching...</span>
                  ) : (
                    <>
                      <span>Find Deals</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 flex justify-center gap-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Real-time Search</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Trend Analysis</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Buy/Wait Verdict</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
