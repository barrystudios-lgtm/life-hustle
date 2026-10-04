import React from 'react';
import { LocationVenue, VenueAction, PlayerStats } from '../types/game';
import { sound } from '../utils/sound';
import { X, ArrowRight, Zap, DollarSign, Sparkles } from 'lucide-react';

interface Props {
  venue: LocationVenue | null;
  playerCash: number;
  playerEnergy: number;
  onClose: () => void;
  onExecuteAction: (action: VenueAction, venue: LocationVenue) => void;
}

export const VenueModal: React.FC<Props> = ({
  venue,
  playerCash,
  playerEnergy,
  onClose,
  onExecuteAction,
}) => {
  if (!venue) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          boxShadow: `0 0 50px -10px ${venue.color}30`,
        }}
      >
        {/* Header Banner */}
        <div 
          className="relative p-6 text-white overflow-hidden flex items-start justify-between border-b border-white/10"
          style={{
            background: `linear-gradient(135deg, ${venue.color}40 0%, #0f172a 100%)`,
          }}
        >
          <div className="relative z-10 flex items-start gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/20 bg-slate-900/80 shrink-0"
            >
              {venue.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-white font-semibold">
                  {venue.district}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                  • {venue.category.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight mt-1 text-white">
                {venue.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {venue.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Available Activities & Opportunities
          </div>

          {venue.availableActions.map((action) => {
            const hasEnoughCash = !action.cost || playerCash >= action.cost;
            const hasEnoughEnergy = !action.energyCost || action.energyCost < 0 || playerEnergy >= action.energyCost;
            const canAfford = hasEnoughCash && hasEnoughEnergy;

            return (
              <div
                key={action.id}
                className={`p-4 rounded-2xl border transition-all ${
                  canAfford
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-amber-500/50'
                    : 'bg-slate-900/60 border-slate-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {action.label}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {action.effectDescription}
                    </p>

                    {/* Cost & Requirements Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] font-mono">
                      {action.cost !== undefined && action.cost > 0 && (
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
                          hasEnoughCash 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold'
                        }`}>
                          <DollarSign className="w-3 h-3" /> ${action.cost}
                        </span>
                      )}
                      {action.energyCost !== undefined && action.energyCost > 0 && (
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
                          hasEnoughEnergy 
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold'
                        }`}>
                          <Zap className="w-3 h-3" /> -{action.energyCost} Energy
                        </span>
                      )}
                      {action.energyCost !== undefined && action.energyCost < 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Zap className="w-3 h-3" /> +{Math.abs(action.energyCost)} Energy
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      if (action.cost && action.cost > 0) {
                        sound.playCash();
                      } else {
                        sound.playClick();
                      }
                      onExecuteAction(action, venue);
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{action.customHandler ? 'Open' : 'Do It'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between px-6 font-mono">
          <span>Your Cash: ${playerCash.toLocaleString()}</span>
          <span>Your Energy: {playerEnergy}%</span>
        </div>
      </div>
    </div>
  );
};
