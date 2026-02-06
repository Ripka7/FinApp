
import React from 'react';
import { Envelope, Transaction, TransactionType } from '../types';
import { ChevronLeftIcon, ArchiveBoxIcon, PencilIcon } from '@heroicons/react/24/outline';

interface EnvelopeDetailsSectionProps {
  t: any;
  envelope: Envelope;
  transactions: Transaction[];
  onBack: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

const EnvelopeDetailsSection: React.FC<EnvelopeDetailsSectionProps> = ({ 
  t, envelope, transactions, onBack, onEditTransaction 
}) => {
  const envelopeTransactions = transactions.filter(tx => tx.toWalletId === envelope.id);
  const progress = Math.min(100, (envelope.balance / envelope.goal) * 100);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-12">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-black tracking-tighter">{envelope.name}</h1>
      </div>

      <div className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-3xl" style={{ backgroundColor: `${envelope.color}15`, color: envelope.color }}>
              <ArchiveBoxIcon className="w-8 h-8 stroke-[2px]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.goal}</p>
              <h3 className="font-black text-xl">{envelope.goal.toLocaleString()} {envelope.currency}</h3>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Current Balance</span>
              <span className="text-4xl font-black">{envelope.balance.toLocaleString()} {envelope.currency}</span>
            </div>
            <span className="text-sm font-black text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%`, backgroundColor: envelope.color }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black tracking-tight">{t.history}</h2>
        <div className="space-y-2">
          {envelopeTransactions.map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => onEditTransaction(tx)}
              className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-700 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                  🔄
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{tx.category || 'Transfer'}</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-black text-sm text-blue-500">
                    +{tx.amount.toLocaleString()} {tx.currency}
                  </p>
                </div>
                <PencilIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </div>
          ))}
          {envelopeTransactions.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-400 font-bold italic">No history found for this envelope.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnvelopeDetailsSection;
