// API Response Types

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface SearchResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface TrendAnalysis {
  productName: string;
  averagePrice: number;
  targetPrice: number;
  currentEstimatedPrice: number;
  verdict: 'BUY_NOW' | 'WAIT' | 'NEUTRAL';
  reasoning: string;
  history: PricePoint[];
}

export interface AppState {
  status: 'IDLE' | 'SEARCHING' | 'ANALYZING' | 'COMPLETE' | 'ERROR';
  query: string;
  searchResult: SearchResult | null;
  trendAnalysis: TrendAnalysis | null;
  error: string | null;
}
