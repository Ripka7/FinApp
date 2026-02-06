
export type Currency = '₴' | '$' | '€' | string;
export type Language = 'en' | 'ua';
export type Theme = 'light' | 'dark';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
  INVESTMENT = 'INVESTMENT'
}

export enum Frequency {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM_DATE = 'CUSTOM_DATE'
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: Currency;
  color: string;
}

export interface Budget {
  id: string;
  name: string;
  limit: number;
  spent: number;
  currency: Currency;
  color: string;
}

export interface Envelope {
  id: string;
  name: string;
  balance: number;
  goal: number;
  currency: Currency;
  color: string;
}

export interface Investment {
  id: string;
  type: string;
  name: string;
  amount: number;
  currency: Currency;
  purchaseDate: string;
  termDate: string | 'perpetual';
  interestRate: number;
  payoutFrequency: 'semi-annual' | 'annual' | 'end-of-term';
  interestType: 'simple' | 'compound';
  comment?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  walletId?: string;
  toWalletId?: string;
  envelopeId?: string;
  budgetId?: string;
  category: string;
  date: string;
  isAuto: boolean;
  frequency: Frequency;
  comment?: string;
}

export interface AppSettings {
  theme: Theme;
  accentColor: string;
  language: Language;
  currencies: string[];
  categories: {
    income: string[];
    expense: string[];
    investment: string[];
  };
}
