import React, { useState } from 'react';
import { OwnerPayoutConfig, PaymentTransaction } from '../types/account';
import { 
  getOwnerPayoutConfig, 
  saveOwnerPayoutConfig, 
  getAllTransactions 
} from '../utils/authStorage';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  X, 
  Save, 
  TrendingUp, 
  Landmark, 
  CheckCircle2, 
  CreditCard, 
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: (config: OwnerPayoutConfig) => void;
}

export const OwnerPayoutSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [config, setConfig] = useState<OwnerPayoutConfig>(() => getOwnerPayoutConfig());
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => getAllTransactions());
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveOwnerPayoutConfig(config);
    if (onConfigUpdated) onConfigUpdated(config);
    sound.playLevelUp();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const nigerianBanks = [
    'Access Bank',
    'Guaranty Trust Bank (GTBank)',
    'Zenith Bank',
    'United Bank for Africa (UBA)',
    'First Bank of Nigeria',
    'Kuda Microfinance Bank',
    'Moniepoint Microfinance Bank',
    'Opay / Paycom',
    'Fidelity Bank',
    'Stanbic IBTC Bank',
    'Sterling Bank',
    'Wema Bank / ALAT',
    'Chase Bank (US)',
    'Bank of America (US)',
    'Wells Fargo (US)',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Landmark className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Game Owner / Merchant Portal
              </span>
              <h3 className="text-xl font-black text-white">
                Bank Payout & Settlement Settings
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Revenue Totals Bar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                Total Naira Revenue Received
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                ₦{config.totalRevenueNaira.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                Settled to your verified bank account
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                Total USD Revenue Received
              </span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                ${config.totalRevenueUSD.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                Direct wire settlement
              </span>
            </div>
          </div>

          {/* Bank Configuration Form */}
          <form onSubmit={handleSave} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Your Original Bank Account for Payouts
              </h4>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Active Payout Destination
              </span>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Bank settlement details successfully saved and updated!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                  Select Your Bank
                </label>
                <select
                  value={config.bankName}
                  onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                >
                  {nigerianBanks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                  Account Number (10 Digits)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={config.accountNumber}
                  onChange={(e) => setConfig({ ...config, accountNumber: e.target.value })}
                  placeholder="e.g. 0123456789"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                  Account Name (As Registered with Bank)
                </label>
                <input
                  type="text"
                  value={config.accountName}
                  onChange={(e) => setConfig({ ...config, accountName: e.target.value })}
                  placeholder="e.g. Olatokunbo Afolabi"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                  Settlement Currency
                </label>
                <select
                  value={config.settlementCurrency}
                  onChange={(e) => setConfig({ ...config, settlementCurrency: e.target.value as 'NGN' | 'USD' | 'Both' })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Both">Both Naira (NGN) & USD</option>
                  <option value="NGN">Naira (NGN) Only</option>
                  <option value="USD">US Dollar (USD) Only</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Auto-settlement to this account on each completed player top-up
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Bank Details</span>
              </button>
            </div>
          </form>

          {/* Live Payments Ledger */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                Incoming Real-Money Transactions ({transactions.length})
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">
                Live Merchant Settlement Ledger
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 font-mono">
                No purchases yet. When players buy in-game dollars with Naira or USD, transactions will record here and settle into your bank account.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{tx.realCurrency === 'NGN' ? `₦${tx.realAmount.toLocaleString()}` : `$${tx.realAmount.toFixed(2)}`}</span>
                        <span className="text-slate-400 font-normal">→ +${tx.gameCashPurchased.toLocaleString()} Game Cash</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {tx.reference} • {tx.paymentMethod} • {tx.timestamp}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        SETTLED
                      </span>
                      <div className="text-[9px] text-slate-500 mt-0.5 truncate max-w-[120px]">
                        {tx.settledToOwnerAccount.bankName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-center text-slate-500 text-[10px] font-mono">
          Game Operator Financial Settlement Module • Real Bank Account Sync Enabled
        </div>
      </div>
    </div>
  );
};
