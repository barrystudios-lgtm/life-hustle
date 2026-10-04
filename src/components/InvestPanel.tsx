import React, { useState } from 'react';
import { PortfolioPosition, StockAsset } from '../types/game';
import { sound } from '../utils/sound';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  Landmark,
  ShieldAlert
} from 'lucide-react';

interface Props {
  stocks: StockAsset[];
  portfolio: Record<string, PortfolioPosition>;
  cash: number;
  bankSavings: number;
  onBuyStock: (symbol: string, shares: number) => void;
  onSellStock: (symbol: string, shares: number) => void;
  onDepositBank: (amount: number) => void;
  onWithdrawBank: (amount: number) => void;
}

export const InvestPanel: React.FC<Props> = ({
  stocks,
  portfolio,
  cash,
  bankSavings,
  onBuyStock,
  onSellStock,
  onDepositBank,
  onWithdrawBank,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(stocks[0].symbol);
  const [tradeShares, setTradeShares] = useState<number>(1);
  const [bankInput, setBankInput] = useState<string>('500');

  const selectedStock = stocks.find((s) => s.symbol === selectedSymbol) || stocks[0];
  const userPosition = portfolio[selectedStock.symbol];

  // Calculate total portfolio value
  const totalInvestedValue = Object.entries(portfolio).reduce((acc, [sym, pos]) => {
    const s = stocks.find((item) => item.symbol === sym);
    if (!s) return acc;
    return acc + pos.shares * s.price;
  }, 0);

  const totalCostBasis = Object.values(portfolio).reduce((acc, pos) => {
    return acc + pos.shares * pos.avgBuyPrice;
  }, 0);

  const totalProfit = totalInvestedValue - totalCostBasis;
  const totalProfitPercent = totalCostBasis > 0 ? (totalProfit / totalCostBasis) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/40">
              Wall Street & Crypto Terminal
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Active Investment Portfolio
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">Total Portfolio Value:</span>
              <span className="text-lg font-mono font-bold text-white">
                ${totalInvestedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Unrealized Return</span>
              <div className={`text-base font-black font-mono flex items-center justify-end gap-1 ${
                totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {totalProfit >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                ${Math.abs(totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs">({totalProfitPercent.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ticker List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Metropolis Markets & Assets
          </div>

          {stocks.map((stock) => {
            const isSelected = selectedSymbol === stock.symbol;
            const isPositive = stock.change24h >= 0;
            const hasPosition = portfolio[stock.symbol]?.shares > 0;

            return (
              <div
                key={stock.symbol}
                onClick={() => {
                  sound.playClick();
                  setSelectedSymbol(stock.symbol);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm font-mono text-white">
                      {stock.symbol}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {stock.type}
                    </span>
                    {hasPosition && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="You own shares" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-[130px]">
                    {stock.name}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-white">
                    ${stock.price < 1 ? stock.price.toFixed(4) : stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs font-mono font-semibold flex items-center justify-end ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isPositive ? '+' : ''}{stock.change24h.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Asset Detail & Trading Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            {/* Asset Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-black font-mono text-white">
                    {selectedStock.symbol}
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {selectedStock.name}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedStock.description}
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black font-mono text-white">
                  ${selectedStock.price < 1 ? selectedStock.price.toFixed(4) : selectedStock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-xs font-mono font-bold ${
                  selectedStock.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {selectedStock.change24h >= 0 ? '▲ +' : '▼ '}{selectedStock.change24h.toFixed(1)}% this week
                </div>
              </div>
            </div>

            {/* Sparkline Visual Simulation */}
            <div className="py-4">
              <div className="text-[10px] font-mono text-slate-400 mb-2 uppercase">
                Recent 7-Week Price Trajectory
              </div>
              <div className="h-24 w-full flex items-end gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                {selectedStock.history.map((hist, idx) => {
                  const min = Math.min(...selectedStock.history);
                  const max = Math.max(...selectedStock.history);
                  const range = max - min || 1;
                  const heightPercent = Math.max(15, ((hist - min) / range) * 85);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          selectedStock.change24h >= 0
                            ? 'bg-emerald-500/70 group-hover:bg-emerald-400'
                            : 'bg-rose-500/70 group-hover:bg-rose-400'
                        }`}
                      />
                      <span className="text-[9px] font-mono text-slate-500">
                        W{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Position Status */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Your Holdings:</span>
              <span className="text-white font-bold">
                {userPosition ? userPosition.shares : 0} units (~${((userPosition?.shares || 0) * selectedStock.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>

            {/* Trading Inputs */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">Order Quantity:</span>
                <div className="flex items-center gap-2">
                  {[1, 5, 20, 100].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setTradeShares(qty)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                        tradeShares === qty
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    value={tradeShares}
                    onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white text-center"
                  />
                </div>
              </div>

              {/* Order Cost Preview */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Estimated Total:</span>
                <span className="text-white font-bold">
                  ${(tradeShares * selectedStock.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Buy & Sell Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  disabled={cash < tradeShares * selectedStock.price}
                  onClick={() => {
                    sound.playCash();
                    onBuyStock(selectedStock.symbol, tradeShares);
                  }}
                  className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    cash >= tradeShares * selectedStock.price
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Buy {selectedStock.symbol}
                </button>

                <button
                  disabled={!userPosition || userPosition.shares < tradeShares}
                  onClick={() => {
                    sound.playCash();
                    onSellStock(selectedStock.symbol, tradeShares);
                  }}
                  className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    userPosition && userPosition.shares >= tradeShares
                      ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Sell {selectedStock.symbol}
                </button>
              </div>
            </div>
          </div>

          {/* High Yield Savings Bank */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Landmark className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    High-Yield Savings Account (4.5% APY)
                  </h4>
                  <p className="text-xs text-slate-400">
                    FDIC Insured. Interest accrues and compounds every week.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-black text-blue-400">
                  ${bankSavings.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Current Savings</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-3">
              <input
                type="number"
                value={bankInput}
                onChange={(e) => setBankInput(e.target.value)}
                placeholder="Amount"
                className="w-32 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
              />
              <button
                onClick={() => {
                  const val = parseFloat(bankInput);
                  if (val > 0 && cash >= val) {
                    sound.playCash();
                    onDepositBank(val);
                  } else {
                    sound.playError();
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Deposit Cash
              </button>
              <button
                onClick={() => {
                  const val = parseFloat(bankInput);
                  if (val > 0 && bankSavings >= val) {
                    sound.playCash();
                    onWithdrawBank(val);
                  } else {
                    sound.playError();
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
