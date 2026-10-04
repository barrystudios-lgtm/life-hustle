import React, { useState } from 'react';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { X, Dices, Coins, Trophy, Sparkles, AlertCircle } from 'lucide-react';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  value: string;
  num: number;
}

interface Props {
  playerCash: number;
  onClose: () => void;
  onWin: (amount: number) => void;
  onLoss: (amount: number) => void;
}

export const CasinoModal: React.FC<Props> = ({
  playerCash,
  onClose,
  onWin,
  onLoss,
}) => {
  const [activeTab, setActiveTab] = useState<'blackjack' | 'scratch'>('blackjack');

  // Blackjack state
  const [bet, setBet] = useState<number>(50);
  const [inGame, setInGame] = useState<boolean>(false);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // Scratch card state
  const [scratchedSlots, setScratchedSlots] = useState<boolean[]>([false, false, false, false, false, false]);
  const [scratchValues, setScratchValues] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [scratchBought, setScratchBought] = useState<boolean>(false);

  const drawCard = (): Card => {
    const suits: Card['suit'][] = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const val = values[Math.floor(Math.random() * values.length)];
    let num = parseInt(val);
    if (['J', 'Q', 'K'].includes(val)) num = 10;
    if (val === 'A') num = 11;
    return { suit, value: val, num };
  };

  const calculateHand = (hand: Card[]): number => {
    let total = hand.reduce((sum, c) => sum + c.num, 0);
    let aces = hand.filter((c) => c.value === 'A').length;
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  };

  const startBlackjack = () => {
    if (playerCash < bet) {
      sound.playError();
      return;
    }
    sound.playCash();
    onLoss(bet); // Deduct bet upfront

    const p1 = drawCard();
    const d1 = drawCard();
    const p2 = drawCard();
    const d2 = drawCard();

    const pHand = [p1, p2];
    const dHand = [d1, d2];

    setPlayerHand(pHand);
    setDealerHand(dHand);
    setInGame(true);
    setGameResult(null);

    const pTotal = calculateHand(pHand);
    if (pTotal === 21) {
      // Natural Blackjack
      endGame(pHand, dHand, 'blackjack');
    }
  };

  const hitCard = () => {
    sound.playClick();
    const newCard = drawCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);

    const total = calculateHand(newHand);
    if (total > 21) {
      endGame(newHand, dealerHand, 'bust');
    }
  };

  const standTurn = () => {
    sound.playClick();
    let currentDealer = [...dealerHand];
    let dTotal = calculateHand(currentDealer);

    while (dTotal < 17) {
      currentDealer.push(drawCard());
      dTotal = calculateHand(currentDealer);
    }
    setDealerHand(currentDealer);

    const pTotal = calculateHand(playerHand);
    if (dTotal > 21) {
      endGame(playerHand, currentDealer, 'dealer_bust');
    } else if (pTotal > dTotal) {
      endGame(playerHand, currentDealer, 'win');
    } else if (pTotal < dTotal) {
      endGame(playerHand, currentDealer, 'loss');
    } else {
      endGame(playerHand, currentDealer, 'push');
    }
  };

  const endGame = (pHand: Card[], dHand: Card[], outcome: string) => {
    setInGame(false);
    if (outcome === 'blackjack') {
      const winAmt = Math.round(bet * 2.5);
      sound.playCasinoWin();
      confetti({ particleCount: 70, spread: 60 });
      onWin(winAmt);
      setGameResult(`BLACKJACK! You won $${winAmt}!`);
    } else if (outcome === 'win' || outcome === 'dealer_bust') {
      const winAmt = bet * 2;
      sound.playCasinoWin();
      confetti({ particleCount: 50, spread: 50 });
      onWin(winAmt);
      setGameResult(`Dealer busts or lower score! You won $${winAmt}!`);
    } else if (outcome === 'push') {
      sound.playClick();
      onWin(bet); // Refund
      setGameResult('Push! Hands are equal, bet refunded.');
    } else {
      sound.playError();
      setGameResult('Dealer won this hand. Better luck next deal!');
    }
  };

  // Buy scratch card
  const buyScratch = () => {
    if (playerCash < 25) {
      sound.playError();
      return;
    }
    sound.playCash();
    onLoss(25);
    setScratchBought(true);
    setScratchedSlots([false, false, false, false, false, false]);

    // Generate random prize outcomes
    const pool = [0, 0, 10, 25, 50, 100, 500, 2500];
    const vals = Array(6)
      .fill(0)
      .map(() => pool[Math.floor(Math.random() * pool.length)]);
    setScratchValues(vals);
  };

  const scratchSlot = (index: number) => {
    if (!scratchBought || scratchedSlots[index]) return;
    sound.playClick();
    const updated = [...scratchedSlots];
    updated[index] = true;
    setScratchedSlots(updated);

    const prize = scratchValues[index];
    if (prize > 0) {
      sound.playCasinoWin();
      onWin(prize);
      if (prize >= 100) {
        confetti({ particleCount: 60, spread: 60 });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600/30 via-slate-900 to-rose-950/40 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-2xl">
              🎰
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Diamond Horseshoe Grand Casino
              </span>
              <h3 className="text-xl font-black text-white">
                Vegas High-Roller Lounge
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('blackjack');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'blackjack'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ♠ High-Stakes Blackjack
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('scratch');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'scratch'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ★ $25 Lucky 7s Scratchers
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'blackjack' ? (
            <div className="space-y-6">
              {/* Felt Green Table */}
              <div className="p-6 rounded-3xl bg-emerald-950/90 border-4 border-emerald-800/80 shadow-2xl relative">
                {/* Dealer Area */}
                <div className="text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold mb-2">
                    DEALER HAND {inGame ? '(? + visible)' : dealerHand.length > 0 ? `(${calculateHand(dealerHand)})` : ''}
                  </div>
                  <div className="flex items-center justify-center gap-2 min-h-[75px]">
                    {dealerHand.map((card, idx) => {
                      const isHidden = inGame && idx === 1;
                      const isRed = card.suit === '♥' || card.suit === '♦';

                      return (
                        <div
                          key={idx}
                          className={`w-14 h-20 rounded-xl border flex flex-col items-center justify-between p-1.5 shadow-md ${
                            isHidden
                              ? 'bg-blue-900 border-blue-700 text-blue-300'
                              : 'bg-white border-slate-300 ' + (isRed ? 'text-red-600' : 'text-slate-900')
                          }`}
                        >
                          {isHidden ? (
                            <span className="my-auto font-mono text-xs font-black">?</span>
                          ) : (
                            <>
                              <span className="font-bold text-xs self-start font-mono leading-none">{card.value}</span>
                              <span className="text-xl leading-none">{card.suit}</span>
                              <span className="font-bold text-xs self-end font-mono leading-none">{card.value}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="my-4 border-t border-emerald-800/40 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-0.5 rounded-full bg-emerald-900 text-emerald-300 text-[10px] font-mono">
                    PAYS 3 TO 2
                  </span>
                </div>

                {/* Player Area */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 min-h-[75px]">
                    {playerHand.map((card, idx) => {
                      const isRed = card.suit === '♥' || card.suit === '♦';
                      return (
                        <div
                          key={idx}
                          className={`w-14 h-20 rounded-xl border flex flex-col items-center justify-between p-1.5 shadow-md bg-white border-slate-300 ${
                            isRed ? 'text-red-600' : 'text-slate-900'
                          }`}
                        >
                          <span className="font-bold text-xs self-start font-mono leading-none">{card.value}</span>
                          <span className="text-xl leading-none">{card.suit}</span>
                          <span className="font-bold text-xs self-end font-mono leading-none">{card.value}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold mt-2">
                    YOUR HAND {playerHand.length > 0 ? `(${calculateHand(playerHand)})` : ''}
                  </div>
                </div>
              </div>

              {/* Game Result Message */}
              {gameResult && (
                <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-center font-bold text-sm text-amber-300 animate-in fade-in">
                  {gameResult}
                </div>
              )}

              {/* Controls */}
              {inGame ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={hitCard}
                    className="py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Hit (+1 Card)
                  </button>
                  <button
                    onClick={standTurn}
                    className="py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Stand (Hold)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Bet Selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">Select Bet:</span>
                    <div className="flex items-center gap-2">
                      {[25, 50, 100, 500, 1000].map((b) => (
                        <button
                          key={b}
                          onClick={() => setBet(b)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                            bet === b
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          ${b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={playerCash < bet}
                    onClick={startBlackjack}
                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer ${
                      playerCash >= bet
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Deal Cards (${bet} Bet)
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Lucky 7s Scratch Card */
            <div className="space-y-5 text-center">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/60 to-purple-950/60 border border-amber-500/40 shadow-xl max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-amber-400">METRO LOTTERY</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                    WIN UP TO $2,500
                  </span>
                </div>

                <h4 className="text-xl font-black text-white tracking-wider mb-4">
                  ★ LUCKY 7s SCRATCHER ★
                </h4>

                {/* 6 Scratch Spots */}
                <div className="grid grid-cols-3 gap-3">
                  {scratchedSlots.map((scratched, idx) => {
                    const val = scratchValues[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => scratchSlot(idx)}
                        disabled={!scratchBought || scratched}
                        className={`h-20 rounded-2xl border-2 flex items-center justify-center font-mono font-black text-sm transition-all cursor-pointer ${
                          scratched
                            ? val > 0
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-105 shadow-lg'
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                            : scratchBought
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 border-amber-300 hover:scale-105 active:scale-95 shadow-md'
                            : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        {scratched ? (val > 0 ? `+$${val}` : 'TRY AGAIN') : 'SCRATCH'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={playerCash < 25}
                onClick={buyScratch}
                className={`py-3.5 px-8 rounded-2xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer ${
                  playerCash >= 25
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Buy New Scratch Card ($25)
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs font-mono text-slate-400 text-center">
          Available Cash: ${playerCash.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
