export interface UserAccount {
  id: string;
  email: string;
  username: string;
  passwordHash: string; // stored securely in local vault
  displayName: string;
  fullName?: string;
  country?: string;
  stateProvince?: string;
  city?: string;
  region?: 'NG' | 'US';
  preferredCurrency: 'NGN' | 'USD';
  createdAt: string;
  lastLogin: string;
  isOwner?: boolean;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userEmail: string;
  realAmount: number;
  realCurrency: 'NGN' | 'USD';
  gameCashPurchased: number;
  paymentMethod: 'Card' | 'Bank Transfer' | 'USSD';
  reference: string;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Failed';
  settledToOwnerAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface OwnerPayoutConfig {
  ownerName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingOrSortCode: string;
  settlementCurrency: 'NGN' | 'USD' | 'Both';
  autoPayoutEnabled: boolean;
  totalRevenueNaira: number;
  totalRevenueUSD: number;
  paystackPublicKey?: string;
  flutterwavePublicKey?: string;
  stripePublicKey?: string;
}

export interface CashTopUpPackage {
  id: string;
  nairaPrice: number;
  usdPrice: number;
  gameCash: number;
  badge?: string;
  bonusPercent?: number;
  popular?: boolean;
}
