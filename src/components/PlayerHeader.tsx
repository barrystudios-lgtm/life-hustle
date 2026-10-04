import React from 'react';
import { GameState, PlayerRegion } from '../types/game';
import { UserAccount } from '../types/account';
import { AvatarDisplay } from './AvatarDisplay';
import { sound } from '../utils/sound';
import { 
  DollarSign, 
  BatteryCharging, 
  Utensils, 
  Smile, 
  Heart, 
  Brain, 
  Sparkles, 
  CreditCard, 
  Award, 
  Calendar, 
  Volume2, 
  VolumeX, 
  FastForward, 
  RotateCcw, 
  Receipt, 
  Menu, 
  Sun,
  User,
  PlusCircle,
  Coins,
  Globe
} from 'lucide-react';

interface Props {
  gameState: GameState;
  onAdvanceWeek: () => void;
  onToggleSound: () => void;
  onOpenNewLife: () => void;
  onOpenPaystub: () => void;
  onOpenStartMenu: () => void;
  currentUser: UserAccount | null;
  onOpenAccountModal: () => void;
  onOpenTopUpModal: () => void;
  onSwitchRegion?: (newRegion: PlayerRegion) => void;
}

export const PlayerHeader: React.FC<Props> = ({
  gameState,
  onAdvanceWeek,
  onToggleSound,
  onOpenNewLife,
  onOpenPaystub,
  onOpenStartMenu,
  currentUser,
  onOpenAccountModal,
  onOpenTopUpModal,
  onSwitchRegion,
}) => {
  const { player, dayTime, soundEnabled } = gameState;
  const { stats } = player;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-emerald-400';
    if (score >= 670) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 py-2">
        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Main Menu Button & Player Identity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenStartMenu();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md border border-slate-700"
              title="Return to Main Menu"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">MENU</span>
            </button>

            <AvatarDisplay avatar={player.avatar} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                  {player.name}
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Age {player.age}
                  </span>
                </h1>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="truncate max-w-[130px] sm:max-w-none text-slate-300">
                  📍 {player.originCity}
                </span>
                <span>•</span>
                <span className="text-amber-300/90 font-medium">
                  {player.education}
                </span>
              </div>
            </div>
          </div>

          {/* Time, Account, & Advance Turn */}
          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
            {/* Account Profile Pill */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenAccountModal();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
              title="Account Settings & Profile"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline font-bold">
                {currentUser ? `@${currentUser.username}` : 'Account'}
              </span>
            </button>

            {/* Calendar Week Pill */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1 justify-end">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Week {player.week} / 52
              </span>
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1 justify-end">
                <Sun className="w-3 h-3 text-amber-400" />
                Year {player.year} • <span className="capitalize text-amber-400">{dayTime}</span>
              </span>
            </div>

            {/* Advance Week Button */}
            <button
              onClick={() => {
                sound.playWork();
                onAdvanceWeek();
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              title="Collect weekly wages, pay taxes & rent, age 1 week"
            >
              <FastForward className="w-4 h-4 fill-slate-950" />
              <span>ADVANCE WEEK</span>
            </button>

            {/* Controls */}
            <div className="flex items-center gap-1 border-l border-slate-800 pl-1.5">
              <button
                onClick={onToggleSound}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenNewLife}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                title="Start a New Life / Character"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Second Row: Finances, Top-Up Store, W-2 Paystub & Need Gauges */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Financial Cards */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto">
            {/* Cash with Top-Up Button */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Cash</span>
                <span className="font-bold font-mono text-emerald-400">{formatMoney(player.cash)}</span>
              </div>
            </div>

            {/* Top-Up Cash Button (Strictly Region-Aware: ₦ Naira in NG, $ USD outside) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenTopUpModal();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-950 to-slate-900 hover:from-emerald-900 hover:to-slate-850 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/50 cursor-pointer transition-colors shadow-sm font-mono font-bold text-xs"
              title={`Top Up In-Game Cash using ${player.region === 'NG' ? 'Nigerian Naira (₦)' : 'US Dollars ($)'}`}
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>{player.region === 'NG' ? 'Top-Up (₦ Naira)' : 'Top-Up ($ USD)'}</span>
            </button>

            {/* Region Indicator & Quick Toggle */}
            {onSwitchRegion && (
              <button
                onClick={() => {
                  sound.playClick();
                  onSwitchRegion(player.region === 'NG' ? 'US' : 'NG');
                }}
                className="flex items-center gap-1 bg-slate-950 hover:bg-slate-800 px-2 py-1 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px] font-mono"
                title="Click to Switch Region between Nigeria (₦) and Outside NG ($)"
              >
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>{player.region === 'NG' ? '🇳🇬 NG (₦)' : '🇺🇸 US ($)'}</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Bank</span>
                <span className="font-bold font-mono text-blue-400">{formatMoney(player.bankSavings)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Net Worth</span>
                <span className="font-bold font-mono text-amber-400">{formatMoney(player.netWorth)}</span>
              </div>
            </div>

            {/* W-2 Paystub & Tax button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenPaystub();
              }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer transition-colors shadow-sm"
              title="Inspect Weekly W-2 Paystub & Tax Deductions"
            >
              <Receipt className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold text-[11px]">Paystub</span>
            </button>
          </div>

          {/* Need Bars */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap ml-auto">
            {/* Energy */}
            <div className="flex items-center gap-1" title={`Energy: ${stats.energy}%`}>
              <BatteryCharging className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <div className="w-12 sm:w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, stats.energy))}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-300">{stats.energy}%</span>
            </div>

            {/* Hunger */}
            <div className="flex items-center gap-1" title={`Fullness / Hunger: ${stats.hunger}%`}>
              <Utensils className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <div className="w-12 sm:w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, stats.hunger))}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-300">{stats.hunger}%</span>
            </div>

            {/* Happiness */}
            <div className="flex items-center gap-1" title={`Happiness: ${stats.happiness}%`}>
              <Smile className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <div className="w-12 sm:w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, stats.happiness))}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-300">{stats.happiness}%</span>
            </div>

            {/* Health */}
            <div className="flex items-center gap-1" title={`Health: ${stats.health}%`}>
              <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <div className="w-12 sm:w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, stats.health))}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-300">{stats.health}%</span>
            </div>

            {/* Smarts & Credit Score */}
            <div className="hidden md:flex items-center gap-3 border-l border-slate-800 pl-2.5">
              <span className="flex items-center gap-1 text-[11px] font-mono text-indigo-300" title="Smarts / IQ">
                <Brain className="w-3 h-3 text-indigo-400" /> {stats.smarts}
              </span>
              <span className={`text-[11px] font-mono font-bold ${getCreditScoreColor(stats.creditScore)}`} title="FICO Credit Score (300-850)">
                💳 {stats.creditScore}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
