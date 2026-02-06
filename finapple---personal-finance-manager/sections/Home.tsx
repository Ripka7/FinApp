
import React, { useState, useEffect } from 'react';
import { Wallet, AppSettings, TransactionType, Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { 
  PlusIcon, MinusIcon, ArrowsRightLeftIcon, 
  SparklesIcon, PencilIcon, PresentationChartLineIcon,
  ChartBarIcon, ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface HomeSectionProps {
  t: any;
  wallets: Wallet[];
  settings: AppSettings;
  transactions: Transaction[];
  onAddClick: (type: TransactionType) => void;
  onEditTransaction: (tx: Transaction) => void;
  setActiveTab: (tab: string) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ 
  t, wallets, settings, transactions, onAddClick, onEditTransaction, setActiveTab 
}) => {
  const [advice, setAdvice] = useState<string>("");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      const res = await getFinancialAdvice("Give a specific 20-word financial tip about savings or investments for an app dashboard.");
      setAdvice(res);
      setIsLoadingAdvice(false);
    };
    fetchAdvice();
  }, []);

  const totalBalanceUAH = wallets.reduce((acc, curr) => {
    if (curr.currency === '$') return acc + curr.balance * 41;
    if (curr.currency === '€') return acc + curr.balance * 44;
    return acc + curr.balance;
  }, 0);

  const totalUSDWallets = wallets
    .filter(w => w.currency === '$')
    .reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Balance Section */}
      <div className="text-center py-6 space-y-1">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{t.balance}</p>
        <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white">
          {totalBalanceUAH.toLocaleString()} <span className="text-2xl font-light opacity-40">₴</span>
        </h1>
        <p className="text-xl font-medium text-gray-400 dark:text-gray-500">
          {totalUSDWallets.toLocaleString()} <span className="text-sm font-light">$</span>
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { type: TransactionType.INCOME, icon: PlusIcon, label: t.addIncome, color: '#10B981' },
          { type: TransactionType.EXPENSE, icon: MinusIcon, label: t.addExpense, color: '#F43F5E' },
          { type: TransactionType.TRANSFER, icon: ArrowsRightLeftIcon, label: t.addTransfer, color: '#3B82F6' },
        ].map((btn) => (
          <button
            key={btn.type}
            onClick={() => onAddClick(btn.type)}
            className="flex flex-col items-center justify-center p-5 bg-white dark:bg-gray-800 rounded-3xl shadow-sm active:scale-95 transition-all border border-gray-100 dark:border-gray-700"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: `${btn.color}15`, color: btn.color }}
            >
              <btn.icon className="w-6 h-6 stroke-[2.5px]" />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Advice */}
      <div className="relative overflow-hidden p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <SparklesIcon className="w-5 h-5" style={{ color: settings.accentColor }} />
          <h2 className="font-black text-sm uppercase tracking-wider">{t.tips}</h2>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed italic">
          {isLoadingAdvice ? <span className="animate-pulse">Analyzing markets...</span> : `"${advice}"`}
        </p>
      </div>

      {/* Quick Section Navigation Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'investments', icon: PresentationChartLineIcon, label: t.investments, color: '#dae5a5' },
          { id: 'budgets', icon: ChartBarIcon, label: t.budgets, color: '#feb0ec' },
          { id: 'envelopes', icon: ArchiveBoxIcon, label: t.envelopes, color: '#9bd7fe' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm active:scale-95 transition-all border border-gray-100 dark:border-gray-700"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: `${item.color}20`, color: item.color }}
            >
              <item.icon className="w-5 h-5 stroke-[2px]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-black tracking-tight">{t.history}</h2>
          <button 
            onClick={() => setActiveTab('all_transactions')}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase"
          >
            View All
          </button>
        </div>
        <div className="space-y-2">
          {transactions.slice(0, 10).map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => onEditTransaction(tx)}
              className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-700 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: tx.type === TransactionType.INCOME ? '#10B98120' : tx.type === TransactionType.EXPENSE ? '#F43F5E20' : '#3B82F620' }}
                >
                  {tx.type === TransactionType.INCOME ? '💸' : tx.type === TransactionType.EXPENSE ? '🛒' : '🔄'}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{tx.category || (tx.type === TransactionType.TRANSFER ? 'Transfer' : 'Other')}</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`font-black text-sm ${tx.type === TransactionType.INCOME ? 'text-green-500' : tx.type === TransactionType.EXPENSE ? 'text-rose-500' : 'text-blue-500'}`}>
                    {tx.type === TransactionType.INCOME ? '+' : tx.type === TransactionType.EXPENSE ? '-' : ''}{tx.amount.toLocaleString()} {tx.currency}
                  </p>
                  {tx.isAuto && <span className="text-[8px] font-black text-blue-400 uppercase">Auto</span>}
                </div>
                <PencilIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-gray-400 font-bold italic">No transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
