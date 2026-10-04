import React, { useState } from 'react';
import { GameState } from '../types/game';
import { UserAccount } from '../types/account';
import { AvatarDisplay } from './AvatarDisplay';
import { sound } from '../utils/sound';
import { 
  Play, 
  RotateCcw, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  DollarSign, 
  Award, 
  Building2, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Trash2,
  Sun,
  User,
  CreditCard,
  Landmark,
  Coins
} from 'lucide-react';

interface Props {
  gameState: GameState;
  onContinue: () => void;
  onNewGame: () => void;
  onResetData: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  currentUser: UserAccount | null;
  onOpenAccountModal: () => void;
  onOpenTopUpModal: () => void;
  onOpenOwnerPayoutModal: () => void;
}

export const StartMenu: React.FC<Props> = ({
  gameState,
  onContinue,
  onNewGame,
  onResetData,
  onToggleSound,
  soundEnabled,
  currentUser,
  onOpenAccountModal,
  onOpenTopUpModal,
  onOpenOwnerPayoutModal,
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'guide'>('main');
  const { player } = gameState;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto flex flex-col items-center justify-between">
      {/* Background Animated Daytime Metropolis Horizon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sky gradient - Realistic Sunny Daytime */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50" />

        {/* Radiant Sun Flare */}
        <div className="absolute top-8 right-16 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-400 blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute top-16 right-24 w-32 h-32 rounded-full bg-white blur-md opacity-80 pointer-events-none" />

        {/* Drifting Clouds */}
        <div className="absolute top-12 left-10 w-48 h-12 bg-white/70 rounded-full blur-sm opacity-80 animate-[moveRight_35s_linear_infinite]" />
        <div className="absolute top-28 left-1/3 w-64 h-16 bg-white/60 rounded-full blur-md opacity-70 animate-[moveRight_45s_linear_infinite]" />

        {/* Distant Skyline Silhouette */}
        <div className="absolute bottom-32 left-0 right-0 h-72 opacity-25 flex items-end justify-around">
          <div className="w-16 h-64 bg-slate-700 rounded-t-sm" />
          <div className="w-24 h-80 bg-slate-800 rounded-t-sm" />
          <div className="w-20 h-56 bg-slate-700 rounded-t-sm" />
          <div className="w-32 h-96 bg-slate-900 rounded-t-sm relative">
            <div className="w-1 h-16 bg-slate-950 absolute -top-16 left-1/2 -translate-x-1/2" />
          </div>
          <div className="w-24 h-64 bg-slate-800 rounded-t-sm" />
          <div className="w-28 h-72 bg-slate-700 rounded-t-sm" />
          <div className="w-16 h-48 bg-slate-800 rounded-t-sm" />
        </div>

        {/* Foreground Skyline */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent flex items-end justify-between px-6 opacity-90">
          <div className="w-28 h-40 bg-slate-900/90 border-t-2 border-amber-400/40" />
          <div className="w-36 h-48 bg-slate-900/95 border-t-2 border-sky-400/40" />
          <div className="w-44 h-44 bg-slate-900/90 border-t-2 border-emerald-400/40" />
          <div className="w-32 h-46 bg-slate-900/95 border-t-2 border-amber-400/40" />
        </div>
      </div>

      {/* Top Brand & Account Bar */}
      <header className="relative z-10 w-full max-w-5xl px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-md">
            <span>🇺🇸</span> AMERICAN LIFE SIMULATOR
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Account Profile Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAccountModal();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors shadow-md cursor-pointer text-xs font-bold"
          >
            <User className="w-4 h-4 text-amber-400" />
            <span>{currentUser ? `@${currentUser.username}` : 'Create Account / Sign In'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors shadow-md cursor-pointer"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </header>

      {/* Main Start Menu Container */}
      <main className="relative z-10 w-full max-w-3xl px-4 py-3 flex flex-col items-center justify-center my-auto">
        {/* Title Logo Group */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-600 text-xs font-black tracking-widest uppercase mb-2 shadow-sm backdrop-blur-md">
            <Sun className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '12s' }} />
            METROPOLIS DAYTIME EDITION
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tight leading-none drop-shadow-sm font-sans">
            AMERICAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700">LIFE</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-2 tracking-wide max-w-md mx-auto">
            From city streets to luxury penthouses. Get a job, buy real estate, date, trade Wall Street, and top up in-game cash with Naira (₦) or Dollars ($).
          </p>
        </div>

        {/* Mode Selector Tabs */}
        {activeTab === 'main' && (
          <div className="w-full space-y-3.5 max-w-md">
            {/* Continue Character Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-3.5 pb-3 border-b border-slate-800">
                <AvatarDisplay avatar={player.avatar} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      ACTIVE CHARACTER
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Age {player.age}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white truncate mt-0.5">
                    {player.name}
                  </h3>
                  <div className="text-xs text-slate-300 font-medium truncate flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{player.originCity}</span>
                  </div>
                </div>
              </div>

              {/* Financial & Job Snapshot */}
              <div className="grid grid-cols-3 gap-2 py-2.5 border-b border-slate-800 text-center font-mono text-xs">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase block">Net Worth</span>
                  <span className="font-bold text-emerald-400">{formatMoney(player.netWorth)}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase block">Credit Score</span>
                  <span className="font-bold text-amber-400">💳 {player.stats.creditScore}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase block">Street Cred</span>
                  <span className="font-bold text-cyan-400">⭐ {player.stats.streetCred}</span>
                </div>
              </div>

              {/* Continue / Start Button */}
              <div className="pt-3 space-y-2">
                {!currentUser && (
                  <button
                    onClick={() => {
                      sound.playLevelUp();
                      onNewGame();
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 fill-slate-950" />
                    <span>START STAGE-BY-STAGE REGISTRATION 🚀</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playLevelUp();
                    onContinue();
                  }}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all cursor-pointer ${
                    currentUser
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{currentUser ? `CONTINUE CAREER (WEEK ${player.week})` : 'QUICK EXPLORE (GUEST MODE)'}</span>
                </button>
              </div>
            </div>

            {/* Top-Up Cash & Owner Settlement Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Buy Cash with Naira or Dollars based on Region */}
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenTopUpModal();
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 hover:from-emerald-900 hover:to-slate-850 border border-emerald-500/50 text-left transition-all cursor-pointer shadow-lg group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Coins className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors">
                      {player.region === 'NG' ? 'Top-Up Cash (₦ Naira)' : 'Top-Up Cash ($ USD)'}
                    </h4>
                    <p className="text-[10px] text-emerald-300/80">
                      {player.region === 'NG' ? '₦1,000 = $100 Game Cash' : '$1.00 USD = $100 Game Cash'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Owner Bank Account Portal */}
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenOwnerPayoutModal();
                }}
                className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 text-left transition-all cursor-pointer shadow-lg group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <Landmark className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                      Bank Settlement
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Owner Payout Account
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  sound.playClick();
                  onNewGame();
                }}
                className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-left transition-all cursor-pointer group shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Start New Life
                    </h4>
                    <p className="text-[10px] text-slate-400">Stage-by-stage onboarding</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('guide');
                }}
                className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-left transition-all cursor-pointer group shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Game Guide
                    </h4>
                    <p className="text-[10px] text-slate-400">American dream playbook</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Game Guide Modal View */}
        {activeTab === 'guide' && (
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">American Dream Playbook</h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('main');
                }}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                ← Back
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">1. Currency Top-Up & Real Settlement</span>
                <span>You can top-up in-game cash using Nigerian Naira (₦) or US Dollars ($). ₦1,000 buys $100 Game Cash. All top-up payments transfer straight into the game owner's original settlement bank account!</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">2. Daytime Metropolis Map</span>
                <span>Click buildings on the sunny daytime city grid to work, eat smashburgers at Joe's Diner, study at Metro Ivy University, or relax at Central Park.</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-blue-400 block mb-1">3. Realistic W-2 Paychecks & Taxes</span>
                <span>Every week you collect your salary, realistic Federal (12%), State (5.5%), and FICA (7.65%) taxes are deducted. File your 1040 tax return in April for IRS refunds!</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-pink-400 block mb-1">4. Wall Street & Real Estate</span>
                <span>Invest your cash in stocks like NVDA-AI or BitGold on the live trading terminal, or save in high-yield bank accounts earning 4.5% APY compound interest.</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('main');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Back to Start Menu
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl px-6 py-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-600 gap-2">
        <span>American Life Simulator v2.1 • Top-Up & Bank Settlement Enabled</span>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all saved progress and start completely fresh?')) {
              onResetData();
            }
          }}
          className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Saved Data</span>
        </button>
      </footer>
    </div>
  );
};
