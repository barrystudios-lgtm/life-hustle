import React, { useState } from 'react';
import { AvatarConfig, GameState, PlayerRegion } from '../types/game';
import { AvatarDisplay } from './AvatarDisplay';
import { createDefaultGameState } from '../utils/storage';
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
  Globe,
  Sliders,
  Scissors,
  Shirt,
  Crown
} from 'lucide-react';

interface Props {
  onComplete: (newState: GameState) => void;
  onCancel?: () => void;
}

export const CharacterCreator: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Mercer');
  const [country, setCountry] = useState('Nigeria');
  const [stateProvince, setStateProvince] = useState('Lagos');
  const [city, setCity] = useState('Lekki');
  const [region, setRegion] = useState<PlayerRegion>('NG');
  const [background, setBackground] = useState<'hustler' | 'grad' | 'dreamer' | 'trust_fund'>('hustler');

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

  const randomFirstNames = [
    'Alex', 'Jordan', 'Tokunbo', 'Marcus', 'Taylor', 'Avery', 
    'Chloe', 'Chase', 'Devon', 'Maya', 'Femi', 'Emeka', 'Zion', 'Kai'
  ];
  const randomLastNames = [
    'Mercer', 'Afolabi', 'Sterling', 'Vance', 'Lin', 'Adeyemi',
    'Okafor', 'Reed', 'Hayes', 'Brooks', 'Rivera', 'Cruz'
  ];

  const handleRandomName = () => {
    sound.playClick();
    const f = randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)];
    const l = randomLastNames[Math.floor(Math.random() * randomLastNames.length)];
    setFirstName(f);
    setLastName(l);
  };

  const skinTones = ['#fde2d1', '#f5d0b5', '#d4a373', '#a76a42', '#6b4226', '#3b2219'];
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
  const hairColors = ['#0f172a', '#3e2723', '#b45309', '#e2e8f0', '#dc2626', '#3b82f6'];
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
      description: 'Arrive with a hunger to win, sharp street instincts, and high resilience.',
      perks: '+$1,500 Cash • +20 Street Cred • High Energy',
      icon: '🔥',
    },
    {
      id: 'grad',
      title: 'University Graduate',
      description: 'Armed with a Bachelor of Science degree, ready for corporate & tech roles.',
      perks: 'CS Degree Unlocked • +25 Smarts • $18k Student Debt',
      icon: '🎓',
    },
    {
      id: 'dreamer',
      title: 'Small Town Dreamer',
      description: 'Packed one suitcase chasing greatness in the big metropolis.',
      perks: '+25 Happiness • +15 Health • $900 Cash',
      icon: '✨',
    },
    {
      id: 'trust_fund',
      title: 'High-Society Heir',
      description: 'Born with generational backing and high social expectations.',
      perks: '+$10,000 Cash • +20 Looks • +30 Cred',
      icon: '💎',
    },
  ];

  const handleStartLife = () => {
    sound.playLevelUp();
    confetti({ particleCount: 100, spread: 80 });

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Alex Mercer';
    const baseState = createDefaultGameState(fullName);

    baseState.player.name = fullName;
    baseState.player.firstName = firstName.trim();
    baseState.player.lastName = lastName.trim();
    baseState.player.country = country.trim();
    baseState.player.stateProvince = stateProvince.trim();
    baseState.player.city = city.trim();
    baseState.player.originCity = `${city.trim()}, ${stateProvince.trim()}, ${country.trim()}`;
    baseState.player.region = region;
    baseState.player.avatar = avatar;

    if (background === 'hustler') {
      baseState.player.cash = 1500;
      baseState.player.bankSavings = 800;
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
    onComplete(baseState);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Banner */}
        <div className="p-5 bg-gradient-to-r from-amber-600/30 via-slate-900 to-indigo-950/40 border-b border-amber-500/20 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
            ★ CHARACTER ATELIER & ORIGIN SETUP ★
          </span>
          <h2 className="text-2xl font-black text-white mt-1.5 font-sans">
            Create Your Character & Origin
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Customize full appearance (hair, beard, clothes, pants, shoes) and set your native country, state, and city.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Identity & Location Section */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
              1. Name, Country, State & City
            </span>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                  First Name
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleRandomName}
                    type="button"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400"
                    title="Randomize Name"
                  >
                    <Dice5 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Region & Top-Up Currency Selector */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                Top-Up Currency Region
              </label>
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
                  <span>🇳🇬 Nigeria</span>
                  <span className="text-[10px] font-mono">Naira (₦) Only</span>
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
                  <span>🇺🇸 USA / Global</span>
                  <span className="text-[10px] font-mono">USD ($) Only</span>
                </button>
              </div>
            </div>

            {/* Country, State, City */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Full Character Look Customization */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
              2. Complete Appearance & Style Studio
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Full Body Preview */}
              <AvatarDisplay avatar={avatar} size="full" showFullBody={true} className="shrink-0" />

              {/* Option Grids */}
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

                {/* Hairstyle */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Hair:</span>
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

                {/* Facial Hair */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Beard:</span>
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

                {/* Top Clothes */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Top / Jacket:</span>
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
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Pants:</span>
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
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Shoes:</span>
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

                {/* Bling / Accessories */}
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
          </div>

          {/* Background Story */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
              3. Starting Background Archetype
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
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/80 ring-1 ring-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{bg.icon}</span>
                      <h5 className="font-bold text-xs text-white">{bg.title}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {bg.description}
                    </p>
                    <div className="text-[10px] font-mono text-amber-400 font-bold mt-1.5">
                      {bg.perks}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {onCancel ? (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleStartLife}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer ml-auto"
          >
            <span>START AMERICAN JOURNEY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
