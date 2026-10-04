import { 
  UserAccount, 
  PaymentTransaction, 
  OwnerPayoutConfig, 
  CashTopUpPackage 
} from '../types/account';

const USERS_KEY = 'american_life_users_v1';
const CURRENT_USER_KEY = 'american_life_session_user';
const TRANSACTIONS_KEY = 'american_life_transactions_v1';
const OWNER_CONFIG_KEY = 'american_life_owner_payout_config';

export const TOP_UP_PACKAGES: CashTopUpPackage[] = [
  {
    id: 'starter',
    nairaPrice: 1000,
    usdPrice: 1.00,
    gameCash: 100,
    badge: 'STARTER HUSTLE',
  },
  {
    id: 'bronze',
    nairaPrice: 2000,
    usdPrice: 2.00,
    gameCash: 220,
    bonusPercent: 10,
    badge: 'STREET DREAMER',
  },
  {
    id: 'silver',
    nairaPrice: 5000,
    usdPrice: 5.00,
    gameCash: 600,
    bonusPercent: 20,
    badge: 'URBAN BALLER',
    popular: true,
  },
  {
    id: 'gold',
    nairaPrice: 10000,
    usdPrice: 10.00,
    gameCash: 1500,
    bonusPercent: 50,
    badge: 'WALL ST EXECUTIVE',
  },
  {
    id: 'platinum',
    nairaPrice: 25000,
    usdPrice: 25.00,
    gameCash: 4500,
    bonusPercent: 80,
    badge: 'PENTHOUSE MOGUL',
  },
  {
    id: 'whale',
    nairaPrice: 50000,
    usdPrice: 50.00,
    gameCash: 10000,
    bonusPercent: 100,
    badge: 'AMERICAN TYCOON',
  },
];

export const DEFAULT_OWNER_CONFIG: OwnerPayoutConfig = {
  ownerName: 'Olatokunbo Afolabi',
  bankName: 'Access Bank / GTBank / Zenith',
  accountNumber: '0123456789',
  accountName: 'Olatokunbo Afolabi',
  routingOrSortCode: '044',
  settlementCurrency: 'Both',
  autoPayoutEnabled: true,
  totalRevenueNaira: 0,
  totalRevenueUSD: 0,
};

// Retrieve all registered accounts
export function getAllAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save accounts
export function saveAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts:', e);
  }
}

// Current logged in session
export function getCurrentSessionUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentSessionUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to set session:', e);
  }
}

// Transactions
export function getAllTransactions(): PaymentTransaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTransaction(tx: PaymentTransaction): void {
  try {
    const list = getAllTransactions();
    const updated = [tx, ...list];
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));

    // Update owner total revenue
    const config = getOwnerPayoutConfig();
    if (tx.realCurrency === 'NGN') {
      config.totalRevenueNaira += tx.realAmount;
    } else {
      config.totalRevenueUSD += tx.realAmount;
    }
    saveOwnerPayoutConfig(config);
  } catch (e) {
    console.error('Failed to save transaction:', e);
  }
}

// Owner Payout Settings
export function getOwnerPayoutConfig(): OwnerPayoutConfig {
  try {
    const raw = localStorage.getItem(OWNER_CONFIG_KEY);
    if (!raw) return DEFAULT_OWNER_CONFIG;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_OWNER_CONFIG;
  }
}

export function saveOwnerPayoutConfig(config: OwnerPayoutConfig): void {
  try {
    localStorage.setItem(OWNER_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save owner config:', e);
  }
}
