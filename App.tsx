import React, { useState, useCallback } from 'react';
import Hero from './components/Hero';
import ResultsDashboard from './components/ResultsDashboard';
import { AppState } from './types';
import { searchProductPrices, analyzePriceTrends } from './services/geminiService';

function App() {
  const [appState, setAppState] = useState<AppState>({
    status: 'IDLE',
    query: '',
    searchResult: null,
    trendAnalysis: null,
    error: null,
  });

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;

    // Reset state for new search
    setAppState(prev => ({ 
      ...prev, 
      status: 'SEARCHING', 
      query, 
      error: null,
      searchResult: null,
      trendAnalysis: null
    }));

    try {
      // Step 1: Search for real prices
      const searchResult = await searchProductPrices(query);
      
      setAppState(prev => ({
        ...prev,
        status: 'ANALYZING',
        searchResult
      }));

      // Step 2: Analyze trends based on the product name and context
      // We pass the search result text as context so the analysis knows the current price point
      const trendAnalysis = await analyzePriceTrends(query, searchResult.text);

      setAppState(prev => ({
        ...prev,
        status: 'COMPLETE',
        trendAnalysis
      }));

    } catch (error: any) {
      console.error(error);
      setAppState(prev => ({
        ...prev,
        status: 'ERROR',
        error: error.message || "An unexpected error occurred."
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero onSearch={handleSearch} isSearching={appState.status === 'SEARCHING' || appState.status === 'ANALYZING'} />
      <ResultsDashboard state={appState} />
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>SmartPrice AI &copy; {new Date().getFullYear()}</p>
        <p className="mt-2 text-xs">
          Prices are estimates based on AI search results. Always verify on retailer sites.
        </p>
      </footer>
    </div>
  );
}

export default App;
