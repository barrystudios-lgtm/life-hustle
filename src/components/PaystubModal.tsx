import React from 'react';
import { GameState } from '../types/game';
import { INITIAL_JOBS, HOUSING_OPTIONS, VEHICLE_OPTIONS } from '../data/cityData';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  X, 
  Receipt, 
  Building, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  Calendar,
  CreditCard
} from 'lucide-react';

interface Props {
  gameState: GameState;
  onClose: () => void;
  onClaimTaxRefund?: (refundAmount: number) => void;
}

export const PaystubModal: React.FC<Props> = ({ gameState, onClose, onClaimTaxRefund }) => {
  const { player } = gameState;
  const currentJob = INITIAL_JOBS.find((j) => j.id === player.currentJobId);
  const currentHouse = HOUSING_OPTIONS.find((h) => h.id === player.currentHouseId) || HOUSING_OPTIONS[0];

  const grossEarnings = currentJob ? currentJob.weeklySalary : 0;
  const federalTax = Math.round(grossEarnings * 0.12);
  const stateTax = Math.round(grossEarnings * 0.055);
  const ficaTax = Math.round(grossEarnings * 0.0765);
  const healthInsurance = currentJob ? 35 : 0;

  const totalDeductions = federalTax + stateTax + ficaTax + healthInsurance;
  const netPay = Math.max(0, grossEarnings - totalDeductions);

  // Living expenses
  const rentExpense = currentHouse.owned ? 40 : currentHouse.weeklyRent;
  let vehicleExpense = 0;
  player.ownedVehicles.forEach((vId) => {
    const v = VEHICLE_OPTIONS.find((veh) => veh.id === vId);
    if (v) vehicleExpense += v.weeklyUpkeep;
  });
  const groceryExpense = 85;
  const phoneExpense = 25;
  const totalLivingExpenses = rentExpense + vehicleExpense + groceryExpense + phoneExpense;

  const netCashFlow = netPay - totalLivingExpenses;

  // April Tax Season (Week 14 to 17)
  const isTaxSeason = player.week >= 14 && player.week <= 17;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border-2 border-slate-300 font-mono text-xs">
        {/* Header - Authentic American Paystub style */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950">
              <Receipt className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] tracking-widest text-amber-400 font-bold uppercase">
                FORM W-2 / EARNINGS STATEMENT
              </span>
              <h3 className="text-base font-black tracking-tight text-white font-sans">
                {currentJob ? currentJob.companyName : 'INDEPENDENT CONTRACTOR'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Employee & Pay Period Details */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Employee Name</span>
            <span className="font-bold text-slate-900">{player.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Social Security</span>
            <span className="font-bold text-slate-900">***-**-4912</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Pay Period</span>
            <span className="font-bold text-slate-900">Wk {player.week}, {player.year}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Filing Status</span>
            <span className="font-bold text-slate-900">Single / 0 Allow</span>
          </div>
        </div>

        {/* Paystub Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Earnings Breakdown */}
          <div>
            <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-300 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              <span>Earnings Classification</span>
              <span>Rate / Hrs</span>
              <span>Total Gross</span>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-800">
              <span className="font-semibold">{currentJob ? currentJob.title : 'Unemployed / Freelance'}</span>
              <span>{currentJob ? `$${currentJob.hourlyRate}/hr • 40h` : '0h'}</span>
              <span className="font-bold text-slate-950">${grossEarnings.toLocaleString()}.00</span>
            </div>
          </div>

          {/* Statutory Tax Deductions */}
          <div>
            <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-300 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              <span>Taxes & Deductions Withheld</span>
              <span>Rate</span>
              <span>Amount</span>
            </div>

            <div className="space-y-1 text-slate-700">
              <div className="flex items-center justify-between">
                <span>Federal Withholding Tax</span>
                <span>12.0%</span>
                <span className="text-rose-600 font-semibold">-${federalTax}.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>State & Local Income Tax</span>
                <span>5.5%</span>
                <span className="text-rose-600 font-semibold">-${stateTax}.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>FICA (Social Security & Medicare)</span>
                <span>7.65%</span>
                <span className="text-rose-600 font-semibold">-${ficaTax}.00</span>
              </div>
              {currentJob && (
                <div className="flex items-center justify-between">
                  <span>Employer Health & Dental Copay</span>
                  <span>Flat</span>
                  <span className="text-rose-600 font-semibold">-${healthInsurance}.00</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200 font-bold text-slate-900">
              <span>Total Deductions</span>
              <span className="text-rose-600">-${totalDeductions}.00</span>
            </div>
          </div>

          {/* Net Take-Home Pay Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between font-sans">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">
                Net Take-Home Pay (Direct Deposit)
              </span>
              <span className="text-xl font-black text-emerald-900 font-mono">
                ${netPay.toLocaleString()}.00
              </span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-200/60 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Living Expenses Summary */}
          <div>
            <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-300 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              <span>Weekly Living Overhead Expenses</span>
              <span>Amount</span>
            </div>

            <div className="space-y-1 text-slate-700">
              <div className="flex items-center justify-between">
                <span>Rent / Housing ({currentHouse.name})</span>
                <span className="text-rose-600">-${rentExpense}.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vehicles Upkeep & Transit</span>
                <span className="text-rose-600">-${vehicleExpense}.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Groceries & Bodega Food</span>
                <span className="text-rose-600">-${groceryExpense}.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>5G Mobile & High-Speed Internet</span>
                <span className="text-rose-600">-${phoneExpense}.00</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200 font-bold text-slate-900">
              <span>Estimated Weekly Net Cashflow</span>
              <span className={netCashFlow >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                {netCashFlow >= 0 ? '+' : ''}${netCashFlow}.00
              </span>
            </div>
          </div>

          {/* April Tax Refund Event */}
          {isTaxSeason && onClaimTaxRefund && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-900 block">
                  🇺🇸 IRS Tax Season (April 15th)
                </span>
                <p className="text-[11px] text-amber-800">
                  File Form 1040 to claim work credits and deductions!
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playCash();
                  confetti({ particleCount: 60, spread: 60 });
                  const refund = Math.floor(Math.random() * 1200) + 800;
                  onClaimTaxRefund(refund);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                File 1040 Refund
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-slate-500 text-[10px]">
          Official Earnings Statement • Retain for Personal Income Tax Records
        </div>
      </div>
    </div>
  );
};
