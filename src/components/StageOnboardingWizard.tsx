import React, { useState } from 'react';
import { AvatarConfig, GameState, PlayerRegion } from '../types/game';
import { UserAccount } from '../types/account';
import { AvatarDisplay } from './AvatarDisplay';
import { createDefaultGameState } from '../utils/storage';
import { getAllAccounts, saveAccounts, setCurrentSessionUser } from '../utils/authStorage';
import { getAvailableMapsForLocation } from '../data/cityData';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Dice5, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  DollarSign, 
  User,
  ArrowRight,
  ArrowLeft,
  Globe,
  Sliders,
  Scissors,
  Shirt,
  Crown,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Coins,
  ShieldCheck,
  Calendar,
  Lock,
  Mail,
  Play
} from 'lucide-react';

interface Props {
  onComplete: (newState: GameState, userAccount: UserAccount) => void;
  onCancel?: () => void;
  initialUser?: UserAccount | null;
}

type OnboardingStage = 'registration' | 'region' | 'age_persona' | 'location' | 'character_style' | 'review_start';

const COMMON_COUNTRIES = [
  { name: 'Nigeria', flag: '🇳🇬', defaultRegion: 'NG' as PlayerRegion, defaultState: 'Lagos', defaultCity: 'Lekki' },
  { name: 'United States', flag: '🇺🇸', defaultRegion: 'US' as PlayerRegion, defaultState: 'New York', defaultCity: 'New York City' },
  { name: 'United Kingdom', flag: '🇬🇧', defaultRegion: 'US' as PlayerRegion, defaultState: 'Greater London', defaultCity: 'London' },
  { name: 'Canada', flag: '🇨🇦', defaultRegion: 'US' as PlayerRegion, defaultState: 'Ontario', defaultCity: 'Toronto' },
  { name: 'Ghana', flag: '🇬🇭', defaultRegion: 'US' as PlayerRegion, defaultState: 'Greater Accra', defaultCity: 'Accra' },
  { name: 'South Africa', flag: '🇿🇦', defaultRegion: 'US' as PlayerRegion, defaultState: 'Gauteng', defaultCity: 'Johannesburg' },
  { name: 'Other Country', flag: '🌐', defaultRegion: 'US' as PlayerRegion, defaultState: 'California', defaultCity: 'Los Angeles' },
];

const NIGERIAN_STATES = ['Lagos', 'Abuja FCT', 'Rivers', 'Oyo', 'Ogun', 'Kano', 'Delta', 'Anambra', 'Edo', 'Enugu'];
const NIGERIAN_CITIES: Record<string, string[]> = {
  'Lagos': ['Lekki Phase 1', 'Victoria Island', 'Ikeja GRA', 'Marina Island', 'Yaba Tech Valley', 'Surulere'],
  'Abuja FCT': ['Abuja Central', 'Maitama', 'Garki', 'Wuse 2', 'Asokoro'],
  'Rivers': ['Port Harcourt GRA', 'Old GRA', 'Trans-Amadi'],
  'Oyo': ['Ibadan Bodija', 'Ring Road', 'Agodi GRA'],
};

const US_STATES = ['New York', 'California', 'Texas', 'Florida', 'Illinois', 'Georgia', 'Washington', 'Nevada'];
const US_CITIES: Record<string, string[]> = {
  'New York': ['Manhattan', 'Brooklyn', 'Queens', 'Williamsburg'],
  'California': ['Los Angeles', 'San Francisco', 'Beverly Hills', 'Silicon Valley'],
  'Texas': ['Houston', 'Dallas', 'Austin Downtown'],
  'Florida': ['Miami Beach', 'Brickell', 'Orlando'],
};

export const StageOnboardingWizard: React.FC<Props> = ({
  onComplete,
  onCancel,
  initialUser,
}) => {
  // Wizard Stages
  const [currentStage, setCurrentStage] = useState<OnboardingStage>('registration');
  const [stageError, setStageError] = useState<string | null>(null);

  // Stage 1: Registration fields
  const [fullName, setFullName] = useState(initialUser?.displayName || initialUser?.fullName || 'Alex Mercer');
  const [username, setUsername] = useState(initialUser?.username || 'alex_mercer');
  const [email, setEmail] = useState(initialUser?.email || 'alex@americanlife.sim');
  const [password, setPassword] = useState('secret123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);

  // Stage 2: Region Selection
  const [region, setRegion] = useState<PlayerRegion>(initialUser?.region || 'NG');

  // Stage 3: Age & Background Persona
  const [age, setAge] = useState<number>(21);
  const [background, setBackground] = useState<'hustler' | 'grad' | 'dreamer' | 'trust_fund'>('hustler');

  // Stage 4: Location
  const [country, setCountry] = useState(initialUser?.country || (region === 'NG' ? 'Nigeria' : 'United States'));
  const [stateProvince, setStateProvince] = useState(initialUser?.stateProvince || (region === 'NG' ? 'Lagos' : 'New York'));
  const [city, setCity] = useState(initialUser?.city || (region === 'NG' ? 'Lekki Phase 1' : 'Manhattan'));

  // Stage 5: Character Customization
  const [avatar, setAvatar] = useState<AvatarConfig>({
    gender: 'male',
    skinTone: '#a76a42',
    hairStyle: 'fade',
    hairColor: '#0f172a',
    facialHair: 'stubble',
    clothing: 'hoodie',
    clothingColor: '#1e293b',
    pants: 'jeans',
    pantsColor: '#1e3a8a',
    shoes: 'white_sneakers',
    shoesColor: '#f8fafc',
    accessory: 'gold_chain',
    expression: 'confident',
  });

  const skinTones = ['#fde2d1', '#f5d0b5', '#d4a373', '#a76a42', '#6b4226', '#3b2219'];
  const hairColors = ['#0f172a', '#3e2723', '#b45309', '#e2e8f0', '#dc2626', '#3b82f6'];

  const hairStyles = [
    { id: 'fade', name: 'Fade' },
    { id: 'waves', name: 'Waves' },
    { id: 'dreads', name: 'Dreads' },
    { id: 'afro', name: 'Afro' },
    { id: 'curly', name: 'Curly' },
    { id: 'buzz', name: 'Buzz' },
    { id: 'slick', name: 'Slick' },
    { id: 'platinum_braids', name: '👑 Platinum Braids', isPremium: true },
  ];

  const facialHairOptions = [
    { id: 'none', name: 'Clean' },
    { id: 'stubble', name: 'Stubble' },
    { id: 'full_beard', name: 'Beard' },
    { id: 'goatee', name: 'Goatee' },
    { id: 'mustache', name: 'Mustache' },
  ];

  const tops = [
    { id: 'hoodie', name: 'Hoodie' },
    { id: 'tshirt', name: 'Tee' },
    { id: 'leather', name: 'Leather' },
    { id: 'suit', name: 'Suit' },
    { id: 'designer_tracksuit', name: '👑 Tracksuit', isPremium: true },
    { id: 'silk_blazer', name: '👑 Silk Blazer', isPremium: true },
    { id: 'gold_embroidered', name: '👑 24K Gold', isPremium: true },
  ];

  const pants = [
    { id: 'jeans', name: 'Jeans' },
    { id: 'cargos', name: 'Cargos' },
    { id: 'sweats', name: 'Sweats' },
    { id: 'tailored', name: 'Tailored' },
    { id: 'leather_pants', name: '👑 Leather Pants', isPremium: true },
  ];

  const shoes = [
    { id: 'white_sneakers', name: 'Sneakers' },
    { id: 'high_tops', name: 'Jordans' },
    { id: 'chelsea_boots', name: 'Boots' },
    { id: 'oxfords', name: 'Oxfords' },
    { id: 'luxury_loafers', name: '👑 Gold Loafers', isPremium: true },
  ];

  const accessories = [
    { id: 'none', name: 'None' },
    { id: 'gold_chain', name: 'Gold Chain' },
    { id: 'airpods', name: 'AirPods' },
    { id: 'sunglasses', name: 'Shades' },
    { id: 'glasses', name: 'Specs' },
    { id: 'snapback', name: 'Snapback' },
    { id: 'diamond_chain', name: '👑 Diamond Chain', isPremium: true },
    { id: 'rolex_watch', name: '👑 Gold Watch', isPremium: true },
  ];

  const backgrounds = [
    {
      id: 'hustler',
      title: 'Ambitious Hustler',
      description: 'Street-smart instinct, high endurance, ready to grind to the top.',
      perks: '+$1,500 Cash • +20 Street Cred • 100 Energy',
      icon: '🔥',
    },
    {
      id: 'grad',
      title: 'University Graduate',
      description: 'Computer Science degree in hand, ready for high-paying engineering roles.',
      perks: 'CS Degree Unlocked • +25 Smarts • $18k Student Debt',
      icon: '🎓',
    },
    {
      id: 'dreamer',
      title: 'Small Town Dreamer',
      description: 'Arrived with one backpack, pure enthusiasm, and unwavering optimism.',
      perks: '+25 Happiness • +15 Health • $900 Cash',
      icon: '✨',
    },
    {
      id: 'trust_fund',
      title: 'High-Society Heir',
      description: 'Generational wealth backing, high social expectations and luxury taste.',
      perks: '+$10,000 Cash • +20 Looks • +30 Cred',
      icon: '💎',
    },
  ];

  const stepsList: { id: OnboardingStage; label: string; number: number }[] = [
    { id: 'registration', label: '1. Account Registration', number: 1 },
    { id: 'region', label: '2. Select Region', number: 2 },
    { id: 'age_persona', label: '3. Age & Background', number: 3 },
    { id: 'location', label: '4. Location & Map', number: 4 },
    { id: 'character_style', label: '5. Character Style', number: 5 },
    { id: 'review_start', label: '6. Review & Launch', number: 6 },
  ];

  // Stage Navigation Handlers
  const handleNextFromRegistration = () => {
    setStageError(null);
    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setStageError('Please fill in all registration fields.');
      sound.playError();
      return;
    }
    if (password.length < 5) {
      setStageError('Password must be at least 5 characters long.');
      sound.playError();
      return;
    }
    sound.playClick();
    setCurrentStage('region');
  };

  const handleNextFromRegion = () => {
    sound.playClick();
    // Update default locations if changing region
    if (region === 'NG') {
      setCountry('Nigeria');
      setStateProvince('Lagos');
      setCity('Lekki Phase 1');
    } else {
      setCountry('United States');
      setStateProvince('New York');
      setCity('Manhattan');
    }
    setCurrentStage('age_persona');
  };

  const handleNextFromAgePersona = () => {
    sound.playClick();
    setCurrentStage('location');
  };

  const handleNextFromLocation = () => {
    setStageError(null);
    if (!country.trim() || !stateProvince.trim() || !city.trim()) {
      setStageError('Please specify Country, State, and City.');
      sound.playError();
      return;
    }
    sound.playClick();
    setCurrentStage('character_style');
  };

  const handleNextFromCharacterStyle = () => {
    sound.playLevelUp();
    setCurrentStage('review_start');
  };

  const handleFinalStartGame = () => {
    sound.playCasinoWin();
    confetti({ particleCount: 120, spread: 80 });

    const cleanUsername = username.trim().toLowerCase().replace('@', '');
    const cleanEmail = email.trim().toLowerCase();

    // 1. Create or update User Account
    const existingAccounts = getAllAccounts();
    let account = existingAccounts.find((a) => a.username.toLowerCase() === cleanUsername || a.email.toLowerCase() === cleanEmail);

    if (!account) {
      account = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        email: cleanEmail,
        username: cleanUsername,
        passwordHash: btoa(password),
        displayName: fullName.trim(),
        fullName: fullName.trim(),
        country: country.trim(),
        stateProvince: stateProvince.trim(),
        city: city.trim(),
        region,
        preferredCurrency: region === 'NG' ? 'NGN' : 'USD',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastLogin: new Date().toLocaleTimeString(),
      };
      saveAccounts([...existingAccounts, account]);
    } else {
      account.displayName = fullName.trim();
      account.country = country.trim();
      account.stateProvince = stateProvince.trim();
      account.city = city.trim();
      account.region = region;
      account.preferredCurrency = region === 'NG' ? 'NGN' : 'USD';
      saveAccounts(existingAccounts.map((a) => (a.id === account!.id ? account! : a)));
    }

    setCurrentSessionUser(account);

    // 2. Initialize GameState
    const baseState = createDefaultGameState(fullName.trim());
    baseState.player.name = fullName.trim();
    baseState.player.age = age;
    baseState.player.country = country.trim();
    baseState.player.stateProvince = stateProvince.trim();
    baseState.player.city = city.trim();
    baseState.player.originCity = `${city.trim()}, ${stateProvince.trim()}, ${country.trim()}`;
    baseState.player.region = region;
    baseState.player.avatar = avatar;

    if (background === 'hustler') {
      baseState.player.cash = 1500;
      baseState.player.bankSavings = 500;
      baseState.player.stats.streetCred = 45;
    } else if (background === 'grad') {
      baseState.player.education = 'Bachelor of Science (Computer Science)';
      baseState.player.stats.smarts = 65;
      baseState.player.debt = 18000;
      baseState.player.cash = 1000;
    } else if (background === 'dreamer') {
      baseState.player.cash = 900;
      baseState.player.stats.happiness = 95;
      baseState.player.stats.health = 95;
    } else if (background === 'trust_fund') {
      baseState.player.cash = 10000;
      baseState.player.bankSavings = 5000;
      baseState.player.stats.looks = 85;
      baseState.player.stats.streetCred = 60;
    }

    baseState.player.netWorth = baseState.player.cash + baseState.player.bankSavings - baseState.player.debt;

    onComplete(baseState, account);
  };

  const handleRandomizeName = () => {
    sound.playClick();
    const firsts = ['Alex', 'Tokunbo', 'Jordan', 'Marcus', 'Devon', 'Femi', 'Emeka', 'Kai', 'Chloe', 'Zion'];
    const lasts = ['Afolabi', 'Mercer', 'Sterling', 'Adeyemi', 'Vance', 'Okafor', 'Hayes', 'Brooks', 'Rivera'];
    const f = firsts[Math.floor(Math.random() * firsts.length)];
    const l = lasts[Math.floor(Math.random() * lasts.length)];
    setFullName(`${f} ${l}`);
    setUsername(`${f.toLowerCase()}_${l.toLowerCase()}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Top Stepper Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600/30 via-slate-900 to-indigo-950/40 border-b border-amber-500/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-lg">
                ★
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Stage-by-Stage Onboarding
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {currentStage === 'registration' && 'Step 1: Account Registration & Credentials'}
                  {currentStage === 'region' && 'Step 2: Choose Economic Region & Currency'}
                  {currentStage === 'age_persona' && 'Step 3: Choose Age & Life Archetype'}
                  {currentStage === 'location' && 'Step 4: Choose Native Location & City Map'}
                  {currentStage === 'character_style' && 'Step 5: Full Character Atelier & Wardrobe'}
                  {currentStage === 'review_start' && 'Step 6: Metropolis Passport & Launch Game'}
                </h2>
              </div>
            </div>

            {onCancel && (
              <button
                onClick={onCancel}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                Exit
              </button>
            )}
          </div>

          {/* Stepper Progress Indicator */}
          <div className="grid grid-cols-6 gap-1.5 pt-1">
            {stepsList.map((step) => {
              const active = currentStage === step.id;
              const stepIndex = stepsList.findIndex((s) => s.id === step.id);
              const currentIndex = stepsList.findIndex((s) => s.id === currentStage);
              const completed = stepIndex < currentIndex;

              return (
                <div
                  key={step.id}
                  className={`h-1.5 rounded-full transition-all ${
                    active
                      ? 'bg-amber-400 ring-2 ring-amber-400/40'
                      : completed
                      ? 'bg-emerald-500'
                      : 'bg-slate-800'
                  }`}
                  title={step.label}
                />
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {stageError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{stageError}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 1: REGISTRATION FIRST                                  */}
          {/* ============================================================ */}
          {currentStage === 'registration' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    Account Registration & Identity
                  </h3>
                  {/* Mode Switcher */}
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-mono font-bold">
                    <button
                      type="button"
                      onClick={() => setIsSignInMode(false)}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        !isSignInMode ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      New Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSignInMode(true)}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        isSignInMode ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {isSignInMode 
                    ? 'Welcome back! Choose an existing character profile or enter your credentials to resume.'
                    : 'Create your player identity. Your progress, real estate deeds, and wallet balance will be securely tied to this account.'}
                </p>
              </div>

              {/* Sign In Mode: Show Existing Local Accounts */}
              {isSignInMode ? (
                <div className="space-y-3">
                  {getAllAccounts().length > 0 ? (
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                        Select Existing Character Profile:
                      </span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {getAllAccounts().map((acc) => (
                          <div
                            key={acc.id}
                            onClick={() => {
                              sound.playClick();
                              setFullName(acc.displayName || acc.fullName || acc.username);
                              setUsername(acc.username);
                              setEmail(acc.email);
                              if (acc.region) setRegion(acc.region);
                              if (acc.country) setCountry(acc.country);
                              if (acc.stateProvince) setStateProvince(acc.stateProvince);
                              if (acc.city) setCity(acc.city);
                              setIsSignInMode(false);
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              username === acc.username
                                ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{acc.region === 'NG' ? '🇳🇬' : '🇺🇸'}</span>
                              <div>
                                <h4 className="text-xs font-bold text-white">{acc.displayName || acc.username}</h4>
                                <span className="text-[10px] text-slate-400 font-mono">@{acc.username} • {acc.email}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                              Load Profile
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs text-slate-400">
                      No saved profiles found on this browser. Please register a new account below.
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSignInMode(false)}
                      className="text-xs text-amber-400 hover:underline font-mono"
                    >
                      ← Back to Create New Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-mono text-slate-400 uppercase block">
                        Character Full Name
                      </label>
                      <button
                        type="button"
                        onClick={handleRandomizeName}
                        className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Dice5 className="w-3.5 h-3.5" /> Randomize
                      </button>
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tokunbo Afolabi or Alex Mercer"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                      Username (Gamertag)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs font-mono">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="player@email.com"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleNextFromRegistration}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Continue to Step 2: Choose Region</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 2: CHOOSE REGION                                       */}
          {/* ============================================================ */}
          {currentStage === 'region' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Select Your Payment & Gameplay Region
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The region you select sets your native top-up currency and determines whether payment options are strictly in Naira (₦) or Dollars ($).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nigeria Region Card */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setRegion('NG');
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    region === 'NG'
                      ? 'bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">🇳🇬</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        NAIRA (₦) ONLY
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-white">Nigeria Region</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Top up strictly in <span className="text-emerald-400 font-bold font-mono">Nigerian Naira (₦)</span> with ₦1,000 = $100 In-Game Cash.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                      <div>• Payment: Direct Bank Wire to Operator, USSD, Verve</div>
                      <div>• Loaded Map: Lagos & Lekki Island Metropolis Grid</div>
                      <div>• Currency: Strictly ₦ NGN in store</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono">₦1,000 = $100 Game Cash</span>
                    <span className={`text-xs px-3 py-1 rounded-xl font-bold ${region === 'NG' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {region === 'NG' ? 'Selected ✓' : 'Select'}
                    </span>
                  </div>
                </div>

                {/* Outside Nigeria (USD) Card */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setRegion('US');
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    region === 'US'
                      ? 'bg-gradient-to-br from-blue-950/60 to-slate-900 border-blue-500 ring-2 ring-blue-500/40 shadow-xl'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">🇺🇸</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        USD ($) ONLY
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-white">Outside Nigeria / Global</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Top up strictly in <span className="text-blue-400 font-bold font-mono">US Dollars ($)</span> with $1.00 USD = $100 In-Game Cash.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                      <div>• Payment: Stripe Card, Apple Pay, PayPal, Wire</div>
                      <div>• Loaded Map: New York & American Metropolis Grid</div>
                      <div>• Currency: Strictly $ USD in store</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 font-mono">$1.00 USD = $100 Game Cash</span>
                    <span className={`text-xs px-3 py-1 rounded-xl font-bold ${region === 'US' ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {region === 'US' ? 'Selected ✓' : 'Select'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStage('registration')}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromRegion}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Next: Choose Age & Life Persona</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 3: AGE & BACKGROUND PERSONA                            */}
          {/* ============================================================ */}
          {currentStage === 'age_persona' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Select Starting Age & Background Story
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Choose how old you are when arriving in the metropolis, and pick your starting life archetype.
                </p>
              </div>

              {/* Age Slider & Presets */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Character Age:
                  </span>
                  <span className="text-lg font-black font-mono text-amber-400 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                    {age} Years Old
                  </span>
                </div>

                <input
                  type="range"
                  min="18"
                  max="45"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>18 (Fresh Out of School)</span>
                  <span>21 (Prime Ambition)</span>
                  <span>30 (Experienced)</span>
                  <span>45 (Seasoned)</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[18, 21, 25, 28, 32, 35].map((presetAge) => (
                    <button
                      key={presetAge}
                      type="button"
                      onClick={() => setAge(presetAge)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        age === presetAge
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {presetAge} yrs
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Archetype Cards */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                  Select Starting Archetype:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {backgrounds.map((bg) => {
                    const isSelected = background === bg.id;

                    return (
                      <div
                        key={bg.id}
                        onClick={() => {
                          sound.playClick();
                          setBackground(bg.id as typeof background);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{bg.icon}</span>
                          <div>
                            <h4 className="text-xs font-black text-white">{bg.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{bg.description}</p>
                          </div>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-emerald-400 font-bold">
                          {bg.perks}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStage('region')}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromAgePersona}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Next: Choose Native Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 4: LOCATION (COUNTRY, STATE, CITY)                    */}
          {/* ============================================================ */}
          {currentStage === 'location' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Choose Your Native Location & City Map
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The city you select will be loaded directly into your game map with authentic local landmarks and commercial venues.
                </p>
              </div>

              {/* Country Selection */}
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                  Country
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(region === 'NG' ? COMMON_COUNTRIES : COMMON_COUNTRIES.slice(1)).map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setCountry(c.name);
                        setStateProvince(c.defaultState);
                        setCity(c.defaultCity);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center gap-2 ${
                        country === c.name
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* State & City Inputs with Localized Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={stateProvince}
                    onChange={(e) => setStateProvince(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans font-bold"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(region === 'NG' ? NIGERIAN_STATES : US_STATES).slice(0, 5).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setStateProvince(st);
                          const cityPicks = region === 'NG' ? NIGERIAN_CITIES[st] : US_CITIES[st];
                          if (cityPicks && cityPicks[0]) setCity(cityPicks[0]);
                        }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                    City / Neighborhood (Map Grid)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans font-bold"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(region === 'NG'
                      ? NIGERIAN_CITIES[stateProvince] || NIGERIAN_CITIES['Lagos']
                      : US_CITIES[stateProvince] || US_CITIES['New York']
                    ).map((ct) => (
                      <button
                        key={ct}
                        type="button"
                        onClick={() => setCity(ct)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      >
                        {ct}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Preview Banner */}
              {(() => {
                const availableMaps = getAvailableMapsForLocation(region, country);
                const activeMap = availableMaps.find(m => 
                  city.toLowerCase().includes(m.cityName.toLowerCase()) || 
                  city.toLowerCase().includes(m.id) ||
                  stateProvince.toLowerCase().includes(m.stateProvince.toLowerCase())
                ) || availableMaps[0];

                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                          Assigned Map Grid for Your Location
                        </span>
                        <div className="text-base font-black text-white font-sans mt-0.5">
                          {activeMap.title}
                        </div>
                        <div className="text-xs text-slate-300 font-mono mt-0.5">
                          {activeMap.subtitle}
                        </div>
                      </div>
                      <div className="text-3xl shrink-0">
                        {activeMap.flag}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-slate-400 font-mono">Mapped Landmarks:</span>
                      {activeMap.landmarks.map((lm) => (
                        <span key={lm} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-amber-300 border border-slate-700/60">
                          {lm}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStage('age_persona')}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromLocation}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Next: Style Character & Wardrobe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 5: CHARACTER CUSTOMIZATION (HAIR, CLOTHES, SHOES)     */}
          {/* ============================================================ */}
          {currentStage === 'character_style' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  Character Atelier & Wardrobe Styling
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Customize your hairstyle, beard, outfits, and shoes. Premium luxury pieces are marked with <span className="text-amber-400 font-bold font-mono">👑</span>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Full Body Preview */}
                <AvatarDisplay avatar={avatar} size="full" showFullBody={true} className="shrink-0" />

                {/* Customizer Tabs */}
                <div className="flex-1 w-full space-y-3">
                  {/* Skin Tone */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Skin Tone:</span>
                    <div className="flex items-center gap-2">
                      {skinTones.map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setAvatar({ ...avatar, skinTone: tone })}
                          style={{ backgroundColor: tone }}
                          className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                            avatar.skinTone === tone ? 'scale-125 ring-2 ring-amber-400' : 'opacity-80 hover:scale-110'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hair Style */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Hairstyle:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {hairStyles.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => setAvatar({ ...avatar, hairStyle: h.id })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            avatar.hairStyle === h.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-300 hover:text-white'
                          }`}
                        >
                          {h.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Beard */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Beard & Facial Hair:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {facialHairOptions.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setAvatar({ ...avatar, facialHair: f.id })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            avatar.facialHair === f.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-300 hover:text-white'
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tops */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Tops & Jackets:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tops.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setAvatar({ ...avatar, clothing: t.id })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            avatar.clothing === t.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-300 hover:text-white'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pants */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Pants & Trousers:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pants.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setAvatar({ ...avatar, pants: p.id })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            avatar.pants === p.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-300 hover:text-white'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shoes */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Shoes & Footwear:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {shoes.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setAvatar({ ...avatar, shoes: s.id })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            avatar.shoes === s.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-300 hover:text-white'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accessories */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Bling & Accessories:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {accessories.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setAvatar({ ...avatar, accessory: a.id })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            avatar.accessory === a.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-300 hover:text-white'
                          }`}
                        >
                          {a.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStage('location')}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromCharacterStyle}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Next: Review Passport & Start Game</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 6: FINAL REVIEW & START GAME                           */}
          {/* ============================================================ */}
          {currentStage === 'review_start' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Official Citizen Passport Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌟</span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                        OFFICIAL CITIZEN PASSPORT
                      </span>
                      <h4 className="text-base font-black text-white font-sans">
                        Metropolis Life Simulation
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    READY FOR DISPATCH
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
                  <AvatarDisplay avatar={avatar} size="lg" className="shrink-0" />

                  <div className="flex-1 grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Name</span>
                      <span className="font-bold text-white text-sm truncate block">{fullName}</span>
                      <span className="text-[10px] text-slate-400">@{username}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Age & Archetype</span>
                      <span className="font-bold text-amber-400 text-sm block">Age {age}</span>
                      <span className="text-[10px] text-slate-300 capitalize">{background.replace('_', ' ')}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Native Location</span>
                      <span className="font-bold text-white block truncate">{city}</span>
                      <span className="text-[10px] text-slate-400 truncate block">{stateProvince}, {country}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Region & Currency</span>
                      <span className="font-bold text-emerald-400 block">
                        {region === 'NG' ? '🇳🇬 Nigeria (₦ NGN)' : '🇺🇸 USA / Global ($ USD)'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {region === 'NG' ? '₦1,000 = $100 Cash' : '$1.00 = $100 Cash'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Map Grid Assignment Notice */}
                {(() => {
                  const availableMaps = getAvailableMapsForLocation(region, country);
                  const activeMap = availableMaps.find(m => 
                    city.toLowerCase().includes(m.cityName.toLowerCase()) || 
                    city.toLowerCase().includes(m.id) ||
                    stateProvince.toLowerCase().includes(m.stateProvince.toLowerCase())
                  ) || availableMaps[0];

                  return (
                    <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Assigned City Map Grid:</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1.5">
                          <span>{activeMap.flag}</span>
                          <span>{activeMap.title.replace(/^[^\s]+\s*/, '')}</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 items-center pt-1 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-500">Local Landmarks:</span>
                        {activeMap.landmarks.map((lm) => (
                          <span key={lm} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300">
                            {lm}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Start Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStage('character_style')}
                  className="px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Style</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalStartGame}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-600 hover:from-emerald-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>START GAME & ENTER {city.toUpperCase()} MAP 🚀</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
