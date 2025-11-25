import React from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { GroundingChunk } from '../types';

interface SourceListProps {
  chunks: GroundingChunk[];
}

const SourceList: React.FC<SourceListProps> = ({ chunks }) => {
  // Filter out chunks that don't have web URIs and remove duplicates by URI
  const uniqueLinks = new Map();
  
  chunks.forEach(chunk => {
    if (chunk.web?.uri && chunk.web?.title) {
        if (!uniqueLinks.has(chunk.web.uri)) {
            uniqueLinks.set(chunk.web.uri, chunk.web);
        }
    }
  });

  const sources = Array.from(uniqueLinks.values());

  if (sources.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        <ShoppingBag className="w-4 h-4 text-slate-500" />
        <h3 className="font-semibold text-slate-700">Found Retailers & Sources</h3>
      </div>
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
        <ul className="divide-y divide-slate-100">
          {sources.map((source, idx) => (
            <li key={idx} className="group">
              <a 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {source.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-mono">
                      {new URL(source.uri || '').hostname.replace('www.', '')}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400 shrink-0 mt-0.5" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SourceList;
