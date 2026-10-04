import React, { useState, useEffect } from 'react';
import { 
  GameState, 
  LocationVenue, 
  VenueAction, 
  Job, 
  House, 
  Vehicle, 
  NPC, 
  LogEntry,
  PlayerRegion 
} from './types/game';
import { UserAccount } from './types/account';
import { 
  createDefaultGameState, 
  loadSavedGame, 
  saveGame,
  clearGameSave
} from './utils/storage';
import { 
  getCurrentSessionUser,
  setCurrentSessionUser
} from './utils/authStorage';
import { 
  CITY_LOCATIONS, 
  getCityLocations,
  INITIAL_JOBS, 
  HOUSING_OPTIONS, 
  VEHICLE_OPTIONS, 
  RANDOM_DILEMMAS 
} from './data/cityData';
import { sound } from './utils/sound';
import confetti from 'canvas-confetti';

import { StartMenu } from './components/StartMenu';
import { PlayerHeader } from './components/PlayerHeader';
import { CityMap } from './components/CityMap';
import { VenueModal } from './components/VenueModal';
import { PaystubModal } from './components/PaystubModal';
import { JobPanel } from './components/JobPanel';
import { RealEstatePanel } from './components/RealEstatePanel';
import { InvestPanel } from './components/InvestPanel';
import { SocialPanel } from './components/SocialPanel';
import { ChirperFeed } from './components/ChirperFeed';
import { CasinoModal } from './components/CasinoModal';
import { DilemmaModal } from './components/DilemmaModal';
import { LifeLogModal } from './components/LifeLogModal';
import { CharacterCreator } from './components/CharacterCreator';
import { StageOnboardingWizard } from './components/StageOnboardingWizard';
import { AccountAuthModal } from './components/AccountAuthModal';
import { TopUpStoreModal } from './components/TopUpStoreModal';
import { OwnerPayoutSettingsModal } from './components/OwnerPayoutSettingsModal';
import { WardrobeStudioModal } from './components/WardrobeStudioModal';

import { 
  MapPin, 
  Briefcase, 
  Home, 
  TrendingUp, 
  Users, 
  Radio, 
  BookOpen, 
  Dices, 
  Sparkles, 
  Receipt, 
  Coins,
  Scissors
} from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadSavedGame();
    const state = saved || createDefaultGameState('Alex Mercer');
    if (!state.dayTime) state.dayTime = 'afternoon';
    return state;
  });

  // Current logged in player account
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentSessionUser());

  // Start Up Menu state - true on initial launch
  const [inStartMenu, setInStartMenu] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<'map' | 'jobs' | 'housing' | 'invest' | 'social' | 'chirper'>('map');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<LocationVenue | null>(null);
  
  // Modals
  const [showWardrobeStudio, setShowWardrobeStudio] = useState<boolean>(false);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [showOwnerPayoutModal, setShowOwnerPayoutModal] = useState<boolean>(false);
  const [showPaystub, setShowPaystub] = useState<boolean>(false);
  const [showCasino, setShowCasino] = useState<boolean>(false);
  const [showLifeLog, setShowLifeLog] = useState<boolean>(false);
  const [showCharacterCreator, setShowCharacterCreator] = useState<boolean>(() => !getCurrentSessionUser());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save on state change
  useEffect(() => {
    saveGame(gameState);
  }, [gameState]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Recalculate player net worth
  const calculateNetWorth = (state: GameState): number => {
    const p = state.player;
    let portfolioVal = 0;
    Object.entries(p.portfolio).forEach(([sym, pos]) => {
      const stock = state.stocks.find((s) => s.symbol === sym);
      if (stock) {
        portfolioVal += pos.shares * stock.price;
      }
    });

    let realEstateVal = 0;
    const currentHouse = HOUSING_OPTIONS.find((h) => h.id === p.currentHouseId);
    if (currentHouse && currentHouse.owned && currentHouse.purchasePrice) {
      realEstateVal += currentHouse.purchasePrice;
    }

    return Math.round(p.cash + p.bankSavings + portfolioVal + realEstateVal - p.debt);
  };

  // Real Money Top-Up Success Handler
  const handleTopUpSuccess = (cashAmount: number) => {
    setGameState((prev) => {
      const p = { ...prev.player };
      p.cash += cashAmount;
      p.netWorth = calculateNetWorth({ ...prev, player: p });

      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Top-up successful! Added +$${cashAmount.toLocaleString()} In-Game Cash via real currency payment. Funds wired to operator settlement bank account.`,
            type: 'finance',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });

    showToast(`💰 Account credited with +$${cashAmount.toLocaleString()} Cash!`);
  };

  // ADVANCE WEEK TURN - Realistic American Taxes & Expenses
  const handleAdvanceWeek = () => {
    setGameState((prev) => {
      const p = { ...prev.player };
      const currentJob = INITIAL_JOBS.find((j) => j.id === p.currentJobId);
      const currentHouse = HOUSING_OPTIONS.find((h) => h.id === p.currentHouseId) || HOUSING_OPTIONS[0];

      // Time progression
      let newWeek = p.week + 1;
      let newYear = p.year;
      let newAge = p.age;
      if (newWeek > 52) {
        newWeek = 1;
        newYear += 1;
        newAge += 1;
        showToast(`🎉 Happy Birthday! You turned ${newAge} years old!`);
      }

      // 1. Realistic American W-2 Paycheck & Taxes
      let grossEarnings = 0;
      let totalTaxWithheld = 0;
      let netPaycheck = 0;

      if (currentJob) {
        grossEarnings = currentJob.weeklySalary;
        // Federal Income Tax (12%)
        const fedTax = Math.round(grossEarnings * 0.12);
        // State & Local Tax (5.5%)
        const stateTax = Math.round(grossEarnings * 0.055);
        // FICA (Social Security 6.2% + Medicare 1.45%) = 7.65%
        const fica = Math.round(grossEarnings * 0.0765);
        // Employer Health & Dental Copay
        const healthCopay = 35;

        totalTaxWithheld = fedTax + stateTax + fica + healthCopay;
        netPaycheck = Math.max(0, grossEarnings - totalTaxWithheld);

        // Direct deposit into bank
        p.bankSavings += netPaycheck;
      }

      // 2. Realistic American Living Expenses (Rent/Mortgage, Phone/5G, Groceries, Vehicle)
      let weeklyExpenses = currentHouse.owned ? 40 : currentHouse.weeklyRent;

      // Vehicles upkeep
      p.ownedVehicles.forEach((vId) => {
        const veh = VEHICLE_OPTIONS.find((v) => v.id === vId);
        if (veh) weeklyExpenses += veh.weeklyUpkeep;
      });

      // Phone & Unlimited 5G Data: $25/wk
      weeklyExpenses += 25;
      // Groceries & Bodega run: $85/wk
      weeklyExpenses += 85;

      // Deduct from bank savings first, then cash
      if (p.bankSavings >= weeklyExpenses) {
        p.bankSavings -= weeklyExpenses;
      } else {
        const remainder = weeklyExpenses - p.bankSavings;
        p.bankSavings = 0;
        p.cash = Math.max(0, p.cash - remainder);
      }

      // 3. High Yield Bank Interest (4.5% APY / 52)
      if (p.bankSavings > 0) {
        const interest = Math.round((p.bankSavings * 0.045) / 52);
        p.bankSavings += interest;
      }

      // 4. Update Stocks / Crypto Market
      const updatedStocks = prev.stocks.map((stock) => {
        const randomFactor = (Math.random() - 0.48) * stock.volatility * 2.5;
        const newPrice = Math.max(0.01, +(stock.price * (1 + randomFactor)).toFixed(2));
        const history = [...stock.history.slice(1), newPrice];
        const change24h = +(((newPrice - stock.history[stock.history.length - 1]) / stock.history[stock.history.length - 1]) * 100).toFixed(1);
        return {
          ...stock,
          price: newPrice,
          history,
          change24h,
        };
      });

      // 5. Stat adjustments
      const newStats = { ...p.stats };
      newStats.energy = Math.min(100, Math.round(newStats.energy + 30 + currentHouse.comfort * 0.6));
      newStats.hunger = Math.max(0, newStats.hunger - 20);
      if (newStats.hunger <= 10) {
        newStats.health = Math.max(10, newStats.health - 15);
        newStats.happiness = Math.max(10, newStats.happiness - 15);
      }
      if (p.cash + p.bankSavings > 200 && newStats.creditScore < 850) {
        newStats.creditScore = Math.min(850, newStats.creditScore + 3);
      }

      p.stats = newStats;
      p.week = newWeek;
      p.year = newYear;
      p.age = newAge;

      let tempState: GameState = {
        ...prev,
        player: p,
        stocks: updatedStocks,
      };
      p.netWorth = calculateNetWorth(tempState);

      // Random Dilemma Check (25% chance)
      let activeDilemma = prev.activeDilemma;
      if (!activeDilemma && Math.random() < 0.28) {
        const randomIndex = Math.floor(Math.random() * RANDOM_DILEMMAS.length);
        activeDilemma = RANDOM_DILEMMAS[randomIndex];
      }

      // April 15 Tax Season Event Check (Week 15)
      if (newWeek === 15) {
        showToast('🇺🇸 TAX SEASON: Form 1040 due April 15th! Check your W-2 Paystub.');
      }

      const newLogs = [
        {
          id: `log_turn_${Date.now()}`,
          week: newWeek,
          year: newYear,
          text: currentJob 
            ? `Week ${newWeek}: Gross earnings $${grossEarnings.toLocaleString()}. Taxes withheld $${totalTaxWithheld.toLocaleString()}. Net pay deposited $${netPaycheck.toLocaleString()}. Overhead paid $${weeklyExpenses}.`
            : `Week ${newWeek}: Survived another week in the city. Paid $${weeklyExpenses} living overhead.`,
          type: 'finance' as const,
          timestamp: 'Just now',
        },
        ...prev.logs,
      ].slice(0, 100);

      return {
        ...prev,
        player: p,
        stocks: updatedStocks,
        logs: newLogs,
        activeDilemma,
      };
    });

    showToast('📅 Advanced to next week! Paycheck deposited & expenses deducted.');
  };

  // Execute venue action
  const handleExecuteVenueAction = (action: VenueAction, venue: LocationVenue) => {
    if (action.customHandler) {
      if (action.customHandler === 'open_invest') {
        setSelectedVenue(null);
        setActiveTab('invest');
        return;
      }
      if (action.customHandler === 'open_jobs') {
        setSelectedVenue(null);
        setActiveTab('jobs');
        return;
      }
      if (action.customHandler === 'open_housing' || action.customHandler === 'open_vehicles') {
        setSelectedVenue(null);
        setActiveTab('housing');
        return;
      }
      if (action.customHandler === 'open_social') {
        setSelectedVenue(null);
        setActiveTab('social');
        return;
      }
      if (action.customHandler === 'open_blackjack' || action.customHandler === 'scratch_card') {
        setSelectedVenue(null);
        setShowCasino(true);
        return;
      }
      if (action.customHandler === 'busk_park') {
        const earnings = Math.floor(Math.random() * 90) + 30;
        setGameState((prev) => {
          const p = { ...prev.player };
          p.cash += earnings;
          p.stats.streetCred += 15;
          p.stats.energy = Math.max(0, p.stats.energy - 20);
          p.netWorth = calculateNetWorth({ ...prev, player: p });
          return {
            ...prev,
            player: p,
            logs: [
              {
                id: `log_${Date.now()}`,
                week: p.week,
                year: p.year,
                text: `Performed street music at Central Park. Made $${earnings} in cash tips!`,
                type: 'career',
                timestamp: 'Just now',
              },
              ...prev.logs,
            ],
          };
        });
        showToast(`🎵 Performed in Central Park! Made +$${earnings} tips!`);
        return;
      }
      if (action.customHandler === 'degree_cs' || action.customHandler === 'degree_fin') {
        const degreeName = action.customHandler === 'degree_cs' 
          ? 'Bachelor of Science (Computer Science)' 
          : 'Bachelor of Science (Finance & Economics)';
        
        if (gameState.player.cash < 4500) {
          showToast('❌ Not enough cash for tuition ($4,500 needed)');
          return;
        }

        setGameState((prev) => {
          const p = { ...prev.player };
          p.cash -= 4500;
          p.education = degreeName;
          p.stats.smarts = Math.min(100, p.stats.smarts + 25);
          p.stats.energy = Math.max(0, p.stats.energy - 40);
          p.netWorth = calculateNetWorth({ ...prev, player: p });
          return {
            ...prev,
            player: p,
            logs: [
              {
                id: `log_${Date.now()}`,
                week: p.week,
                year: p.year,
                text: `Graduated from Metro Ivy University with a ${degreeName}!`,
                type: 'event',
                timestamp: 'Just now',
              },
              ...prev.logs,
            ],
          };
        });
        sound.playLevelUp();
        confetti({ particleCount: 80, spread: 70 });
        showToast(`🎓 Graduated with ${degreeName}!`);
        return;
      }
    }

    // Standard stat impact
    setGameState((prev) => {
      const p = { ...prev.player };
      const s = { ...p.stats };

      if (action.cost && action.cost > 0) {
        p.cash = Math.max(0, p.cash - action.cost);
      }

      if (action.energyCost !== undefined) {
        s.energy = Math.min(100, Math.max(0, s.energy - action.energyCost));
      }

      if (action.statImpact) {
        if (action.statImpact.hunger !== undefined) s.hunger = Math.min(100, Math.max(0, s.hunger + action.statImpact.hunger));
        if (action.statImpact.happiness !== undefined) s.happiness = Math.min(100, Math.max(0, s.happiness + action.statImpact.happiness));
        if (action.statImpact.health !== undefined) s.health = Math.min(100, Math.max(0, s.health + action.statImpact.health));
        if (action.statImpact.smarts !== undefined) s.smarts = Math.min(100, Math.max(0, s.smarts + action.statImpact.smarts));
        if (action.statImpact.looks !== undefined) s.looks = Math.min(100, Math.max(0, s.looks + action.statImpact.looks));
        if (action.statImpact.streetCred !== undefined) s.streetCred = Math.max(0, s.streetCred + action.statImpact.streetCred);
        if (action.statImpact.creditScore !== undefined) s.creditScore = Math.min(850, Math.max(300, s.creditScore + action.statImpact.creditScore));
      }

      p.stats = s;
      p.netWorth = calculateNetWorth({ ...prev, player: p });

      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Visited ${venue.name}: ${action.label}.`,
            type: 'social',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });

    showToast(`✓ Completed: ${action.label}`);
    setSelectedVenue(null);
  };

  // Job Actions
  const handleApplyJob = (job: Job) => {
    setGameState((prev) => {
      const p = { ...prev.player };
      p.currentJobId = job.id;
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Signed employment contract as ${job.title} at ${job.companyName} ($${job.hourlyRate}/hr).`,
            type: 'career',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast(`🎉 Hired as ${job.title} at ${job.companyName}!`);
  };

  const handleQuitJob = () => {
    setGameState((prev) => {
      const p = { ...prev.player };
      p.currentJobId = null;
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: 'Resigned from your corporate position.',
            type: 'career',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast('Resigned from current job.');
  };

  const handleWorkShift = () => {
    const currentJob = INITIAL_JOBS.find((j) => j.id === gameState.player.currentJobId);
    if (!currentJob) return;

    const earnings = Math.round(currentJob.hourlyRate * 8);
    setGameState((prev) => {
      const p = { ...prev.player };
      p.cash += earnings;
      p.stats.energy = Math.max(0, p.stats.energy - 20);
      p.stats.streetCred += 2;
      p.netWorth = calculateNetWorth({ ...prev, player: p });
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Worked an extra 8-hour overtime shift. Made $${earnings} cash!`,
            type: 'career',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast(`💼 Worked overtime! +$${earnings} Cash earned.`);
  };

  const handleSideHustle = (type: 'rideshare' | 'sneakers' | 'dropship' | 'stream') => {
    setGameState((prev) => {
      const p = { ...prev.player };
      let logMsg = '';

      if (type === 'rideshare') {
        const earnings = Math.floor(Math.random() * 80) + 75;
        p.cash += earnings;
        p.stats.energy = Math.max(0, p.stats.energy - 15);
        logMsg = `Drove rideshare passengers across town. Earned $${earnings}.`;
      } else if (type === 'sneakers') {
        p.cash -= 100;
        p.stats.energy = Math.max(0, p.stats.energy - 15);
        const win = Math.random() < 0.75;
        if (win) {
          const revenue = Math.floor(Math.random() * 230) + 120;
          p.cash += revenue;
          logMsg = `Successfully flipped limited sneakers for $${revenue} (+$${revenue - 100} profit)!`;
          confetti({ particleCount: 40, spread: 50 });
        } else {
          logMsg = 'Sneaker prices dropped on StockX. Lost $100 inventory cost.';
        }
      } else if (type === 'dropship') {
        p.cash -= 250;
        p.stats.energy = Math.max(0, p.stats.energy - 20);
        const revenue = Math.floor(Math.random() * 500) + 300;
        p.cash += revenue;
        logMsg = `Ran TikTok ads for dropshipping shop. Generated $${revenue} sales (+$${revenue - 250} profit)!`;
      } else if (type === 'stream') {
        p.stats.energy = Math.max(0, p.stats.energy - 20);
        const newFollowers = Math.floor(Math.random() * 600) + 200;
        const tips = Math.floor(Math.random() * 60) + 20;
        p.followers += newFollowers;
        p.cash += tips;
        p.stats.streetCred += 10;
        logMsg = `Streamed live for 3 hours! Gained +${newFollowers} followers and $${tips} tips.`;
      }

      p.netWorth = calculateNetWorth({ ...prev, player: p });
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: logMsg,
            type: 'career',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });

    sound.playCash();
    showToast('⚡ Side hustle completed successfully!');
  };

  // Housing Actions
  const handleRentHouse = (house: House) => {
    setGameState((prev) => {
      const p = { ...prev.player };
      p.currentHouseId = house.id;
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Signed lease for ${house.name} in ${house.district} ($${house.weeklyRent}/wk).`,
            type: 'housing',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast(`🔑 Leased new home: ${house.name}!`);
  };

  const handleBuyHouse = (house: House) => {
    if (!house.purchasePrice) return;
    setGameState((prev) => {
      const p = { ...prev.player };
      p.cash -= house.purchasePrice!;
      p.currentHouseId = house.id;
      house.owned = true;
      p.netWorth = calculateNetWorth({ ...prev, player: p });
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Purchased property deed for ${house.name} for $${house.purchasePrice!.toLocaleString()}!`,
            type: 'housing',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast(`🏰 Property deed acquired: ${house.name}!`);
  };

  const handleBuyVehicle = (vehicle: Vehicle) => {
    setGameState((prev) => {
      const p = { ...prev.player };
      p.cash -= vehicle.price;
      p.ownedVehicles.push(vehicle.id);
      p.selectedVehicleId = vehicle.id;
      p.stats.streetCred += vehicle.credBonus;
      p.netWorth = calculateNetWorth({ ...prev, player: p });
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Bought ${vehicle.name} from Platinum Motors ($${vehicle.price.toLocaleString()})!`,
            type: 'event',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast(`🚗 Key in hand! Purchased ${vehicle.name}!`);
  };

  const handleFurnishHome = () => {
    setGameState((prev) => {
      const p = { ...prev.player };
      p.cash -= 400;
      p.stats.happiness = Math.min(100, p.stats.happiness + 15);
      p.stats.looks = Math.min(100, p.stats.looks + 5);
      p.netWorth = calculateNetWorth({ ...prev, player: p });
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: 'Upgraded interior furnishing with designer furniture and sound system.',
            type: 'housing',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast('✨ Home interior upgraded! +15 Happiness.');
  };

  // Stock Trading
  const handleBuyStock = (symbol: string, shares: number) => {
    const stock = gameState.stocks.find((s) => s.symbol === symbol);
    if (!stock) return;
    const cost = stock.price * shares;

    setGameState((prev) => {
      const p = { ...prev.player };
      p.cash -= cost;

      const currentPos = p.portfolio[symbol] || { symbol, shares: 0, avgBuyPrice: 0 };
      const totalShares = currentPos.shares + shares;
      const totalCost = currentPos.shares * currentPos.avgBuyPrice + cost;
      const avgBuyPrice = totalCost / totalShares;

      p.portfolio[symbol] = {
        symbol,
        shares: totalShares,
        avgBuyPrice,
      };

      p.netWorth = calculateNetWorth({ ...prev, player: p });
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Bought ${shares} shares of ${symbol} at $${stock.price}.`,
            type: 'finance',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast(`📈 Bought ${shares} ${symbol}!`);
  };

  const handleSellStock = (symbol: string, shares: number) => {
    const stock = gameState.stocks.find((s) => s.symbol === symbol);
    if (!stock) return;
    const revenue = stock.price * shares;

    setGameState((prev) => {
      const p = { ...prev.player };
      p.cash += revenue;

      const currentPos = p.portfolio[symbol];
      if (currentPos) {
        currentPos.shares -= shares;
        if (currentPos.shares <= 0) {
          delete p.portfolio[symbol];
        }
      }

      p.netWorth = calculateNetWorth({ ...prev, player: p });
      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Sold ${shares} shares of ${symbol} for $${revenue.toLocaleString()}.`,
            type: 'finance',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast(`📉 Sold ${shares} ${symbol} for $${revenue.toLocaleString()}!`);
  };

  const handleDepositBank = (amount: number) => {
    setGameState((prev) => {
      const p = { ...prev.player };
      p.cash -= amount;
      p.bankSavings += amount;
      return { ...prev, player: p };
    });
    showToast(`Deposited $${amount.toLocaleString()} into High-Yield Savings.`);
  };

  const handleWithdrawBank = (amount: number) => {
    setGameState((prev) => {
      const p = { ...prev.player };
      p.bankSavings -= amount;
      p.cash += amount;
      return { ...prev, player: p };
    });
    showToast(`Withdrew $${amount.toLocaleString()} to cash.`);
  };

  // Social & Dating Interactions
  const handleNpcInteract = (
    npcId: string, 
    actionType: 'chat' | 'coffee' | 'date' | 'gift' | 'flirt' | 'propose'
  ) => {
    setGameState((prev) => {
      const p = { ...prev.player };
      const relationships = prev.relationships.map((npc) => {
        if (npc.id !== npcId) return npc;
        const target = { ...npc };

        if (actionType === 'chat') {
          p.stats.energy = Math.max(0, p.stats.energy - 5);
          target.relationship = Math.min(100, target.relationship + 6);
          if (target.relationship >= 30 && target.status === 'Acquaintance') {
            target.status = 'Friend';
          }
        } else if (actionType === 'coffee') {
          p.cash -= 15;
          p.stats.energy = Math.max(0, p.stats.energy - 10);
          target.relationship = Math.min(100, target.relationship + 12);
        } else if (actionType === 'date') {
          p.cash -= 120;
          p.stats.energy = Math.max(0, p.stats.energy - 15);
          target.relationship = Math.min(100, target.relationship + 25);
          if (target.relationship >= 50 && target.status !== 'Spouse') {
            target.status = 'Crush';
          }
        } else if (actionType === 'gift') {
          p.cash -= 350;
          target.relationship = Math.min(100, target.relationship + 35);
        } else if (actionType === 'flirt') {
          p.stats.energy = Math.max(0, p.stats.energy - 15);
          if (target.relationship >= 45) {
            target.status = 'Dating';
            target.relationship = Math.min(100, target.relationship + 20);
            showToast(`❤️ ${target.name} agreed to be your partner! You are now Dating!`);
          } else {
            showToast(`😅 ${target.name} says they just see you as a friend for now.`);
          }
        } else if (actionType === 'propose') {
          p.cash -= 5000;
          target.status = 'Spouse';
          target.relationship = 100;
          p.stats.happiness = 100;
          p.stats.streetCred += 100;
          showToast(`💍 YES! ${target.name} accepted your proposal! You are Married!`);
        }

        return target;
      });

      return {
        ...prev,
        player: p,
        relationships,
      };
    });
  };

  // Chirper posting
  const handlePostChirp = (content: string) => {
    const newChirp = {
      id: `chirp_${Date.now()}`,
      author: gameState.player.name,
      handle: `@${gameState.player.name.replace(/\s+/g, '')}`,
      authorAvatar: '⭐',
      content,
      likes: Math.floor(Math.random() * 45) + 12,
      timeAgo: 'Just now',
      isPlayer: true,
    };

    setGameState((prev) => {
      const p = { ...prev.player };
      p.followers += Math.floor(Math.random() * 40) + 15;
      p.stats.streetCred += 5;

      return {
        ...prev,
        player: p,
        chirps: [newChirp, ...prev.chirps],
      };
    });
    showToast('📢 Posted to Chirper! Gained clout & followers.');
  };

  const handleLikeChirp = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      chirps: prev.chirps.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)),
    }));
  };

  // Dilemma resolution
  const handleDilemmaChoice = (optionIndex: number) => {
    const dilemma = gameState.activeDilemma;
    if (!dilemma) return;
    const option = dilemma.options[optionIndex];

    setGameState((prev) => {
      const p = { ...prev.player };

      if (option.cashChange) {
        p.cash = Math.max(0, p.cash + option.cashChange);
      }
      if (option.credChange) {
        p.stats.streetCred += option.credChange;
      }
      if (option.statChange) {
        if (option.statChange.energy !== undefined) p.stats.energy = Math.min(100, Math.max(0, p.stats.energy + option.statChange.energy));
        if (option.statChange.happiness !== undefined) p.stats.happiness = Math.min(100, Math.max(0, p.stats.happiness + option.statChange.happiness));
        if (option.statChange.smarts !== undefined) p.stats.smarts = Math.min(100, Math.max(0, p.stats.smarts + option.statChange.smarts));
        if (option.statChange.streetCred !== undefined) p.stats.streetCred = Math.max(0, p.stats.streetCred + option.statChange.streetCred);
      }

      p.netWorth = calculateNetWorth({ ...prev, player: p });

      return {
        ...prev,
        player: p,
        activeDilemma: null,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `Decision: ${dilemma.title} - ${option.text}. Outcome: ${option.effectText}`,
            type: 'event',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });

    showToast(`✓ Resolved: ${option.effectText}`);
  };

  // Tax refund claim
  const handleClaimTaxRefund = (refundAmount: number) => {
    setGameState((prev) => {
      const p = { ...prev.player };
      p.bankSavings += refundAmount;
      p.stats.happiness = Math.min(100, p.stats.happiness + 25);
      p.netWorth = calculateNetWorth({ ...prev, player: p });

      return {
        ...prev,
        player: p,
        logs: [
          {
            id: `log_${Date.now()}`,
            week: p.week,
            year: p.year,
            text: `IRS Tax Return processed: Received $${refundAmount.toLocaleString()} federal tax refund!`,
            type: 'finance',
            timestamp: 'Just now',
          },
          ...prev.logs,
        ],
      };
    });
    showToast(`💵 Claimed +$${refundAmount.toLocaleString()} IRS Tax Refund!`);
  };

  // Reset Game Data
  const handleResetData = () => {
    clearGameSave();
    const fresh = createDefaultGameState('Alex Mercer');
    setGameState(fresh);
    setInStartMenu(true);
    showToast('Saved data reset to brand new character.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/40 border border-amber-300 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Start Up Menu Overlay */}
      {inStartMenu && (
        <StartMenu
          gameState={gameState}
          onContinue={() => setInStartMenu(false)}
          onNewGame={() => setShowCharacterCreator(true)}
          onResetData={handleResetData}
          onToggleSound={() => {
            sound.enabled = !sound.enabled;
            setGameState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
          }}
          soundEnabled={gameState.soundEnabled}
          currentUser={currentUser}
          onOpenAccountModal={() => setShowAccountModal(true)}
          onOpenTopUpModal={() => setShowTopUpModal(true)}
          onOpenOwnerPayoutModal={() => setShowOwnerPayoutModal(true)}
        />
      )}

      {/* Top Status Header */}
      <PlayerHeader
        gameState={gameState}
        onAdvanceWeek={handleAdvanceWeek}
        onToggleSound={() => {
          sound.enabled = !sound.enabled;
          setGameState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
        }}
        onOpenNewLife={() => setShowCharacterCreator(true)}
        onOpenPaystub={() => setShowPaystub(true)}
        onOpenStartMenu={() => setInStartMenu(true)}
        currentUser={currentUser}
        onOpenAccountModal={() => setShowAccountModal(true)}
        onOpenTopUpModal={() => setShowTopUpModal(true)}
        onSwitchRegion={(newReg) => {
          setGameState((prev) => ({
            ...prev,
            player: { ...prev.player, region: newReg }
          }));
          showToast(`Region changed to ${newReg === 'NG' ? 'Nigeria (Naira ₦)' : 'Outside Nigeria (USD $)'}`);
        }}
      />

      {/* Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-[98px] sm:top-[74px] z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 flex items-center justify-between gap-1 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('map');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>City Map</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('jobs');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Jobs & Hustles</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('housing');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'housing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Homes & Cars</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('invest');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'invest'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Wall St & Crypto</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('social');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'social'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Social & Dating</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('chirper');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'chirper'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Chirper Feed</span>
          </button>

          <div className="flex items-center gap-1 border-l border-slate-800 pl-2 shrink-0">
            {/* Wardrobe & Style Studio Button */}
            <button
              onClick={() => {
                sound.playClick();
                setShowWardrobeStudio(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Full Character Customizer, Hair, Clothes & Shoes"
            >
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>Wardrobe</span>
            </button>

            {/* Top-up store quick button (Currency depends on region) */}
            <button
              onClick={() => {
                sound.playClick();
                setShowTopUpModal(true);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-950 to-slate-800 hover:from-emerald-900 hover:to-slate-700 text-emerald-400 border border-emerald-500/40 cursor-pointer transition-all shadow-sm"
              title={`Top Up In-Game Cash (${gameState.player.region === 'NG' ? '₦ Naira' : '$ USD'})`}
            >
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Top-Up ({gameState.player.region === 'NG' ? '₦ Naira' : '$ USD'})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowCasino(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-amber-950/60 text-amber-400 hover:border-amber-500/50 border border-transparent transition-all cursor-pointer"
            >
              <Dices className="w-4 h-4" />
              <span className="hidden sm:inline">Casino</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowLifeLog(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1">
        {activeTab === 'map' && (
          <div className="space-y-6">
            <CityMap
              onSelectVenue={(venue) => setSelectedVenue(venue)}
              dayTime={gameState.dayTime}
              currentLocationId={selectedVenue?.id}
              selectedDistrictFilter={districtFilter}
              onFilterChange={(f) => setDistrictFilter(f)}
              onTimeChange={(t) => setGameState((prev) => ({ ...prev, dayTime: t }))}
              playerRegion={gameState.player.region || 'NG'}
              playerCity={gameState.player.city || 'Lekki Phase 1'}
              playerCountry={gameState.player.country || 'Nigeria'}
              onTravelCity={(newCity, newReg) => {
                setGameState((prev) => {
                  const ctry = newReg === 'NG' ? 'Nigeria' : (prev.player.country === 'Nigeria' ? 'United States' : prev.player.country);
                  return {
                    ...prev,
                    player: {
                      ...prev.player,
                      city: newCity,
                      region: newReg,
                      country: ctry,
                      originCity: `${newCity}, ${ctry}`,
                    },
                  };
                });
                showToast(`🗺️ Switched to ${newCity} map! Local landmarks and venues loaded.`);
              }}
            />

            {/* Quick Hotspot Shortcuts Below Map (Localized for Player Location) */}
            {(() => {
              const currentLocs = getCityLocations(gameState.player.region || 'NG', gameState.player.city, gameState.player.country);
              const diner = currentLocs.find(l => l.id === 'joes_classic_diner') || currentLocs[4];
              const wallst = currentLocs.find(l => l.id === 'wall_street') || currentLocs[0];
              const gym = currentLocs.find(l => l.id === 'iron_gym') || currentLocs[5];
              const club = currentLocs.find(l => l.id === 'apex_rooftop_club') || currentLocs[3];

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {diner && (
                    <div 
                      onClick={() => setSelectedVenue(diner)}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer flex items-center gap-3"
                    >
                      <span className="text-2xl p-2 rounded-xl bg-amber-500/20">{diner.icon}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{diner.name}</h4>
                        <span className="text-[10px] text-slate-400 block truncate">{diner.district}</span>
                      </div>
                    </div>
                  )}

                  {wallst && (
                    <div 
                      onClick={() => setSelectedVenue(wallst)}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center gap-3"
                    >
                      <span className="text-2xl p-2 rounded-xl bg-emerald-500/20">{wallst.icon}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{wallst.name}</h4>
                        <span className="text-[10px] text-slate-400 block truncate">{wallst.district}</span>
                      </div>
                    </div>
                  )}

                  {gym && (
                    <div 
                      onClick={() => setSelectedVenue(gym)}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer flex items-center gap-3"
                    >
                      <span className="text-2xl p-2 rounded-xl bg-rose-500/20">{gym.icon}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{gym.name}</h4>
                        <span className="text-[10px] text-slate-400 block truncate">{gym.district}</span>
                      </div>
                    </div>
                  )}

                  {club && (
                    <div 
                      onClick={() => setSelectedVenue(club)}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer flex items-center gap-3"
                    >
                      <span className="text-2xl p-2 rounded-xl bg-purple-500/20">{club.icon}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{club.name}</h4>
                        <span className="text-[10px] text-slate-400 block truncate">{club.district}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'jobs' && (
          <JobPanel
            currentJobId={gameState.player.currentJobId}
            stats={gameState.player.stats}
            cash={gameState.player.cash}
            education={gameState.player.education}
            onApplyJob={handleApplyJob}
            onQuitJob={handleQuitJob}
            onWorkShift={handleWorkShift}
            onSideHustle={handleSideHustle}
          />
        )}

        {activeTab === 'housing' && (
          <RealEstatePanel
            currentHouseId={gameState.player.currentHouseId}
            ownedVehicles={gameState.player.ownedVehicles}
            selectedVehicleId={gameState.player.selectedVehicleId}
            cash={gameState.player.cash}
            onRentHouse={handleRentHouse}
            onBuyHouse={handleBuyHouse}
            onBuyVehicle={handleBuyVehicle}
            onSelectVehicle={(vId) => {
              setGameState((prev) => ({
                ...prev,
                player: { ...prev.player, selectedVehicleId: vId },
              }));
              showToast('🚗 Active vehicle updated.');
            }}
            onFurnishHome={handleFurnishHome}
          />
        )}

        {activeTab === 'invest' && (
          <InvestPanel
            stocks={gameState.stocks}
            portfolio={gameState.player.portfolio}
            cash={gameState.player.cash}
            bankSavings={gameState.player.bankSavings}
            onBuyStock={handleBuyStock}
            onSellStock={handleSellStock}
            onDepositBank={handleDepositBank}
            onWithdrawBank={handleWithdrawBank}
          />
        )}

        {activeTab === 'social' && (
          <SocialPanel
            relationships={gameState.relationships}
            stats={gameState.player.stats}
            cash={gameState.player.cash}
            onInteract={handleNpcInteract}
          />
        )}

        {activeTab === 'chirper' && (
          <ChirperFeed
            chirps={gameState.chirps}
            playerName={gameState.player.name}
            followers={gameState.player.followers}
            streetCred={gameState.player.stats.streetCred}
            onPostChirp={handlePostChirp}
            onLikeChirp={handleLikeChirp}
          />
        )}
      </main>

      {/* Venue Interaction Modal */}
      {selectedVenue && (
        <VenueModal
          venue={selectedVenue}
          playerCash={gameState.player.cash}
          playerEnergy={gameState.player.stats.energy}
          onClose={() => setSelectedVenue(null)}
          onExecuteAction={handleExecuteVenueAction}
        />
      )}

      {/* W-2 Paystub & Tax Breakdown Modal */}
      {showPaystub && (
        <PaystubModal
          gameState={gameState}
          onClose={() => setShowPaystub(false)}
          onClaimTaxRefund={handleClaimTaxRefund}
        />
      )}

      {/* Wardrobe & Character Customizer Modal */}
      {showWardrobeStudio && (
        <WardrobeStudioModal
          isOpen={showWardrobeStudio}
          onClose={() => setShowWardrobeStudio(false)}
          avatar={gameState.player.avatar}
          playerCash={gameState.player.cash}
          playerRegion={gameState.player.region || 'NG'}
          country={gameState.player.country || 'Nigeria'}
          stateProvince={gameState.player.stateProvince || 'Lagos'}
          city={gameState.player.city || 'Lekki'}
          firstName={gameState.player.firstName || gameState.player.name.split(' ')[0] || 'Alex'}
          lastName={gameState.player.lastName || gameState.player.name.split(' ')[1] || 'Mercer'}
          unlockedWardrobeItems={gameState.player.unlockedWardrobeItems || []}
          onSaveAvatar={(newAvatar) => {
            setGameState((prev) => ({
              ...prev,
              player: { ...prev.player, avatar: newAvatar }
            }));
            showToast('✨ Appearance updated successfully!');
          }}
          onSaveIdentity={(identity) => {
            setGameState((prev) => {
              const fullName = `${identity.firstName} ${identity.lastName}`.trim();
              return {
                ...prev,
                player: {
                  ...prev.player,
                  name: fullName,
                  firstName: identity.firstName,
                  lastName: identity.lastName,
                  country: identity.country,
                  stateProvince: identity.stateProvince,
                  city: identity.city,
                  originCity: `${identity.city}, ${identity.stateProvince}, ${identity.country}`,
                  region: identity.region,
                }
              };
            });
            showToast(`📍 Identity updated: ${identity.city}, ${identity.country} (${identity.region === 'NG' ? '₦ Naira' : '$ USD'})`);
          }}
          onUnlockPremiumItem={(itemId, cost) => {
            if (gameState.player.cash < cost) {
              showToast('❌ Not enough in-game cash! Top-Up to unlock.');
              return false;
            }
            setGameState((prev) => {
              const p = { ...prev.player };
              p.cash -= cost;
              p.unlockedWardrobeItems = [...(p.unlockedWardrobeItems || []), itemId];
              p.stats.streetCred += 25;
              p.stats.looks = Math.min(100, p.stats.looks + 10);
              p.netWorth = calculateNetWorth({ ...prev, player: p });
              return {
                ...prev,
                player: p,
                logs: [
                  {
                    id: `log_${Date.now()}`,
                    week: p.week,
                    year: p.year,
                    text: `Unlocked exclusive premium piece (${itemId}) for $${cost.toLocaleString()}!`,
                    type: 'event',
                    timestamp: 'Just now',
                  },
                  ...prev.logs,
                ],
              };
            });
            showToast('👑 Premium wardrobe piece unlocked!');
            return true;
          }}
          onOpenTopUp={() => setShowTopUpModal(true)}
        />
      )}

      {/* Account Creation & Authentication Modal */}
      {showAccountModal && (
        <AccountAuthModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          onAccountChange={(user) => {
            setCurrentUser(user);
            if (user) {
              setGameState((prev) => {
                const reg = user.region || (user.preferredCurrency === 'USD' ? 'US' : 'NG');
                const ctry = user.country || prev.player.country;
                const st = user.stateProvince || prev.player.stateProvince;
                const ct = user.city || prev.player.city;
                return {
                  ...prev,
                  player: {
                    ...prev.player,
                    name: user.displayName || user.fullName || user.username,
                    country: ctry,
                    stateProvince: st,
                    city: ct,
                    originCity: `${ct}, ${st}, ${ctry}`,
                    region: reg,
                  },
                };
              });
            }
          }}
          currentUser={currentUser}
          onOpenTopUp={() => setShowTopUpModal(true)}
          onOpenWardrobe={() => setShowWardrobeStudio(true)}
        />
      )}

      {/* Top-Up Currency Store Modal (Region-Strict: Naira in NG, USD outside) */}
      {showTopUpModal && (
        <TopUpStoreModal
          isOpen={showTopUpModal}
          onClose={() => setShowTopUpModal(false)}
          onTopUpSuccess={handleTopUpSuccess}
          playerRegion={gameState.player.region || 'NG'}
          onSwitchRegion={(newReg) => {
            setGameState((prev) => ({
              ...prev,
              player: { ...prev.player, region: newReg }
            }));
            showToast(`Region changed to ${newReg === 'NG' ? 'Nigeria (Naira ₦)' : 'International (USD $)'}`);
          }}
          userEmail={currentUser?.email || 'player@americanlife.sim'}
          userId={currentUser?.id || 'usr_guest'}
        />
      )}

      {/* Owner Bank Settlement Settings Modal */}
      {showOwnerPayoutModal && (
        <OwnerPayoutSettingsModal
          isOpen={showOwnerPayoutModal}
          onClose={() => setShowOwnerPayoutModal(false)}
        />
      )}

      {/* Casino Modal */}
      {showCasino && (
        <CasinoModal
          playerCash={gameState.player.cash}
          onClose={() => setShowCasino(false)}
          onWin={(amount) => {
            setGameState((prev) => {
              const p = { ...prev.player };
              p.cash += amount;
              p.stats.happiness = Math.min(100, p.stats.happiness + 20);
              p.netWorth = calculateNetWorth({ ...prev, player: p });
              return {
                ...prev,
                player: p,
                logs: [
                  {
                    id: `log_${Date.now()}`,
                    week: p.week,
                    year: p.year,
                    text: `Won $${amount.toLocaleString()} at the Diamond Horseshoe Casino!`,
                    type: 'finance',
                    timestamp: 'Just now',
                  },
                  ...prev.logs,
                ],
              };
            });
            showToast(`🎰 Won $${amount.toLocaleString()} at the Casino!`);
          }}
          onLoss={(amount) => {
            setGameState((prev) => {
              const p = { ...prev.player };
              p.cash = Math.max(0, p.cash - amount);
              p.netWorth = calculateNetWorth({ ...prev, player: p });
              return { ...prev, player: p };
            });
          }}
        />
      )}

      {/* Life Dilemma Modal */}
      {gameState.activeDilemma && (
        <DilemmaModal
          dilemma={gameState.activeDilemma}
          onChoose={handleDilemmaChoice}
        />
      )}

      {/* Life Chronicle Modal */}
      {showLifeLog && (
        <LifeLogModal
          gameState={gameState}
          onClose={() => setShowLifeLog(false)}
        />
      )}

      {/* Stage-by-Stage Onboarding Wizard */}
      {showCharacterCreator && (
        <StageOnboardingWizard
          initialUser={currentUser}
          onComplete={(newState, userAccount) => {
            setGameState(newState);
            setCurrentUser(userAccount);
            setShowCharacterCreator(false);
            setInStartMenu(false);
            showToast(`🚀 Welcome to ${newState.player.city}, ${newState.player.name}!`);
          }}
          onCancel={() => setShowCharacterCreator(false)}
        />
      )}
    </div>
  );
}
