import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: 'BUY_NOW' | 'WAIT' | 'NEUTRAL';
  reasoning: string;
}

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, reasoning }) => {
  const configs = {
    BUY_NOW: {
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <TrendingDown className="w-5 h-5" />,
      label: 'Great Price - Buy Now',
    },
    WAIT: {
      color: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Price is High - Wait',
    },
    NEUTRAL: {
      color: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: <Minus className="w-5 h-5" />,
      label: 'Fair Price',
    },
  };

  const config = configs[verdict] || configs.NEUTRAL;

  return (
    <div className={`p-6 rounded-2xl border ${config.color} mb-6`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-full bg-white/50`}>
            {config.icon}
        </div>
        <h3 className="text-xl font-bold">{config.label}</h3>
      </div>
      <p className="text-sm opacity-90 leading-relaxed font-medium">
        {reasoning}
      </p>
    </div>
  );
};

export default VerdictBadge;
