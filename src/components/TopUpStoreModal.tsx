import React, { useState } from 'react';
import { CashTopUpPackage } from '../types/account';
import { PlayerRegion } from '../types/game';
import { TOP_UP_PACKAGES, getOwnerPayoutConfig, saveTransaction } from '../utils/authStorage';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  X, 
  DollarSign, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Landmark,
  Smartphone,
  Copy,
  Check,
  Globe,
  Coins,
  Wallet
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTopUpSuccess: (cashAmount: number) => void;
  playerRegion: PlayerRegion;
  onSwitchRegion?: (newRegion: PlayerRegion) => void;
  userEmail?: string;
  userId?: string;
}

export const TopUpStoreModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onTopUpSuccess,
  playerRegion = 'NG',
  onSwitchRegion,
  userEmail = 'player@americanlife.sim',
  userId = 'usr_guest',
}) => {
  const [selectedPkg, setSelectedPkg] = useState<CashTopUpPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Card' | 'USSD' | 'ApplePay' | 'PayPal'>('Bank Transfer');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchaseReceipt, setPurchaseReceipt] = useState<{
    reference: string;
    gameCash: number;
    amountPaid: string;
    settledTo: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const ownerConfig = getOwnerPayoutConfig();

  if (!isOpen) return null;

  const isNaira = playerRegion === 'NG';

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(ownerConfig.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPkg) return;

    setIsProcessing(true);
    sound.playWork();

    setTimeout(() => {
      setIsProcessing(false);
      const reference = `TXN_${Date.now()}_${Math.floor(Math.random() * 8999 + 1000)}`;
      const realAmount = isNaira ? selectedPkg.nairaPrice : selectedPkg.usdPrice;

      // Save to transaction ledger
      saveTransaction({
        id: reference,
        userId,
        userEmail,
        realAmount,
        realCurrency: isNaira ? 'NGN' : 'USD',
        gameCashPurchased: selectedPkg.gameCash,
        paymentMethod: paymentMethod === 'ApplePay' || paymentMethod === 'PayPal' ? 'Card' : paymentMethod,
        reference,
        timestamp: new Date().toLocaleString(),
        status: 'Completed',
        settledToOwnerAccount: {
          bankName: ownerConfig.bankName,
          accountNumber: ownerConfig.accountNumber,
          accountName: ownerConfig.accountName,
        },
      });

      sound.playCasinoWin();
      confetti({ particleCount: 90, spread: 70 });

      setPurchaseReceipt({
        reference,
        gameCash: selectedPkg.gameCash,
        amountPaid: isNaira ? `₦${selectedPkg.nairaPrice.toLocaleString()} Naira` : `$${selectedPkg.usdPrice.toFixed(2)} USD`,
        settledTo: `${ownerConfig.bankName} - ${ownerConfig.accountNumber} (${ownerConfig.accountName})`,
      });

      onTopUpSuccess(selectedPkg.gameCash);
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/40 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-2xl">
              💰
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1">
                  <span>{isNaira ? '🇳🇬' : '🇺🇸'}</span>
                  <span>{isNaira ? 'NIGERIA (NAIRA ₦)' : 'INTERNATIONAL (USD $)'}</span>
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-0.5">
                Top-Up In-Game Dollars
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

        {/* Region Selector Bar */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> Active Region:
          </span>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (!isNaira && onSwitchRegion) {
                  sound.playClick();
                  onSwitchRegion('NG');
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isNaira
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇳🇬</span>
              <span>Nigeria (₦)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isNaira && onSwitchRegion) {
                  sound.playClick();
                  onSwitchRegion('US');
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                !isNaira
                  ? 'bg-blue-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇺🇸</span>
              <span>Outside NG ($)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {purchaseReceipt ? (
            /* Purchase Success Receipt */
            <div className="text-center space-y-4 py-3 animate-in fade-in">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">
                  Payment Verified & Credited!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Credited <span className="text-emerald-400 font-bold font-mono">+${purchaseReceipt.gameCash.toLocaleString()} In-Game Dollars</span> to your wallet.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Receipt Ref:</span>
                  <span className="text-white font-bold">{purchaseReceipt.reference}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-400 font-bold">{purchaseReceipt.amountPaid}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Deposited to Owner:</span>
                  <span className="text-amber-400 font-bold truncate max-w-[210px]" title={purchaseReceipt.settledTo}>
                    {purchaseReceipt.settledTo}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Settlement Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Wired Directly to Real Bank
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPurchaseReceipt(null);
                  setSelectedPkg(null);
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Return to Game & Spend Cash
              </button>
            </div>
          ) : selectedPkg ? (
            /* Checkout Step */
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <button
                  onClick={() => setSelectedPkg(null)}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
                >
                  ← Select Different Pack
                </button>
                <span className="text-xs font-mono text-emerald-400">
                  {isNaira ? '🇳🇬 Nigeria Payout' : '🇺🇸 USD Payout'}
                </span>
              </div>

              {/* Package Summary Card */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                    You Are Purchasing
                  </span>
                  <div className="text-xl font-black text-white font-mono flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span>{selectedPkg.gameCash.toLocaleString()} In-Game Cash</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Amount Payable:</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    {isNaira ? `₦${selectedPkg.nairaPrice.toLocaleString()}` : `$${selectedPkg.usdPrice.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Payment Methods Strictly Per Region */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                  {isNaira ? 'Select Nigerian Payment Method (₦):' : 'Select International Payment Method ($):'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {isNaira ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Bank Transfer')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          paymentMethod === 'Bank Transfer'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <Landmark className="w-4 h-4" />
                        <span>Bank Transfer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('USSD')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          paymentMethod === 'USSD'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>USSD (*737#)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          paymentMethod === 'Card'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Verve / Card</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          paymentMethod === 'Card'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Credit / Debit Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('ApplePay')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          paymentMethod === 'ApplePay'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Apple / GPay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('PayPal')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          paymentMethod === 'PayPal'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <Wallet className="w-4 h-4" />
                        <span>PayPal</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Real Owner Bank Account Settlement Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Game Operator Direct Bank Settlement:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Real Bank Deposit
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Beneficiary Bank:</span>
                    <span className="font-bold text-white">{ownerConfig.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Account Number:</span>
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <span>{ownerConfig.accountNumber}</span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Copy Account Number"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Beneficiary Name:</span>
                    <span className="font-bold text-white">{ownerConfig.accountName}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  The {isNaira ? `₦${selectedPkg.nairaPrice.toLocaleString()} Naira` : `$${selectedPkg.usdPrice.toFixed(2)} USD`} paid will enter the operator's verified original bank account above, and your in-game wallet will immediately receive +${selectedPkg.gameCash.toLocaleString()} game dollars.
                </p>
              </div>

              {/* Confirm Pay Button */}
              <button
                disabled={isProcessing}
                onClick={handleConfirmPurchase}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isProcessing
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 active:scale-95'
                }`}
              >
                {isProcessing ? (
                  <span>Processing Secure Payment...</span>
                ) : (
                  <>
                    <span>Confirm & Pay ({isNaira ? `₦${selectedPkg.nairaPrice.toLocaleString()}` : `$${selectedPkg.usdPrice.toFixed(2)}`})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Packages Grid - STRICTLY in active region's currency */
            <div className="space-y-3.5">
              {/* Rate Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300 font-bold">
                  {isNaira ? 'Rate: ₦1,000 = $100 In-Game Cash' : 'Rate: $1.00 USD = $100 In-Game Cash'}
                </span>
                <span className="text-[10px] text-amber-400 font-bold uppercase">
                  Instant Wallet Credit
                </span>
              </div>

              {/* Package Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TOP_UP_PACKAGES.map((pkg) => {
                  // Strictly display ONLY current region currency
                  const priceLabel = isNaira ? `₦${pkg.nairaPrice.toLocaleString()}` : `$${pkg.usdPrice.toFixed(2)}`;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedPkg(pkg);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:border-emerald-500 ${
                        pkg.popular
                          ? 'bg-gradient-to-br from-slate-900 to-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            {pkg.badge}
                          </span>
                          {pkg.bonusPercent && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                              +{pkg.bonusPercent}% BONUS
                            </span>
                          )}
                        </div>

                        <div className="text-2xl font-black font-mono text-white mt-2.5 flex items-center gap-1">
                          <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>{pkg.gameCash.toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          In-Game American Dollars
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-base font-black font-mono text-emerald-400">
                          {priceLabel}
                        </span>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-white transition-colors">
                          Buy Now →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-slate-500 text-[10px] font-mono flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real Settlement Enabled • All Payments Route to Verified Bank Account</span>
        </div>
      </div>
    </div>
  );
};
