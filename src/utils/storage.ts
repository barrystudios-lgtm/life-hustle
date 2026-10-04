import {
  INITIAL_CHIRPS,
  INITIAL_NPCS,
  INITIAL_STOCKS,
  RANDOM_DILEMMAS,
} from '../data/cityData';
import { GameState } from '../types/game';

const STORAGE_KEY = 'american_life_sim_v2';

export function createDefaultGameState(playerName: string = 'Alex Mercer'): GameState {
  return {
    version: 2,
    player: {
      name: playerName,
      firstName: playerName.split(' ')[0] || 'Alex',
      lastName: playerName.split(' ')[1] || 'Mercer',
      age: 21,
      week: 1,
      year: 2026,
      country: 'Nigeria',
      stateProvince: 'Lagos',
      city: 'Lekki',
      originCity: 'Lekki, Lagos, Nigeria',
      region: 'NG', // Defaults to Nigeria (Naira ₦)
      netWorth: 2500,
      cash: 1200,
      bankSavings: 1300,
      debt: 0,
      stats: {
        energy: 90,
        hunger: 80,
        happiness: 85,
        health: 90,
        smarts: 45,
        looks: 65,
        creditScore: 680,
        streetCred: 35,
      },
      avatar: {
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
      },
      unlockedWardrobeItems: [
        'hair_fade', 'hair_curly', 'hair_afro', 'hair_waves', 'hair_buzz',
        'top_hoodie', 'top_tshirt', 'top_leather',
        'pants_jeans', 'pants_cargos', 'pants_sweats',
        'shoes_white_sneakers', 'shoes_high_tops',
        'acc_gold_chain', 'acc_airpods'
      ],
      education: 'High School Diploma',
      currentJobId: 'barista',
      currentHouseId: 'couch',
      ownedVehicles: ['metro_pass'],
      selectedVehicleId: 'metro_pass',
      inventory: ['Subway Pass', 'Smartphone', 'Metro Coffee Mug'],
      portfolio: {},
      followers: 120,
    },
    relationships: INITIAL_NPCS,
    stocks: INITIAL_STOCKS,
    chirps: INITIAL_CHIRPS,
    logs: [
      {
        id: 'log_start',
        week: 1,
        year: 2026,
        text: 'Arrived in the metropolis with a suitcase, $1,200 cash, and an unstoppable dream to make it in America.',
        type: 'event',
        timestamp: 'Just now',
      },
      {
        id: 'log_job',
        week: 1,
        year: 2026,
        text: 'Landed your first gig at Cyber Bean Roasters as an Artisan Barista ($18/hr).',
        type: 'career',
        timestamp: 'Just now',
      },
    ],
    unlockedDistricts: ['Midtown Central', 'Brooklyn Arts', 'Financial District', 'Silicon Alley'],
    activeDilemma: null,
    dayTime: 'afternoon',
    weather: 'sunny',
    soundEnabled: true,
  };
}

export function loadSavedGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && (data.version === 1 || data.version === 2)) {
      // Migrate if missing region or country
      if (!data.player.region) data.player.region = 'NG';
      if (!data.player.country) data.player.country = 'Nigeria';
      if (!data.player.stateProvince) data.player.stateProvince = 'Lagos';
      if (!data.player.city) data.player.city = 'Lekki';
      if (!data.player.unlockedWardrobeItems) {
        data.player.unlockedWardrobeItems = [
          'hair_fade', 'hair_curly', 'hair_afro', 'hair_waves',
          'top_hoodie', 'top_tshirt', 'pants_jeans', 'shoes_white_sneakers', 'acc_gold_chain'
        ];
      }
      return data as GameState;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

export function clearGameSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear save:', err);
  }
}
