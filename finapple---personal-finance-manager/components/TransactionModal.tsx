
import React, { useEffect, useState } from 'react';
import { 
  TransactionType, Wallet, Budget, Envelope, Frequency, Transaction, Currency, AppSettings 
} from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  t: any;
  wallets: Wallet[];
  budgets: Budget[];
  envelopes: Envelope[];
  settings: AppSettings;
  transaction?: Transaction;
  onSave: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, onClose, type, t, wallets, budgets, envelopes, settings, transaction, onSave, onDelete 
}) => {
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    if (transaction) setIsRecurring(transaction.isAuto);
    else setIsRecurring(false);
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tx: Transaction = {
      id: transaction?.id || Date.now().toString(),
      type,
      amount: parseFloat(formData.get('amount') as string),
      currency: formData.get('currency') as Currency,
      walletId: formData.get('walletId') as string,
      toWalletId: formData.get('toWalletId') as string,
      envelopeId: formData.get('envelopeId') as string,
      budgetId: formData.get('budgetId') as string,
      category: formData.get('category') as string,
      date: formData.get('date') as string,
      isAuto: formData.get('isAuto') === 'on',
      frequency: formData.get('frequency') as Frequency,
      comment: formData.get('comment') as string,
    };
    onSave(tx);
  };

  const categories = type === TransactionType.INCOME 
    ? settings.categories.income 
    : type === TransactionType.INVESTMENT 
      ? settings.categories.investment 
      : settings.categories.expense;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[110] flex items-end animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1C1C1E] w-full rounded-t-[3rem] p-8 space-y-8 overflow-y-auto max-h-[92vh] shadow-2xl animate-in slide-in-from-bottom duration-500"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-black tracking-tight">
              {transaction ? t.edit : t.add} {type === TransactionType.INCOME ? t.addIncome : type === TransactionType.EXPENSE ? t.addExpense : t.addTransfer}
            </h2>
            {transaction && (
              <button 
                type="button"
                onClick={() => onDelete(transaction.id)}
                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center space-x-4">
            <input 
              name="amount" type="number" step="0.01" required 
              placeholder="0.00" autoFocus
              defaultValue={transaction?.amount}
              className="flex-1 text-5xl font-black bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white" 
            />
            <select name="currency" defaultValue={transaction?.currency || settings.currencies[0]} className="text-3xl font-bold bg-gray-50 dark:bg-gray-800 rounded-2xl border-none p-3 px-5">
              {settings.currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block">{t.wallets}</label>
              <select name="walletId" defaultValue={transaction?.walletId} className="w-full p-5 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 border-none font-bold">
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({w.balance}{w.currency})</option>)}
              </select>
            </div>

            {type === TransactionType.TRANSFER && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block">Target</label>
                <select name="toWalletId" defaultValue={transaction?.toWalletId} className="w-full p-5 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 border-none font-bold">
                  <optgroup label="Wallets">
                    {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </optgroup>
                  <optgroup label="Envelopes">
                    {envelopes.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </optgroup>
                </select>
              </div>
            )}

            {type === TransactionType.EXPENSE && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block">{t.budgets}</label>
                <select name="budgetId" defaultValue={transaction?.budgetId} className="w-full p-5 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 border-none font-bold">
                  <option value="">None</option>
                  {budgets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block">{t.categories}</label>
              <select name="category" defaultValue={transaction?.category} className="w-full p-5 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 border-none font-bold">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block">{t.date}</label>
              <input name="date" type="date" defaultValue={transaction?.date || new Date().toISOString().split('T')[0]} className="w-full p-5 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 border-none font-bold" />
            </div>

            <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800">
              <label htmlFor="isAuto" className="text-sm font-black uppercase tracking-wider">{t.auto}</label>
              <input 
                id="isAuto" name="isAuto" type="checkbox" 
                defaultChecked={transaction?.isAuto}
                onChange={e => setIsRecurring(e.target.checked)}
                className="w-7 h-7 rounded-lg text-blue-500 border-none bg-white dark:bg-gray-700" 
              />
            </div>
          </div>

          {isRecurring && (
            <div className="space-y-2 animate-in slide-in-from-top duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block">{t.frequency}</label>
              <select name="frequency" defaultValue={transaction?.frequency || Frequency.MONTHLY} className="w-full p-5 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/20 border-none font-bold text-blue-600 dark:text-blue-400">
                <option value={Frequency.DAILY}>{t.daily}</option>
                <option value={Frequency.WEEKLY}>{t.weekly}</option>
                <option value={Frequency.MONTHLY}>{t.monthly}</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block">{t.comment}</label>
            <textarea name="comment" defaultValue={transaction?.comment} className="w-full p-5 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 border-none font-bold" rows={2} />
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 p-6 rounded-[2rem] bg-gray-100 dark:bg-gray-800 font-black uppercase tracking-widest text-gray-500">{t.cancel}</button>
            <button type="submit" className="flex-1 p-6 rounded-[2rem] text-white font-black uppercase tracking-widest shadow-xl shadow-blue-500/20" style={{ backgroundColor: settings.accentColor }}>{t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
