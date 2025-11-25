import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AppState } from '../types';
import PriceChart from './PriceChart';
import VerdictBadge from './VerdictBadge';
import SourceList from './SourceList';
import { Tag, BarChart3, Info } from 'lucide-react';

interface ResultsDashboardProps {
  state: AppState;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ state }) => {
  if (state.status === 'IDLE') return null;

  if (state.status === 'SEARCHING' || state.status === 'ANALYZING') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-block p-4 rounded-full bg-slate-100 mb-4 animate-bounce">
            {state.status === 'SEARCHING' ? <Tag className="w-8 h-8 text-emerald-500" /> : <BarChart3 className="w-8 h-8 text-blue-500" />}
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 animate-pulse">
            {state.status === 'SEARCHING' ? 'Scouring the web for prices...' : 'Analyzing price trends...'}
        </h2>
        <p className="text-slate-500 mt-2">This usually takes a few seconds.</p>
      </div>
    );
  }

  if (state.status === 'ERROR') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <p className="font-semibold">Oops! Something went wrong.</p>
          <p className="text-sm mt-1 opacity-80">{state.error || "Please try searching for a different product."}</p>
        </div>
      </div>
    );
  }

  const { searchResult, trendAnalysis } = state;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Verdict & Chart (Analysis) */}
        <div className="lg:col-span-2 space-y-6">
          
          {trendAnalysis && (
            <>
               <div className="flex items-baseline justify-between">
                <h2 className="text-3xl font-bold text-slate-900">{trendAnalysis.productName}</h2>
                <span className="text-2xl font-bold text-emerald-600">
                    ~${trendAnalysis.currentEstimatedPrice}
                </span>
               </div>

               <VerdictBadge 
                 verdict={trendAnalysis.verdict} 
                 reasoning={trendAnalysis.reasoning} 
               />

               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Avg Price (6mo)</p>
                    <p className="text-2xl font-bold text-slate-700 mt-1">${trendAnalysis.averagePrice}</p>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Target Price</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">${trendAnalysis.targetPrice}</p>
                 </div>
               </div>

               <PriceChart 
                 data={trendAnalysis.history} 
                 averagePrice={trendAnalysis.averagePrice} 
                 targetPrice={trendAnalysis.targetPrice} 
               />
            </>
          )}

          {/* Fallback if analysis fails but search worked */}
          {!trendAnalysis && searchResult && (
             <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                Could not generate trend analysis, but here are the search results below.
             </div>
          )}

        </div>

        {/* Right Column: Search Results & Sources */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                AI Summary
            </h3>
            <div className="prose prose-sm prose-slate text-slate-600">
                {/* Search result text is usually markdown-like */}
                <ReactMarkdown>
                    {searchResult?.text || ''}
                </ReactMarkdown>
            </div>
          </div>

          {searchResult && <SourceList chunks={searchResult.groundingChunks} />}
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard;
