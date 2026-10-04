export interface PlayerStats {
  energy: number;       // 0 - 100
  hunger: number;       // 0 - 100 (100 is full, 0 is starving)
  happiness: number;    // 0 - 100
  health: number;       // 0 - 100
  smarts: number;       // 0 - 100
  looks: number;        // 0 - 100
  creditScore: number;  // 300 - 850
  streetCred: number;   // 0 - 1000 (Influence/Clout)
}

export type PlayerRegion = 'NG' | 'US';

export interface AvatarConfig {
  gender: 'male' | 'female' | 'nonbinary';
  skinTone: string;     // Hex color
  hairStyle: string;    // 'fade', 'dreads', 'afro', 'waves', 'curly', 'slick', 'buzz', 'long', 'platinum_braids'
  hairColor: string;    // Hex color
  facialHair?: string;  // 'none', 'stubble', 'full_beard', 'goatee', 'mustache'
  clothing: string;     // 'hoodie', 'suit', 'leather', 'tshirt', 'blazer', 'silk_blazer', 'designer_tracksuit', 'gold_embroidered'
  clothingColor?: string;
  pants?: string;       // 'jeans', 'cargos', 'tailored', 'sweats', 'leather_pants'
  pantsColor?: string;
  shoes?: string;       // 'white_sneakers', 'high_tops', 'oxfords', 'chelsea_boots', 'luxury_loafers', 'designer_runners'
  shoesColor?: string;
  accessory?: string;   // 'none', 'airpods', 'glasses', 'sunglasses', 'gold_chain', 'diamond_chain', 'rolex_watch', 'snapback'
  expression: 'happy' | 'confident' | 'cool' | 'chill' | 'focused' | 'smirk';
}

export interface WardrobeItem {
  id: string;
  category: 'hair' | 'clothes' | 'pants' | 'shoes' | 'accessory';
  name: string;
  isPremium?: boolean;
  price?: number;        // in-game cash price
  requiredCred?: number; // Cred requirement if any
  icon?: string;
  previewColor?: string;
}

export interface Job {
  id: string;
  title: string;
  field: 'Tech' | 'Finance' | 'Entertainment' | 'Service' | 'Healthcare' | 'Corporate';
  level: number; // 1 to 5
  hourlyRate: number;
  weeklySalary: number;
  requiredSmarts: number;
  requiredCred: number;
  requiredDegree?: string;
  description: string;
  companyName: string;
}

export interface House {
  id: string;
  name: string;
  type: 'Couch' | 'Room' | 'Studio' | 'Apartment' | 'Brownstone' | 'Penthouse' | 'Mansion';
  district: string;
  weeklyRent: number;
  purchasePrice?: number;
  owned: boolean;
  comfort: number; // boosts energy regen
  prestige: number; // boosts happiness / cred
  imageIcon: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'Metro Pass' | 'Scooter' | 'Sedan' | 'Muscle' | 'EV' | 'Supercar' | 'Yacht';
  price: number;
  weeklyUpkeep: number;
  speedBonus: string;
  credBonus: number;
  icon: string;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  district: string;
  avatarSeed: string;
  gender: 'male' | 'female' | 'nonbinary';
  relationship: number; // -100 to 100
  status: 'Stranger' | 'Acquaintance' | 'Friend' | 'Best Friend' | 'Crush' | 'Dating' | 'Spouse' | 'Rival';
  personality: string;
  bio: string;
  dialoguePool: string[];
}

export interface StockAsset {
  symbol: string;
  name: string;
  type: 'Stock' | 'Crypto' | 'Index' | 'Bond';
  price: number;
  history: number[];
  change24h: number;
  volatility: number;
  description: string;
}

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  avgBuyPrice: number;
}

export interface ChirpPost {
  id: string;
  author: string;
  handle: string;
  authorAvatar: string;
  content: string;
  likes: number;
  timeAgo: string;
  isPlayer?: boolean;
  category?: 'news' | 'gossip' | 'finance' | 'city';
}

export interface LocationVenue {
  id: string;
  name: string;
  district: string;
  category: 'work' | 'food' | 'nightlife' | 'fitness' | 'finance' | 'shopping' | 'real_estate' | 'medical' | 'education' | 'casino';
  description: string;
  icon: string;
  x: number; // percentage on map (0-100)
  y: number; // percentage on map (0-100)
  color: string;
  availableActions: VenueAction[];
}

export interface VenueAction {
  id: string;
  label: string;
  cost?: number;
  energyCost?: number;
  effectDescription: string;
  actionType: 'eat' | 'drink' | 'workout' | 'gamble' | 'shop' | 'heal' | 'study' | 'party' | 'special';
  statImpact?: Partial<PlayerStats>;
  customHandler?: string;
}

export interface LogEntry {
  id: string;
  week: number;
  year: number;
  text: string;
  type: 'career' | 'finance' | 'social' | 'health' | 'event' | 'housing';
  timestamp: string;
}

export interface LifeDilemma {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'street' | 'finance' | 'romance';
  options: {
    text: string;
    effectText: string;
    cashChange?: number;
    statChange?: Partial<PlayerStats>;
    credChange?: number;
  }[];
}

export interface GameState {
  version: number;
  player: {
    name: string;
    firstName?: string;
    lastName?: string;
    age: number; // starts at 21
    week: number; // 1 to 52
    year: number; // 2026+
    country: string;
    stateProvince: string;
    city: string;
    originCity: string;
    region: PlayerRegion; // 'NG' -> Naira only, 'US' -> Dollars only
    netWorth: number;
    cash: number;
    bankSavings: number;
    debt: number;
    stats: PlayerStats;
    avatar: AvatarConfig;
    unlockedWardrobeItems: string[];
    education: string;
    currentJobId: string | null;
    currentHouseId: string;
    ownedVehicles: string[];
    selectedVehicleId: string;
    inventory: string[];
    portfolio: Record<string, PortfolioPosition>;
    followers: number;
  };
  relationships: NPC[];
  stocks: StockAsset[];
  chirps: ChirpPost[];
  logs: LogEntry[];
  unlockedDistricts: string[];
  activeDilemma: LifeDilemma | null;
  dayTime: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: 'sunny' | 'rainy' | 'clear_night' | 'neon_fog';
  soundEnabled: boolean;
}
