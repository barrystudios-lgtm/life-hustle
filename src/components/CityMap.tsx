import React, { useState } from 'react';
import { getCityLocations, getAvailableMapsForLocation, AvailableMapOption } from '../data/cityData';
import { LocationVenue, PlayerRegion } from '../types/game';
import { sound } from '../utils/sound';
import { 
  Building2, 
  Utensils, 
  Sparkles, 
  TrendingUp, 
  Home, 
  Dices, 
  Compass, 
  Navigation,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MapPin,
  Plane,
  Layers,
  Check
} from 'lucide-react';

interface Props {
  onSelectVenue: (venue: LocationVenue) => void;
  dayTime: 'morning' | 'afternoon' | 'evening' | 'night';
  currentLocationId?: string;
  selectedDistrictFilter: string;
  onFilterChange: (filter: string) => void;
  onTimeChange?: (time: 'morning' | 'afternoon' | 'evening' | 'night') => void;
  playerRegion?: PlayerRegion;
  playerCity?: string;
  playerCountry?: string;
  onTravelCity?: (newCity: string, newRegion: PlayerRegion) => void;
}

export const CityMap: React.FC<Props> = ({
  onSelectVenue,
  dayTime = 'afternoon',
  currentLocationId,
  selectedDistrictFilter,
  onFilterChange,
  onTimeChange,
  playerRegion = 'NG',
  playerCity = 'Lekki Phase 1',
  playerCountry = 'Nigeria',
  onTravelCity,
}) => {
  const [hoveredVenue, setHoveredVenue] = useState<LocationVenue | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showMapSelector, setShowMapSelector] = useState<boolean>(false);

  const isNigeriaMap = playerRegion === 'NG' || (playerCountry && playerCountry.toLowerCase().includes('nigeria'));
  const activeLocations = getCityLocations(playerRegion, playerCity, playerCountry);
  const availableMaps: AvailableMapOption[] = getAvailableMapsForLocation(playerRegion, playerCountry);

  const activeCityLower = (playerCity || '').toLowerCase();
  const isAbuja = activeCityLower.includes('abuja') || activeCityLower.includes('maitama') || activeCityLower.includes('wuse') || activeCityLower.includes('garki');
  const isPortHarcourt = activeCityLower.includes('rivers') || activeCityLower.includes('port harcourt') || activeCityLower.includes('choba') || activeCityLower.includes('trans-amadi');
  const isCalifornia = activeCityLower.includes('california') || activeCityLower.includes('silicon valley') || activeCityLower.includes('los angeles') || activeCityLower.includes('venice') || activeCityLower.includes('beverly hills');

  const getMapDetails = () => {
    if (isAbuja) {
      return {
        title: '🇳🇬 ABUJA FEDERAL CAPITAL GRID',
        subtitle: 'Central Business District • Maitama Hills • Transcorp • Millennium Park',
        ave1: 'SHEHU SHAGARI WAY / MAITAMA',
        ave2: 'AHMADU BELLO WAY / CBD',
        ave3: 'CONSTITUTION AVENUE / GARKI',
        parkName: 'Millennium Park & Aso Rock',
        parkSub: '🌿 Mountain Fountains & Scenic Promenade',
        lakeName: '🏞️ Aso Lake',
        waterfront: '⚓ JABI LAKE & WATERFRONT PROMENADE',
        waterfrontSub: '/ Boating Club & Lakeside Dining',
        v1Emoji: '🚕',
        v1Name: 'ABUJA GREEN TAXI 04',
        v2Emoji: '🚐',
        v2Name: 'TRANSCORP VIP SHUTTLE',
        v3Emoji: '🛺',
        v3Name: 'CAPITAL KEKE 18',
      };
    }
    if (isPortHarcourt) {
      return {
        title: '🇳🇬 PORT HARCOURT GARDEN CITY GRID',
        subtitle: 'Old GRA • Trans-Amadi Tech • Polo Club • Forces Avenue',
        ave1: 'FORCES AVENUE / OLD GRA',
        ave2: 'ABA ROAD COMMERCIAL CORRIDOR',
        ave3: 'TRANS-AMADI TECH FREEWAY',
        parkName: 'Isaac Boro Pleasure Park',
        parkSub: '🌿 Palm Boardwalk & Boating Lagoon',
        lakeName: '🌴 Pleasure Lake',
        waterfront: '⚓ BONNY RIVER & MARINE TERMINAL',
        waterfrontSub: '/ Maritime Harbor & Offshore Vessels',
        v1Emoji: '🚕',
        v1Name: 'GARDEN CITY CAB 12',
        v2Emoji: '🚌',
        v2Name: 'RIVERS METRO BUS',
        v3Emoji: '🛺',
        v3Name: 'PH KEKE EXPRESS',
      };
    }
    if (isCalifornia) {
      return {
        title: '🇺🇸 CALIFORNIA PACIFIC COAST GRID',
        subtitle: 'Sand Hill Road • Silicon Valley AI • Hollywood • Venice Beach',
        ave1: 'SUNSET BLVD / HOLLYWOOD',
        ave2: 'SANTA MONICA BLVD & VENICE',
        ave3: 'SAND HILL ROAD / PALO ALTO',
        parkName: 'Santa Monica Beach Park',
        parkSub: '🌴 Pacific Boardwalk & Ocean Pier',
        lakeName: '🏄 Pacific Pier',
        waterfront: '⚓ PACIFIC OCEAN & MARINA DEL REY',
        waterfrontSub: '/ Ocean Yachts & Pacific Coast Highway',
        v1Emoji: '⚡',
        v1Name: 'TESLA AUTONOMOUS ROBOTAXI',
        v2Emoji: '🚌',
        v2Name: 'PACIFIC COAST SURF COMMUTER',
        v3Emoji: '🛴',
        v3Name: 'VENICE E-SCOOTER',
      };
    }
    if (isNigeriaMap) {
      return {
        title: '🇳🇬 LAGOS & LEKKI URBAN GRID',
        subtitle: 'Lekki Expressway • Marina Financial • Yaba Silicon • V.I.',
        ave1: 'ADMIRALTY WAY / LEKKI 1',
        ave2: 'OZUMBA MBADIWE BLVD / V.I.',
        ave3: 'MARINA FINANCIAL BYPASS',
        parkName: 'Lekki Conservation & Palms',
        parkSub: '🌿 Beachfront Trails & Boardwalk',
        lakeName: '🌴 Canopy Lake',
        waterfront: '⚓ LAGOS LAGOON & EKO HARBOR',
        waterfrontSub: '/ Luxury Yachts & Oniru Beachfront',
        v1Emoji: '🚌',
        v1Name: 'DANFO LEKKI EXPRESS',
        v2Emoji: '🚕',
        v2Name: 'LAGOS METRO CAB',
        v3Emoji: '🛺',
        v3Name: 'KEKE NAPEP 07',
      };
    }
    return {
      title: '🇺🇸 AMERICAN METROPOLIS GRID',
      subtitle: '5th Avenue • Wall Street • Broadway • Silicon Alley',
      ave1: '5TH AVENUE / MIDTOWN',
      ave2: 'BROADWAY & 42ND ST',
      ave3: 'WALL STREET / FINANCIAL',
      parkName: 'Central Park Great Lawn',
      parkSub: '🌳 Jogging Paths & Concert Pavilion',
      lakeName: '⛵ Central Lake',
      waterfront: '⚓ HUDSON MARINA & PIER 45',
      waterfrontSub: '/ Luxury Yachts & Waterfront Promenade',
      v1Emoji: '🚕',
      v1Name: 'NYC TAXI 504',
      v2Emoji: '🚌',
      v2Name: 'M15 EXPRESS BUS',
      v3Emoji: '🚕',
      v3Name: 'YELLOW CAB 128',
    };
  };

  const mapDetails = getMapDetails();

  const categories = [
    { id: 'all', label: isNigeriaMap ? 'All District Venues' : 'All Metropolis', icon: Compass },
    { id: 'work', label: isNigeriaMap ? (isAbuja ? 'Idu Tech' : isPortHarcourt ? 'Trans-Amadi' : 'Yaba Silicon') : (isCalifornia ? 'Silicon Valley' : 'Careers & Tech'), icon: Building2 },
    { id: 'finance', label: isNigeriaMap ? (isAbuja ? 'CBD Banking' : isPortHarcourt ? 'Oil Exchange' : 'Marina NSE') : (isCalifornia ? 'Sand Hill VC' : 'Wall St'), icon: TrendingUp },
    { id: 'food', label: isNigeriaMap ? (isAbuja ? 'Wuse 2 Kitchens' : isPortHarcourt ? 'Bole & Grill' : 'Suya & Kitchens') : (isCalifornia ? 'Venice Grills' : 'Diners & Cafes'), icon: Utensils },
    { id: 'nightlife', label: isNigeriaMap ? (isAbuja ? 'Sky Lounge' : isPortHarcourt ? 'Forces Lounges' : 'Lekki Lounges') : (isCalifornia ? 'Sunset Strip' : 'Shows & Clubs'), icon: Sparkles },
    { id: 'casino', label: isNigeriaMap ? (isAbuja ? 'Transcorp Casino' : isPortHarcourt ? 'Golden Tulip' : 'Federal Palace') : (isCalifornia ? 'Bellagio Club' : 'Casino Strip'), icon: Dices },
    { id: 'real_estate', label: isNigeriaMap ? (isAbuja ? 'Maitama Realty' : isPortHarcourt ? 'Garden Realty' : 'Pearl Realty') : (isCalifornia ? 'Beverly Hills' : 'Real Estate'), icon: Home },
  ];

  const filteredLocations = activeLocations.filter((loc) => {
    if (selectedDistrictFilter === 'all') return true;
    return loc.category === selectedDistrictFilter;
  });

  const getDayTimeBg = () => {
    switch (dayTime) {
      case 'morning':
        return 'from-sky-300 via-amber-100 to-emerald-50';
      case 'afternoon':
      default:
        return 'from-sky-400 via-sky-200 to-amber-50';
      case 'evening':
        return 'from-amber-400 via-rose-300 to-purple-900';
      case 'night':
        return 'from-slate-950 via-slate-900 to-indigo-950';
    }
  };

  const isNight = dayTime === 'night';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-slate-700/80 bg-slate-900 shadow-2xl flex flex-col">
      {/* Map Control Bar */}
      <div className="p-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide font-sans flex items-center gap-2">
              <span>{mapDetails.title}</span>
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {playerCity || 'Local Grid'}
              </span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 block">
              {mapDetails.subtitle}
            </span>
          </div>
        </div>

        {/* Location & Maps Switcher / Regional Map Selector */}
        <div className="flex items-center gap-2">
          {/* Maps Dropdown Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowMapSelector(!showMapSelector);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer shadow-sm"
              title="Maps available based on your location"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Available Maps ({availableMaps.length})</span>
            </button>

            {showMapSelector && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl z-50 p-2 space-y-1.5 animate-in fade-in">
                <div className="px-2 py-1 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Maps for {playerCountry || 'Your Region'}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    {playerRegion === 'NG' ? '₦ Naira' : '$ USD'}
                  </span>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {availableMaps.map((map) => {
                    const isCurrent = (playerCity || '').toLowerCase().includes(map.cityName.toLowerCase()) ||
                      (playerCity || '').toLowerCase().includes(map.id);

                    return (
                      <button
                        key={map.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setShowMapSelector(false);
                          if (onTravelCity) {
                            onTravelCity(map.cityName, map.region);
                          }
                        }}
                        className={`w-full text-left p-2 rounded-xl transition-all flex items-start gap-2 cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500/20 border border-amber-500/40 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-xl shrink-0 mt-0.5">{map.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span className="truncate">{map.title.replace(/^[^\s]+\s*/, '')}</span>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            {map.cityName}, {map.stateProvince}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Time of Day Switcher */}
          {onTimeChange && (
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  sound.playClick();
                  onTimeChange('morning');
                }}
                title="Morning (08:30 AM)"
                className={`p-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  dayTime === 'morning' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sunrise className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">08:30 AM</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onTimeChange('afternoon');
                }}
                title="Bright Daytime (12:30 PM)"
                className={`p-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  dayTime === 'afternoon' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">12:30 PM</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onTimeChange('evening');
                }}
                title="Sunset (06:30 PM)"
                className={`p-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  dayTime === 'evening' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">06:30 PM</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onTimeChange('night');
                }}
                title="Nighttime (10:30 PM)"
                className={`p-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  dayTime === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">10:30 PM</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedDistrictFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  onFilterChange(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Canvas Viewport */}
      <div
        className={`relative w-full h-[520px] sm:h-[600px] overflow-hidden select-none bg-gradient-to-b ${getDayTimeBg()} transition-colors duration-1000`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Daytime Sun Beam / Ambient Flare */}
        {!isNight && (
          <div className="absolute top-2 right-12 w-48 h-48 rounded-full bg-yellow-200/50 blur-2xl pointer-events-none" />
        )}

        {/* Realistic Concrete Ground Grid & Asphalt Streets */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Avenue 1 */}
          <div className="absolute top-[28%] left-0 right-0 h-10 bg-slate-700 border-y-2 border-slate-600/80 shadow-inner flex items-center">
            <div className="w-full h-1 border-y border-amber-400 my-auto" />
            <span className="absolute left-6 text-[10px] font-bold font-mono text-slate-300 uppercase tracking-widest bg-slate-900/60 px-2 py-0.5 rounded">
              {mapDetails.ave1}
            </span>
          </div>

          {/* Avenue 2 */}
          <div className="absolute top-[55%] left-0 right-0 h-11 bg-slate-700 border-y-2 border-slate-600/80 shadow-inner flex items-center">
            <div className="w-full h-1 border-y border-amber-400 my-auto" />
            <span className="absolute left-6 text-[10px] font-bold font-mono text-slate-300 uppercase tracking-widest bg-slate-900/60 px-2 py-0.5 rounded">
              {mapDetails.ave2}
            </span>
          </div>

          {/* Avenue 3 */}
          <div className="absolute top-[82%] left-0 right-0 h-10 bg-slate-700 border-y-2 border-slate-600/80 shadow-inner flex items-center">
            <div className="w-full h-1 border-y border-amber-400 my-auto" />
            <span className="absolute left-6 text-[10px] font-bold font-mono text-slate-300 uppercase tracking-widest bg-slate-900/60 px-2 py-0.5 rounded">
              {mapDetails.ave3}
            </span>
          </div>

          {/* Vertical North-South Cross Streets with Crosswalks */}
          <div className="absolute top-0 bottom-0 left-[25%] w-8 bg-slate-700 border-x border-slate-600/60" />
          <div className="absolute top-0 bottom-0 left-[50%] w-9 bg-slate-700 border-x border-slate-600/60" />
          <div className="absolute top-0 bottom-0 left-[75%] w-8 bg-slate-700 border-x border-slate-600/60" />

          {/* Zebra crosswalks */}
          <div className="absolute top-[28%] left-[25%] w-8 h-10 flex flex-col justify-between py-1 bg-slate-800">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-full h-1 bg-white/90" />
            ))}
          </div>
          <div className="absolute top-[55%] left-[50%] w-9 h-11 flex flex-col justify-between py-1 bg-slate-800">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-1 bg-white/90" />
            ))}
          </div>
          <div className="absolute top-[82%] left-[75%] w-8 h-10 flex flex-col justify-between py-1 bg-slate-800">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-full h-1 bg-white/90" />
            ))}
          </div>
        </div>

        {/* Localized Park Canvas Element */}
        <div className="absolute top-3 left-[28%] w-[44%] h-24 rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 border-2 border-emerald-500/80 shadow-md pointer-events-none overflow-hidden flex items-center justify-between px-6">
          <div className="w-32 h-14 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 border border-sky-300/60 shadow-inner flex items-center justify-center relative">
            <span className="text-[10px] text-white/90 font-mono font-bold">
              {mapDetails.lakeName}
            </span>
          </div>

          <div className="text-right">
            <div className="text-xs font-black font-sans text-emerald-950 tracking-wider uppercase drop-shadow-sm">
              {mapDetails.parkName}
            </div>
            <div className="text-[10px] text-emerald-900 font-mono font-semibold">
              {mapDetails.parkSub}
            </div>
          </div>
        </div>

        {/* Waterfront Marina & Coastline */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-sky-700 via-blue-600 to-transparent pointer-events-none border-t border-sky-400/40">
          <div className="absolute bottom-2 left-6 text-xs tracking-widest text-sky-100 font-mono font-bold flex items-center gap-2 drop-shadow-md">
            <span>{mapDetails.waterfront}</span>
            <span className="text-[10px] text-sky-200">
              {mapDetails.waterfrontSub}
            </span>
          </div>
        </div>

        {/* Animated Daytime Vehicles (Localized for Region & Map) */}
        {/* Vehicle 1 */}
        <div className="absolute top-[29%] left-0 w-full h-8 pointer-events-none overflow-hidden">
          <div className="inline-flex items-center gap-1 animate-[moveRight_12s_linear_infinite]">
            <span className="px-2 py-0.5 rounded-sm bg-yellow-400 text-slate-950 font-black text-xs shadow-md border border-yellow-500 flex items-center gap-1">
              <span>{mapDetails.v1Emoji}</span>
              <span>{mapDetails.v1Name}</span>
            </span>
          </div>
        </div>

        {/* Vehicle 2 */}
        <div className="absolute top-[56%] left-0 w-full h-8 pointer-events-none overflow-hidden">
          <div className="inline-flex items-center gap-1 animate-[moveLeft_18s_linear_infinite]">
            <span className="px-2.5 py-0.5 rounded font-black text-xs shadow-md flex items-center gap-1.5 font-mono bg-amber-400 text-slate-950 border border-slate-900">
              <span>{mapDetails.v2Emoji}</span>
              <span>{mapDetails.v2Name}</span>
            </span>
          </div>
        </div>

        {/* Vehicle 3 */}
        <div className="absolute top-[83%] left-0 w-full h-8 pointer-events-none overflow-hidden">
          <div className="inline-flex items-center gap-1 animate-[moveRight_15s_linear_infinite]">
            <span className="px-2 py-0.5 rounded-sm bg-yellow-400 text-slate-950 font-black text-xs shadow-md border border-yellow-500 flex items-center gap-1">
              <span>{mapDetails.v3Emoji}</span>
              <span>{mapDetails.v3Name}</span>
            </span>
          </div>
        </div>

        {/* Architectural Venue Pins */}
        {filteredLocations.map((venue) => {
          const isSelected = currentLocationId === venue.id;
          const isHovered = hoveredVenue?.id === venue.id;

          return (
            <div
              key={venue.id}
              style={{
                left: `${venue.x}%`,
                top: `${venue.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 cursor-pointer group"
              onMouseEnter={() => setHoveredVenue(venue)}
              onMouseLeave={() => setHoveredVenue(null)}
              onClick={() => {
                sound.playClick();
                onSelectVenue(venue);
              }}
            >
              {/* Pulsing selection ring */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-2xl animate-ping opacity-75"
                  style={{ backgroundColor: venue.color }}
                />
              )}

              {/* Pin container */}
              <div
                className={`relative flex items-center justify-center p-2.5 rounded-2xl border-2 transition-all transform duration-200 shadow-xl ${
                  isSelected
                    ? 'scale-125 z-30 ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900'
                    : isHovered
                    ? 'scale-115 -translate-y-1 z-20'
                    : 'scale-100 hover:scale-110'
                }`}
                style={{
                  backgroundColor: '#0f172a',
                  borderColor: isSelected ? '#fbbf24' : venue.color,
                }}
              >
                <span className="text-xl filter drop-shadow-md select-none">{venue.icon}</span>

                {/* Status beacon dot */}
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950"
                  style={{ backgroundColor: venue.color }}
                />
              </div>

              {/* Permanent / Hover Label */}
              <div
                className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-150 z-30 ${
                  isHovered || isSelected ? 'opacity-100 scale-100' : 'opacity-85 scale-95'
                }`}
              >
                <div className="px-2.5 py-1 rounded-xl bg-slate-950/95 backdrop-blur-md border border-slate-700/80 shadow-2xl text-center whitespace-nowrap">
                  <div className="text-[11px] font-black font-sans text-white tracking-tight drop-shadow-sm">
                    {venue.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    {venue.district}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Footer Toolbar */}
      <div className="p-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between text-xs z-30">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Location: <strong className="text-white">{playerCity}</strong> ({playerRegion === 'NG' ? '₦ Naira Region' : '$ USD Region'})</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
            title="Reset Zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
