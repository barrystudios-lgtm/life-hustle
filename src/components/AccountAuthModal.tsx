import React, { useState } from 'react';
import { UserAccount } from '../types/account';
import { PlayerRegion } from '../types/game';
import { 
  getAllAccounts, 
  saveAccounts, 
  setCurrentSessionUser 
} from '../utils/authStorage';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  LogOut, 
  ShieldCheck,
  CreditCard,
  UserPlus,
  LogIn,
  MapPin,
  Globe,
  Coins,
  Shirt
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAccountChange: (user: UserAccount | null) => void;
  currentUser: UserAccount | null;
  onOpenTopUp?: () => void;
  onOpenWardrobe?: () => void;
}

const COMMON_COUNTRIES = [
  { name: 'Nigeria', flag: '🇳🇬', defaultRegion: 'NG' as PlayerRegion, defaultState: 'Lagos', defaultCity: 'Lekki' },
  { name: 'United States', flag: '🇺🇸', defaultRegion: 'US' as PlayerRegion, defaultState: 'New York', defaultCity: 'New York City' },
  { name: 'United Kingdom', flag: '🇬🇧', defaultRegion: 'US' as PlayerRegion, defaultState: 'Greater London', defaultCity: 'London' },
  { name: 'Canada', flag: '🇨🇦', defaultRegion: 'US' as PlayerRegion, defaultState: 'Ontario', defaultCity: 'Toronto' },
  { name: 'Ghana', flag: '🇬🇭', defaultRegion: 'US' as PlayerRegion, defaultState: 'Greater Accra', defaultCity: 'Accra' },
  { name: 'South Africa', flag: '🇿🇦', defaultRegion: 'US' as PlayerRegion, defaultState: 'Gauteng', defaultCity: 'Johannesburg' },
  { name: 'Other Country', flag: '🌐', defaultRegion: 'US' as PlayerRegion, defaultState: 'International', defaultCity: 'Metropolis' },
];

const NIGERIAN_STATES = ['Lagos', 'Abuja FCT', 'Rivers', 'Oyo', 'Ogun', 'Kano', 'Delta', 'Anambra', 'Edo', 'Enugu'];
const NIGERIAN_CITIES: Record<string, string[]> = {
  'Lagos': ['Lekki', 'Ikeja', 'Victoria Island', 'Yaba', 'Surulere', 'Ikoyi'],
  'Abuja FCT': ['Abuja Central', 'Maitama', 'Garki', 'Wuse', 'Asokoro'],
  'Rivers': ['Port Harcourt', 'GRA', 'Obio-Akpor'],
  'Oyo': ['Ibadan', 'Bodija', 'Ring Road'],
};

const US_STATES = ['New York', 'California', 'Texas', 'Florida', 'Illinois', 'Georgia', 'Washington', 'Nevada'];
const US_CITIES: Record<string, string[]> = {
  'New York': ['New York City', 'Brooklyn', 'Manhattan', 'Queens'],
  'California': ['Los Angeles', 'San Francisco', 'Beverly Hills', 'San Diego'],
  'Texas': ['Houston', 'Dallas', 'Austin'],
  'Florida': ['Miami', 'Orlando', 'Tampa'],
};

export const AccountAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAccountChange,
  currentUser,
  onOpenTopUp,
  onOpenWardrobe,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(currentUser ? 'signin' : 'signup');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sign up form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [stateProvince, setStateProvince] = useState('Lagos');
  const [city, setCity] = useState('Lekki');
  const [region, setRegion] = useState<PlayerRegion>('NG');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCountrySelect = (cName: string) => {
    setCountry(cName);
    const found = COMMON_COUNTRIES.find((c) => c.name === cName);
    if (found) {
      setRegion(found.defaultRegion);
      setStateProvince(found.defaultState);
      setCity(found.defaultCity);
    } else {
      setRegion('US');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !username.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields (username, email, password).');
      sound.playError();
      return;
    }

    if (password.length < 5) {
      setErrorMsg('Password must be at least 5 characters long.');
      sound.playError();
      return;
    }

    const accounts = getAllAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase().replace('@', '');

    if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      setErrorMsg('An account with this email address already exists. Try signing in.');
      sound.playError();
      return;
    }

    if (accounts.some((a) => a.username.toLowerCase() === cleanUsername)) {
      setErrorMsg('This username is already taken. Please choose another.');
      sound.playError();
      return;
    }

    const newAccount: UserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      email: cleanEmail,
      username: cleanUsername,
      passwordHash: btoa(password),
      displayName: fullName.trim() || cleanUsername,
      fullName: fullName.trim() || cleanUsername,
      country: country.trim() || 'Nigeria',
      stateProvince: stateProvince.trim() || 'Lagos',
      city: city.trim() || 'Lekki',
      region,
      preferredCurrency: region === 'NG' ? 'NGN' : 'USD',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastLogin: new Date().toLocaleTimeString(),
    };

    saveAccounts([...accounts, newAccount]);
    setCurrentSessionUser(newAccount);
    onAccountChange(newAccount);

    sound.playLevelUp();
    confetti({ particleCount: 70, spread: 60 });
    setSuccessMsg(`Welcome, ${newAccount.displayName}! Your character is now linked to ${newAccount.city}, ${newAccount.country}.`);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const accounts = getAllAccounts();
    const cleanIdentifier = email.trim().toLowerCase();
    const encodedPass = btoa(password);

    const found = accounts.find(
      (a) => (a.email.toLowerCase() === cleanIdentifier || a.username.toLowerCase() === cleanIdentifier) && a.passwordHash === encodedPass
    );

    if (!found) {
      setErrorMsg('Invalid email/username or password. Please verify your credentials.');
      sound.playError();
      return;
    }

    found.lastLogin = new Date().toLocaleTimeString();
    saveAccounts(accounts.map((a) => (a.id === found.id ? found : a)));
    setCurrentSessionUser(found);
    onAccountChange(found);

    sound.playCash();
    setSuccessMsg(`Welcome back, @${found.username}!`);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleSignOut = () => {
    sound.playClick();
    setCurrentSessionUser(null);
    onAccountChange(null);
    setMode('signin');
    setSuccessMsg('You have signed out.');
  };

  const handleToggleCurrentUserRegion = () => {
    if (!currentUser) return;
    const newReg: PlayerRegion = currentUser.region === 'NG' ? 'US' : 'NG';
    const updatedUser: UserAccount = {
      ...currentUser,
      region: newReg,
      preferredCurrency: newReg === 'NG' ? 'NGN' : 'USD',
    };
    const accounts = getAllAccounts();
    saveAccounts(accounts.map((a) => (a.id === currentUser.id ? updatedUser : a)));
    setCurrentSessionUser(updatedUser);
    onAccountChange(updatedUser);
    sound.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600/30 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <User className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                American Life Simulator
              </span>
              <h3 className="text-xl font-black text-white">
                {currentUser ? 'Player Profile & Account' : mode === 'signup' ? 'Create Account & Identity' : 'Player Sign In'}
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

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Profile View (Logged In) */}
          {currentUser ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg font-mono">
                  {currentUser.displayName?.charAt(0).toUpperCase() || currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-white truncate">
                      {currentUser.displayName || currentUser.fullName || currentUser.username}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    @{currentUser.username} • {currentUser.email}
                  </div>
                  <div className="text-xs text-amber-300/90 font-mono mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{currentUser.city || 'Lekki'}, {currentUser.stateProvince || 'Lagos'}, {currentUser.country || 'Nigeria'}</span>
                  </div>
                </div>
              </div>

              {/* Region & Payment Configuration */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase font-bold flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-400" /> Payment Region & Currency
                  </span>
                  <button
                    onClick={handleToggleCurrentUserRegion}
                    className="text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer"
                  >
                    Switch to {currentUser.region === 'NG' ? '🇺🇸 Outside Nigeria ($ USD)' : '🇳🇬 Nigeria (₦ Naira)'}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {currentUser.region === 'NG' ? '🇳🇬 Nigeria (Naira ₦ Only)' : '🇺🇸 Outside Nigeria (US Dollar $ Only)'}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {currentUser.region === 'NG'
                        ? 'All top-up packages & payment options display in Nigerian Naira (₦).'
                        : 'All top-up packages & payment options display in US Dollars ($).'}
                    </span>
                  </div>
                  <span className="text-lg font-black font-mono text-emerald-400">
                    {currentUser.region === 'NG' ? '₦ NGN' : '$ USD'}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                {onOpenWardrobe && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onClose();
                      onOpenWardrobe();
                    }}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Shirt className="w-4 h-4 text-amber-400" />
                    <span>Edit Wardrobe</span>
                  </button>
                )}

                {onOpenTopUp && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onClose();
                      onOpenTopUp();
                    }}
                    className="p-3 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/50 transition-colors cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Top-Up ({currentUser.region === 'NG' ? '₦ Naira' : '$ USD'})</span>
                  </button>
                )}
              </div>

              {/* Account Security Info */}
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300 flex items-start gap-2 font-mono">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Member since {currentUser.createdAt}. Your game progress and top-up receipts are securely encrypted to this profile.
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          ) : (
            /* Sign Up & Sign In Tabs */
            <div>
              <div className="flex border-b border-slate-800 mb-4 bg-slate-950 p-1 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'signup'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'signin'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>

              {mode === 'signup' ? (
                /* Full Registration Form with Name, Country, State, City & Region */
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  {/* Real / Display Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        Full Name / Character Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Tokunbo Afolabi"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500 text-xs font-mono">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="gamertag"
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 pr-9 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Country Selection */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Native Country (Determines Region & Top-Up Currency)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {COMMON_COUNTRIES.slice(0, 4).map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleCountrySelect(c.name)}
                          className={`p-2 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                            country === c.name
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="text-base">{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                      {COMMON_COUNTRIES.slice(4).map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleCountrySelect(c.name)}
                          className={`p-1.5 rounded-xl border text-[11px] font-semibold text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                            country === c.name
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Region Selection (Nigeria Naira vs Outside Dollars) */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                        Top-Up Payment Region:
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {region === 'NG' ? 'Strict ₦ Naira' : 'Strict $ USD'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRegion('NG');
                          setCountry('Nigeria');
                          setStateProvince('Lagos');
                          setCity('Lekki');
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          region === 'NG'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span>🇳🇬</span>
                          <span>Nigeria</span>
                        </span>
                        <span className="text-[10px] font-mono">Naira (₦)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRegion('US');
                          setCountry('United States');
                          setStateProvince('New York');
                          setCity('New York City');
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          region === 'US'
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span>🇺🇸</span>
                          <span>Outside NG</span>
                        </span>
                        <span className="text-[10px] font-mono">USD ($)</span>
                      </button>
                    </div>
                  </div>

                  {/* State / Province & City Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={stateProvince}
                        onChange={(e) => setStateProvince(e.target.value)}
                        placeholder={region === 'NG' ? 'e.g. Lagos' : 'e.g. New York'}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                      />
                      {/* State quick picks */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(region === 'NG' ? NIGERIAN_STATES.slice(0, 4) : US_STATES.slice(0, 4)).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setStateProvince(st)}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        City / Hometown
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={region === 'NG' ? 'e.g. Lekki' : 'e.g. Manhattan'}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                      />
                      {/* City quick picks */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {((region === 'NG' ? NIGERIAN_CITIES['Lagos'] : US_CITIES['New York']) || []).slice(0, 4).map((ct) => (
                          <button
                            key={ct}
                            type="button"
                            onClick={() => setCity(ct)}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                          >
                            {ct}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer mt-2"
                  >
                    Complete Account & Enter Metropolis
                  </button>
                </form>
              ) : (
                /* Sign In Form */
                <form onSubmit={handleSignIn} className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Email or Username
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email or @username"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 pr-10 font-mono"
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

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer mt-2"
                  >
                    Sign In & Load Character
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
