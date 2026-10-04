import React from 'react';
import { LifeDilemma } from '../types/game';
import { sound } from '../utils/sound';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  dilemma: LifeDilemma | null;
  onChoose: (optionIndex: number) => void;
}

export const DilemmaModal: React.FC<Props> = ({ dilemma, onChoose }) => {
  if (!dilemma) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-amber-600/30 via-slate-900 to-indigo-950/40 border-b border-amber-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertCircle className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Life Dilemma • {dilemma.category.toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">
            {dilemma.title}
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {dilemma.description}
          </p>
        </div>

        {/* Options */}
        <div className="p-5 space-y-3">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Choose your reaction:
          </div>

          {dilemma.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                onChoose(idx);
              }}
              className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-left transition-all cursor-pointer group flex items-start justify-between gap-3"
            >
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {option.text}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Outcome: {option.effectText}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
