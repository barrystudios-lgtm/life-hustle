import React from 'react';
import { HOUSING_OPTIONS, VEHICLE_OPTIONS } from '../data/cityData';
import { House, Vehicle } from '../types/game';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Home, 
  Car, 
  DollarSign, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Key, 
  ShieldCheck,
  Building
} from 'lucide-react';

interface Props {
  currentHouseId: string;
  ownedVehicles: string[];
  selectedVehicleId: string;
  cash: number;
  onRentHouse: (house: House) => void;
  onBuyHouse: (house: House) => void;
  onBuyVehicle: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicleId: string) => void;
  onFurnishHome: () => void;
}

export const RealEstatePanel: React.FC<Props> = ({
  currentHouseId,
  ownedVehicles,
  selectedVehicleId,
  cash,
  onRentHouse,
  onBuyHouse,
  onBuyVehicle,
  onSelectVehicle,
  onFurnishHome,
}) => {
  const currentHouse = HOUSING_OPTIONS.find((h) => h.id === currentHouseId) || HOUSING_OPTIONS[0];

  return (
    <div className="space-y-6">
      {/* Current Residence Showcase */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {currentHouse.imageIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40">
                  Current Residence
                </span>
                <span className="text-xs text-slate-400">
                  📍 {currentHouse.district}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                {currentHouse.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Comfort level: <span className="text-amber-400 font-bold">{currentHouse.comfort}/100</span> • Prestige: <span className="text-purple-400 font-bold">{currentHouse.prestige}/100</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-xs font-mono text-slate-400">Weekly Rent / Upkeep</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              ${currentHouse.weeklyRent.toLocaleString()}<span className="text-xs text-slate-400">/wk</span>
            </span>
          </div>
        </div>

        {/* Upgrade / Decorate Action */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={() => {
              if (cash >= 400) {
                sound.playCash();
                onFurnishHome();
              } else {
                sound.playError();
              }
            }}
            disabled={cash < 400}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Furnish & Upgrade Interiors ($400 • +10 Happiness & Comfort)</span>
          </button>
        </div>
      </div>

      {/* Real Estate Market */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              Metropolis Real Estate Market
            </h4>
            <span className="text-xs text-slate-400">
              Lease apartments or buy deeds to build generational wealth
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {HOUSING_OPTIONS.map((house) => {
            const isCurrent = currentHouseId === house.id;

            return (
              <div
                key={house.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-cyan-950/20 border-cyan-500/50 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      {house.imageIcon}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-emerald-400">
                        ${house.weeklyRent.toLocaleString()}/wk
                      </div>
                      {house.purchasePrice && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Buy: ${house.purchasePrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <h5 className="font-bold text-sm text-white mt-3">{house.name}</h5>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    📍 {house.district}
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-mono text-[11px] text-yellow-400">
                      <Zap className="w-3.5 h-3.5" /> +{house.comfort} Comfort
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-purple-400">
                      <Sparkles className="w-3.5 h-3.5" /> +{house.prestige} Prestige
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  {isCurrent ? (
                    <div className="text-center py-2 text-xs font-bold text-cyan-400 bg-cyan-950/40 rounded-xl border border-cyan-800/30">
                      ✓ Current Home
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sound.playCash();
                          onRentHouse(house);
                        }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        Lease / Rent
                      </button>

                      {house.purchasePrice && (
                        <button
                          disabled={cash < house.purchasePrice}
                          onClick={() => {
                            sound.playCash();
                            confetti({ particleCount: 80, spread: 70 });
                            onBuyHouse(house);
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            cash >= house.purchasePrice
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Buy Deed
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vehicle Garage & Dealership */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              Garage & Motors Dealership
            </h4>
            <span className="text-xs text-slate-400">
              Vehicles grant street cred, reduce energy commute drain, and turn heads
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {VEHICLE_OPTIONS.map((veh) => {
            const isOwned = ownedVehicles.includes(veh.id);
            const isSelected = selectedVehicleId === veh.id;

            return (
              <div
                key={veh.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      {veh.icon}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-emerald-400">
                        ${veh.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Upkeep: ${veh.weeklyUpkeep}/wk
                      </div>
                    </div>
                  </div>

                  <h5 className="font-bold text-sm text-white mt-3">{veh.name}</h5>
                  <div className="text-xs text-amber-400 font-mono mt-0.5">
                    {veh.speedBonus}
                  </div>

                  {veh.credBonus > 0 && (
                    <div className="mt-2 text-xs font-mono text-cyan-400">
                      +{veh.credBonus} Street Cred Status
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  {isSelected ? (
                    <div className="text-center py-2 text-xs font-bold text-amber-400 bg-amber-500/15 rounded-xl border border-amber-500/30">
                      ★ Active Ride
                    </div>
                  ) : isOwned ? (
                    <button
                      onClick={() => {
                        sound.playCarRev();
                        onSelectVehicle(veh.id);
                      }}
                      className="w-full py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    >
                      Drive This Vehicle
                    </button>
                  ) : (
                    <button
                      disabled={cash < veh.price}
                      onClick={() => {
                        sound.playCarRev();
                        confetti({ particleCount: 60, spread: 60 });
                        onBuyVehicle(veh);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        cash >= veh.price
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Purchase (${veh.price.toLocaleString()})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
