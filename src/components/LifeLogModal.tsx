import React from 'react';
import { GameState, LogEntry } from '../types/game';
import { sound } from '../utils/sound';
import { X, BookOpen, Calendar, Award, Trophy, Sparkles } from 'lucide-react';

interface Props {
  gameState: GameState;
  onClose: () => void;
}

export const LifeLogModal: React.FC<Props> = ({ gameState, onClose }) => {
  const { player, logs } = gameState;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                Chronicle & Achievements
              </span>
              <h3 className="text-xl font-black text-white">
                {player.name}'s Life Story
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legacy Snapshot */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Age / Year</span>
            <span className="font-bold text-white text-sm">{player.age} yrs • {player.year}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Net Worth</span>
            <span className="font-bold text-emerald-400 text-sm">${player.netWorth.toLocaleString()}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Credit Score</span>
            <span className="font-bold text-amber-400 text-sm">💳 {player.stats.creditScore}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Clout Status</span>
            <span className="font-bold text-cyan-400 text-sm">⭐ {player.stats.streetCred}</span>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Chronological Timeline
          </div>

          <div className="relative border-l border-slate-800 ml-3 space-y-4 py-2">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-900" />
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="font-bold text-amber-400">Year {log.year} • Week {log.week}</span>
                  <span>•</span>
                  <span className="capitalize">{log.type}</span>
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {log.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
