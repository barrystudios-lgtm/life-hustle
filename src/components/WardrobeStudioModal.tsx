import React, { useState } from 'react';
import { AvatarConfig, PlayerRegion } from '../types/game';
import { AvatarDisplay } from './AvatarDisplay';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  X, 
  Crown, 
  Lock, 
  Check, 
  Scissors, 
  Shirt, 
  Coins, 
  DollarSign, 
  MapPin, 
  User, 
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  avatar: AvatarConfig;
  playerCash: number;
  playerRegion: PlayerRegion;
  country: string;
  stateProvince: string;
  city: string;
  firstName: string;
  lastName: string;
  unlockedWardrobeItems: string[];
  onSaveAvatar: (newAvatar: AvatarConfig) => void;
  onSaveIdentity: (identity: {
    firstName: string;
    lastName: string;
    country: string;
    stateProvince: string;
    city: string;
    region: PlayerRegion;
  }) => void;
  onUnlockPremiumItem: (itemId: string, cost: number) => boolean;
  onOpenTopUp: () => void;
}

export const WardrobeStudioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  avatar,
  playerCash,
  playerRegion,
  country,
  stateProvince,
  city,
  firstName,
  lastName,
  unlockedWardrobeItems,
  onSaveAvatar,
  onSaveIdentity,
  onUnlockPremiumItem,
  onOpenTopUp,
}) => {
  const [activeTab, setActiveTab] = useState<'hair' | 'clothes' | 'pants' | 'shoes' | 'accessories' | 'identity'>('clothes');
  const [currentAvatar, setCurrentAvatar] = useState<AvatarConfig>({ ...avatar });

  // Identity Form states
  const [cCountry, setCCountry] = useState(country || 'Nigeria');
  const [cState, setCState] = useState(stateProvince || 'Lagos');
  const [cCity, setCCity] = useState(city || 'Lekki');
  const [cFirst, setCFirst] = useState(firstName || 'Alex');
  const [cLast, setCLast] = useState(lastName || 'Mercer');
  const [cRegion, setCRegion] = useState<PlayerRegion>(playerRegion || 'NG');
  const [promptTopUpItem, setPromptTopUpItem] = useState<{ name: string; price: number } | null>(null);

  if (!isOpen) return null;

  const skinTones = ['#fde2d1', '#f5d0b5', '#d4a373', '#a76a42', '#6b4226', '#3b2219'];
  const hairColors = ['#0f172a', '#3e2723', '#b45309', '#e2e8f0', '#dc2626', '#3b82f6'];

  // Wardrobe Catalog
  const hairCatalog = [
    { id: 'hair_fade', name: 'Clean Skin Fade', style: 'fade' },
    { id: 'hair_waves', name: '360 Silk Waves', style: 'waves' },
    { id: 'hair_dreads', name: 'Urban Dreadlocks', style: 'dreads' },
    { id: 'hair_afro', name: 'Natural Afro', style: 'afro' },
    { id: 'hair_curly', name: 'Curly High-Top', style: 'curly' },
    { id: 'hair_buzz', name: 'Military Buzz', style: 'buzz' },
    { id: 'hair_slick', name: 'Wall St Slick', style: 'slick' },
    { id: 'hair_platinum_braids', name: 'Platinum Box Braids', style: 'platinum_braids', isPremium: true, price: 300 },
  ];

  const facialHairCatalog = [
    { id: 'none', name: 'Clean Shaven' },
    { id: 'stubble', name: '5 O’Clock Stubble' },
    { id: 'full_beard', name: 'Full Groomed Beard' },
    { id: 'goatee', name: 'Sharp Goatee' },
    { id: 'mustache', name: 'Classic Mustache' },
  ];

  const topsCatalog = [
    { id: 'top_hoodie', name: 'Streetwear Hoodie', style: 'hoodie' },
    { id: 'top_tshirt', name: 'Classic Cotton Tee', style: 'tshirt' },
    { id: 'top_leather', name: 'Biker Leather Jacket', style: 'leather' },
    { id: 'top_suit', name: 'Corporate Business Suit', style: 'suit' },
    { id: 'top_designer_tracksuit', name: 'Milan Designer Tracksuit', style: 'designer_tracksuit', isPremium: true, price: 350 },
    { id: 'top_silk_blazer', name: 'Italian Silk Blazer', style: 'silk_blazer', isPremium: true, price: 650 },
    { id: 'top_gold_embroidered', name: '24K Gold Embroidered Jacket', style: 'gold_embroidered', isPremium: true, price: 1500 },
  ];

  const pantsCatalog = [
    { id: 'pants_jeans', name: 'Slim Denim Jeans', style: 'jeans' },
    { id: 'pants_cargos', name: 'Urban Cargo Pants', style: 'cargos' },
    { id: 'pants_sweats', name: 'Heavy Cotton Sweats', style: 'sweats' },
    { id: 'pants_tailored', name: 'Tailored Trousers', style: 'tailored' },
    { id: 'pants_leather_pants', name: 'Custom Leather Trousers', style: 'leather_pants', isPremium: true, price: 400 },
  ];

  const shoesCatalog = [
    { id: 'shoes_white_sneakers', name: 'Triple White Lows', style: 'white_sneakers' },
    { id: 'shoes_high_tops', name: 'Retro High-Top Jordans', style: 'high_tops' },
    { id: 'shoes_chelsea_boots', name: 'Suede Chelsea Boots', style: 'chelsea_boots' },
    { id: 'shoes_oxfords', name: 'Italian Oxford Dress Shoes', style: 'oxfords' },
    { id: 'shoes_luxury_loafers', name: 'Red Carpet Gold Bit Loafers', style: 'luxury_loafers', isPremium: true, price: 550 },
  ];

  const accessoriesCatalog = [
    { id: 'none', name: 'No Accessories', style: 'none' },
    { id: 'acc_gold_chain', name: '14K Gold Cuban Chain', style: 'gold_chain' },
    { id: 'acc_airpods', name: 'AirPods Pro', style: 'airpods' },
    { id: 'acc_glasses', name: 'Tortoise Specs', style: 'glasses' },
    { id: 'acc_sunglasses', name: 'Dark Aviators', style: 'sunglasses' },
    { id: 'acc_snapback', name: 'Empire Snapback Cap', style: 'snapback' },
    { id: 'acc_diamond_chain', name: 'VVS Diamond Tennis Chain', style: 'diamond_chain', isPremium: true, price: 2200 },
    { id: 'acc_rolex_watch', name: 'Presidential Gold Watch', style: 'rolex_watch', isPremium: true, price: 4500 },
  ];

  const handleSelectItem = (
    category: 'hair' | 'facialHair' | 'clothes' | 'pants' | 'shoes' | 'accessories',
    itemId: string,
    styleValue: string,
    isPremium?: boolean,
    price?: number
  ) => {
    sound.playClick();

    // Check if premium and not unlocked
    if (isPremium && price && !unlockedWardrobeItems.includes(itemId)) {
      if (playerCash < price) {
        sound.playError();
        setPromptTopUpItem({ name: itemId, price });
        return;
      }

      // Buy premium item with in-game cash
      const success = onUnlockPremiumItem(itemId, price);
      if (!success) return;
      sound.playLevelUp();
      confetti({ particleCount: 50, spread: 60 });
    }

    // Apply to current avatar
    if (category === 'hair') {
      setCurrentAvatar({ ...currentAvatar, hairStyle: styleValue });
    } else if (category === 'facialHair') {
      setCurrentAvatar({ ...currentAvatar, facialHair: styleValue });
    } else if (category === 'clothes') {
      setCurrentAvatar({ ...currentAvatar, clothing: styleValue });
    } else if (category === 'pants') {
      setCurrentAvatar({ ...currentAvatar, pants: styleValue });
    } else if (category === 'shoes') {
      setCurrentAvatar({ ...currentAvatar, shoes: styleValue });
    } else if (category === 'accessories') {
      setCurrentAvatar({ ...currentAvatar, accessory: styleValue });
    }
  };

  const handleSaveAll = () => {
    sound.playCash();
    onSaveAvatar(currentAvatar);
    onSaveIdentity({
      firstName: cFirst.trim() || 'Alex',
      lastName: cLast.trim() || 'Mercer',
      country: cCountry.trim(),
      stateProvince: cState.trim(),
      city: cCity.trim(),
      region: cRegion,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600/30 via-slate-900 to-indigo-950/40 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-2xl">
              ✂️
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Metropolis Atelier & Style Studio
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Character Customizer & Wardrobe
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply Style</span>
            </button>

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
        </div>

        {/* Studio Body: Left Avatar Display, Right Customization Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Full-Body Preview Card */}
          <div className="md:col-span-5 p-5 bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-3">
              Full-Body Look
            </span>

            <AvatarDisplay avatar={currentAvatar} size="full" showFullBody={true} className="shadow-2xl" />

            {/* Quick Wallet Bar */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 w-full max-w-xs flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Your Cash:</span>
              <span className="font-bold text-emerald-400 text-sm">${playerCash.toLocaleString()}</span>
              <button
                onClick={onOpenTopUp}
                className="px-2 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold"
              >
                + Top-Up ({playerRegion === 'NG' ? '₦' : '$'})
              </button>
            </div>
          </div>

          {/* Right Column: Style Options & Identity */}
          <div className="md:col-span-7 flex flex-col overflow-hidden">
            {/* Category Navigation Pills */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-1 overflow-x-auto scrollbar-none">
              {[
                { id: 'clothes', label: 'Tops', icon: Shirt },
                { id: 'pants', label: 'Pants', icon: Sliders },
                { id: 'shoes', label: 'Shoes', icon: Crown },
                { id: 'hair', label: 'Hair & Beard', icon: Scissors },
                { id: 'accessories', label: 'Bling', icon: Sparkles },
                { id: 'identity', label: 'Identity & Origin', icon: MapPin },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id as typeof activeTab);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Customization Options Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* --- TOPS & CLOTHES TAB --- */}
              {activeTab === 'clothes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400">
                      Tops, Blazers & Jackets
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      ⭐ Premium items boost street prestige
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {topsCatalog.map((item) => {
                      const isSelected = currentAvatar.clothing === item.style;
                      const isUnlocked = !item.isPremium || unlockedWardrobeItems.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem('clothes', item.id, item.style, item.isPremium, item.price)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30 text-white'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs">{item.name}</span>
                              {item.isPremium && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase flex items-center gap-0.5">
                                  <Crown className="w-2.5 h-2.5" /> PREMIUM
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {isSelected ? '✓ Equipped' : isUnlocked ? 'Unlocked' : `Locked • $${item.price?.toLocaleString()}`}
                            </span>
                          </div>

                          {!isUnlocked && (
                            <span className="p-1 rounded-lg bg-slate-800 text-amber-400">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- PANTS TAB --- */}
              {activeTab === 'pants' && (
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                    Pants & Bottoms
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pantsCatalog.map((item) => {
                      const isSelected = currentAvatar.pants === item.style;
                      const isUnlocked = !item.isPremium || unlockedWardrobeItems.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem('pants', item.id, item.style, item.isPremium, item.price)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30 text-white'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs">{item.name}</span>
                              {item.isPremium && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase flex items-center gap-0.5">
                                  <Crown className="w-2.5 h-2.5" /> PREMIUM
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {isSelected ? '✓ Equipped' : isUnlocked ? 'Unlocked' : `Locked • $${item.price?.toLocaleString()}`}
                            </span>
                          </div>

                          {!isUnlocked && (
                            <span className="p-1 rounded-lg bg-slate-800 text-amber-400">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- SHOES TAB --- */}
              {activeTab === 'shoes' && (
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                    Shoes & Luxury Footwear
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {shoesCatalog.map((item) => {
                      const isSelected = currentAvatar.shoes === item.style;
                      const isUnlocked = !item.isPremium || unlockedWardrobeItems.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem('shoes', item.id, item.style, item.isPremium, item.price)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30 text-white'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs">{item.name}</span>
                              {item.isPremium && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase flex items-center gap-0.5">
                                  <Crown className="w-2.5 h-2.5" /> PREMIUM
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {isSelected ? '✓ Equipped' : isUnlocked ? 'Unlocked' : `Locked • $${item.price?.toLocaleString()}`}
                            </span>
                          </div>

                          {!isUnlocked && (
                            <span className="p-1 rounded-lg bg-slate-800 text-amber-400">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- HAIR & BEARD TAB --- */}
              {activeTab === 'hair' && (
                <div className="space-y-4">
                  {/* Skin Tone Palette */}
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                      Skin Tone:
                    </span>
                    <div className="flex items-center gap-2">
                      {skinTones.map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setCurrentAvatar({ ...currentAvatar, skinTone: tone })}
                          style={{ backgroundColor: tone }}
                          className={`w-7 h-7 rounded-full transition-transform cursor-pointer border ${
                            currentAvatar.skinTone === tone ? 'scale-125 ring-2 ring-amber-400' : 'opacity-80 hover:scale-110'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hair Style */}
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                      Hairstyle:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {hairCatalog.map((item) => {
                        const isSelected = currentAvatar.hairStyle === item.style;
                        const isUnlocked = !item.isPremium || unlockedWardrobeItems.includes(item.id);

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectItem('hair', item.id, item.style, item.isPremium, item.price)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="truncate">{item.name}</span>
                            {!isUnlocked && <Lock className="w-3 h-3 text-amber-400" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Facial Hair / Beard */}
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                      Facial Hair & Beard:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {facialHairCatalog.map((item) => {
                        const isSelected = currentAvatar.facialHair === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setCurrentAvatar({ ...currentAvatar, facialHair: item.id })}
                            className={`p-2 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* --- ACCESSORIES TAB --- */}
              {activeTab === 'accessories' && (
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                    Bling & High-Roller Accessories
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {accessoriesCatalog.map((item) => {
                      const isSelected = currentAvatar.accessory === item.style;
                      const isUnlocked = !item.isPremium || unlockedWardrobeItems.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem('accessories', item.id, item.style, item.isPremium, item.price)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30 text-white'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs">{item.name}</span>
                              {item.isPremium && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase flex items-center gap-0.5">
                                  <Crown className="w-2.5 h-2.5" /> PREMIUM
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {isSelected ? '✓ Equipped' : isUnlocked ? 'Unlocked' : `Locked • $${item.price?.toLocaleString()}`}
                            </span>
                          </div>

                          {!isUnlocked && (
                            <span className="p-1 rounded-lg bg-slate-800 text-amber-400">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- IDENTITY & ORIGIN TAB --- */}
              {activeTab === 'identity' && (
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                    Name, Country, State & City of Origin
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={cFirst}
                        onChange={(e) => setCFirst(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={cLast}
                        onChange={(e) => setCLast(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                      Country of Origin & Currency Region
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCRegion('NG');
                          setCCountry('Nigeria');
                          setCState('Lagos');
                          setCCity('Lekki');
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          cRegion === 'NG'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>🇳🇬 Nigeria</span>
                        <span className="text-[10px] font-mono">Naira (₦) Top-Up</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCRegion('US');
                          setCCountry('United States');
                          setCState('New York');
                          setCCity('New York City');
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          cRegion === 'US'
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>🇺🇸 USA / International</span>
                        <span className="text-[10px] font-mono">USD ($) Top-Up</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={cCountry}
                        onChange={(e) => setCCountry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={cState}
                        onChange={(e) => setCState(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={cCity}
                        onChange={(e) => setCCity(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* In-Modal Top-Up Prompt Overlay for Premium Items */}
        {promptTopUpItem && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-2xl">
                👑
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Unlock Exclusive VIP Piece</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  This luxury designer item costs <span className="text-amber-400 font-bold font-mono">${promptTopUpItem.price.toLocaleString()} In-Game Dollars</span>.
                  Your current cash balance is <span className="text-emerald-400 font-bold font-mono">${playerCash.toLocaleString()}</span>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                <span>Top-up in your native currency:</span>
                <span className="font-bold text-emerald-400 block mt-0.5">
                  {playerRegion === 'NG' ? '🇳🇬 ₦ Nigerian Naira (₦1,000 = $100 Cash)' : '🇺🇸 $ US Dollar ($1.00 = $100 Cash)'}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setPromptTopUpItem(null);
                    onOpenTopUp();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Coins className="w-4 h-4" />
                  <span>Top-Up Cash Now ({playerRegion === 'NG' ? '₦ Naira' : '$ USD'})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPromptTopUpItem(null)}
                  className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
