
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { ChevronLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

interface AllTransactionsSectionProps {
  t: any;
  transactions: Transaction[];
  onEditTransaction: (tx: Transaction) => void;
  setActiveTab: (tab: string) => void;
}

const AllTransactionsSection: React.FC<AllTransactionsSectionProps> = ({ 
  t, transactions, onEditTransaction, setActiveTab 
}) => {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' ? true : tx.type === filter
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-12">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setActiveTab('home')}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-black tracking-tighter">{t.history}</h1>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', TransactionType.INCOME, TransactionType.EXPENSE, TransactionType.TRANSFER].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              filter === f 
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
              : 'bg-white dark:bg-gray-800 text-gray-400'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredTransactions.map((tx) => (
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
        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-400 font-bold italic">No transactions found matching filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTransactionsSection;
