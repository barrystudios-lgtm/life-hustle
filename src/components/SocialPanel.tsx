import React, { useState } from 'react';
import { NPC, PlayerStats } from '../types/game';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Coffee, 
  Gift, 
  Sparkles, 
  Award,
  Flame,
  PartyPopper
} from 'lucide-react';

interface Props {
  relationships: NPC[];
  stats: PlayerStats;
  cash: number;
  onInteract: (npcId: string, actionType: 'chat' | 'coffee' | 'date' | 'gift' | 'flirt' | 'propose') => void;
}

export const SocialPanel: React.FC<Props> = ({
  relationships,
  stats,
  cash,
  onInteract,
}) => {
  const [activeNpcId, setActiveNpcId] = useState<string>(relationships[0]?.id || '');
  const activeNpc = relationships.find((n) => n.id === activeNpcId) || relationships[0];

  const getStatusColor = (status: NPC['status']) => {
    switch (status) {
      case 'Spouse':
        return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
      case 'Dating':
        return 'text-pink-400 bg-pink-500/20 border-pink-500/30';
      case 'Crush':
        return 'text-fuchsia-400 bg-fuchsia-500/20 border-fuchsia-500/30';
      case 'Best Friend':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'Friend':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-semibold px-2 py-0.5 rounded bg-pink-950/80 border border-pink-800/40">
              City Social Network & Romance
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Metropolis Contacts & Romances
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Form connections, build influence, date city archetypes, or propose to the love of your life in the city that never sleeps.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Street Clout:</span>
            <span className="text-lg font-mono font-bold text-amber-400 flex items-center gap-1">
              ⭐ {stats.streetCred} Cred
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Contact List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Your Contacts ({relationships.length})
          </div>

          {relationships.map((npc) => {
            const isSelected = activeNpcId === npc.id;

            return (
              <div
                key={npc.id}
                onClick={() => {
                  sound.playClick();
                  setActiveNpcId(npc.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-slate-800 border-pink-500/80 shadow-lg ring-1 ring-pink-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-inner">
                  {npc.gender === 'female' ? '👩' : '👨'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="font-bold text-sm text-white truncate">
                      {npc.name}
                    </h5>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getStatusColor(npc.status)}`}>
                      {npc.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {npc.role}
                  </div>

                  {/* Relationship Bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all"
                        style={{ width: `${Math.max(5, Math.min(100, npc.relationship))}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-pink-400 font-bold">
                      {npc.relationship}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: NPC Profile & Actions */}
        {activeNpc && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600/30 via-indigo-600/20 to-slate-900 border border-pink-500/30 flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {activeNpc.gender === 'female' ? '👩' : '👨'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-black text-white">
                        {activeNpc.name}
                      </h4>
                      <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border font-bold ${getStatusColor(activeNpc.status)}`}>
                        {activeNpc.status}
                      </span>
                    </div>
                    <div className="text-xs text-amber-400 font-semibold mt-0.5">
                      {activeNpc.role} • 📍 {activeNpc.district}
                    </div>
                    <p className="text-xs text-slate-300 mt-2 max-w-lg leading-relaxed">
                      {activeNpc.bio}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Affection Meter</span>
                  <div className="text-2xl font-black font-mono text-pink-400 flex items-center justify-end gap-1">
                    <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                    {activeNpc.relationship}/100
                  </div>
                </div>
              </div>

              {/* Dialogue Quote Bubble */}
              <div className="my-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <span className="text-lg">💬</span>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {activeNpc.name} says:
                  </div>
                  <div className="text-xs italic text-slate-200 mt-0.5">
                    {activeNpc.dialoguePool[Math.floor(Math.random() * activeNpc.dialoguePool.length)]}
                  </div>
                </div>
              </div>

              {/* Interaction Buttons Grid */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Social & Romantic Interactions
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Chat */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      onInteract(activeNpc.id, 'chat');
                    }}
                    disabled={stats.energy < 5}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all cursor-pointer flex items-center justify-between disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                        <MessageSquare className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-bold text-xs text-white">Chat & Catch Up</div>
                        <div className="text-[10px] text-slate-400">-5 Energy • Free</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+5 Rel</span>
                  </button>

                  {/* Coffee */}
                  <button
                    onClick={() => {
                      if (cash >= 15 && stats.energy >= 10) {
                        sound.playCash();
                        onInteract(activeNpc.id, 'coffee');
                      } else {
                        sound.playError();
                      }
                    }}
                    disabled={cash < 15 || stats.energy < 10}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all cursor-pointer flex items-center justify-between disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <Coffee className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-bold text-xs text-white">Grab Artisan Coffee</div>
                        <div className="text-[10px] text-slate-400">$15 • -10 Energy</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+12 Rel</span>
                  </button>

                  {/* Romantic Dinner */}
                  <button
                    onClick={() => {
                      if (cash >= 120 && stats.energy >= 15) {
                        sound.playCash();
                        onInteract(activeNpc.id, 'date');
                      } else {
                        sound.playError();
                      }
                    }}
                    disabled={cash < 120 || stats.energy < 15}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all cursor-pointer flex items-center justify-between disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                        <Heart className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-bold text-xs text-white">Rooftop Dinner Date</div>
                        <div className="text-[10px] text-slate-400">$120 • -15 Energy</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+25 Rel</span>
                  </button>

                  {/* Luxury Gift */}
                  <button
                    onClick={() => {
                      if (cash >= 350) {
                        sound.playCash();
                        onInteract(activeNpc.id, 'gift');
                      } else {
                        sound.playError();
                      }
                    }}
                    disabled={cash < 350}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all cursor-pointer flex items-center justify-between disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                        <Gift className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-bold text-xs text-white">Give Luxury Gift</div>
                        <div className="text-[10px] text-slate-400">$350 • Designer Watch</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+35 Rel</span>
                  </button>
                </div>

                {/* Flirt & Propose Big Actions */}
                <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onInteract(activeNpc.id, 'flirt');
                    }}
                    disabled={stats.energy < 15}
                    className="py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Flirt & Confess Romance</span>
                  </button>

                  <button
                    onClick={() => {
                      if (cash >= 5000 && activeNpc.relationship >= 80) {
                        sound.playLevelUp();
                        confetti({ particleCount: 120, spread: 80 });
                        onInteract(activeNpc.id, 'propose');
                      } else {
                        sound.playError();
                      }
                    }}
                    disabled={cash < 5000 || activeNpc.relationship < 80}
                    className="py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Propose Marriage ($5,000 Ring)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
