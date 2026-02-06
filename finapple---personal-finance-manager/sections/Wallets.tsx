
import React, { useState } from 'react';
import { Wallet, Transaction, AppSettings } from '../types';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface WalletsSectionProps {
  t: any;
  wallets: Wallet[];
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
  transactions: Transaction[];
  settings: AppSettings;
}

const WalletsSection: React.FC<WalletsSectionProps> = ({ t, wallets, setWallets, transactions, settings }) => {
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteWallet = (id: string) => {
    setWallets(wallets.filter(w => w.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedWallet: Wallet = {
      id: editingWallet?.id || Date.now().toString(),
      name: formData.get('name') as string,
      balance: parseFloat(formData.get('balance') as string),
      currency: formData.get('currency') as any,
      color: formData.get('color') as string,
    };

    if (editingWallet) {
      setWallets(wallets.map(w => w.id === editingWallet.id ? updatedWallet : w));
    } else {
      setWallets([...wallets, updatedWallet]);
    }
    setIsModalOpen(false);
    setEditingWallet(null);
  };

  return (
    <div className="pt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t.wallets}</h1>
        <button 
          onClick={() => { setEditingWallet(null); setIsModalOpen(true); }}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
          style={{ color: settings.accentColor }}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map((wallet) => (
          <div 
            key={wallet.id}
            className="p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between h-48 group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          >
            <div 
              className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -mr-16 -mt-16 rounded-full"
              style={{ backgroundColor: wallet.color }}
            />
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="text-sm font-medium opacity-60 uppercase tracking-widest">{wallet.name}</p>
                <h3 className="text-3xl font-bold mt-1">
                  {wallet.balance.toLocaleString()} <span className="text-xl font-normal opacity-50">{wallet.currency}</span>
                </h3>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => { setEditingWallet(wallet); setIsModalOpen(true); }}
                  className="p-2 rounded-full bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteWallet(wallet.id)}
                  className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-end z-10">
              <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded opacity-50" />
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" style={{ backgroundColor: wallet.color }} />
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 space-y-6">
            <h2 className="text-2xl font-bold">{editingWallet ? t.edit : t.add} {t.wallets}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.name}</label>
                <input 
                  name="name" required defaultValue={editingWallet?.name}
                  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.amount}</label>
                  <input 
                    name="balance" type="number" step="0.01" required defaultValue={editingWallet?.balance}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.currency}</label>
                  <select 
                    name="currency" defaultValue={editingWallet?.currency || '₴'}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2"
                  >
                    <option value="₴">₴ (UAH)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.color}</label>
                <input 
                  name="color" type="color" defaultValue={editingWallet?.color || '#9bd7fe'}
                  className="w-full h-12 p-1 rounded-xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 font-semibold"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit" 
                  className="flex-1 p-4 rounded-2xl text-white font-semibold"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletsSection;
