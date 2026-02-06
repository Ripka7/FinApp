
import React from 'react';
import { Investment, AppSettings } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DEFAULT_INVESTMENT_TYPES } from '../constants';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  settings: AppSettings;
  investment?: Investment;
  onSave: (inv: Investment) => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ 
  isOpen, onClose, t, settings, investment, onSave 
}) => {
  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Investment = {
      id: investment?.id || Date.now().toString(),
      type: formData.get('type') as string,
      name: formData.get('name') as string,
      amount: parseFloat(formData.get('amount') as string),
      currency: formData.get('currency') as any,
      purchaseDate: formData.get('purchaseDate') as string,
      termDate: formData.get('termDate') as string || 'perpetual',
      interestRate: parseFloat(formData.get('interestRate') as string),
      payoutFrequency: formData.get('payoutFrequency') as any,
      interestType: formData.get('interestType') as any,
      comment: formData.get('comment') as string,
    };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-end md:items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 space-y-6 overflow-y-auto max-h-[90vh] relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black">{investment ? t.edit : t.add} {t.addInvestment}</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-full">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">{t.type}</label>
            <select name="type" defaultValue={investment?.type} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700">
              {DEFAULT_INVESTMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="col-span-full">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">{t.name}</label>
            <input name="name" required defaultValue={investment?.name} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">{t.amount}</label>
            <input name="amount" type="number" step="0.01" required defaultValue={investment?.amount} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">{t.currency}</label>
            <select name="currency" defaultValue={investment?.currency} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700">
              {settings.currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">{t.date}</label>
            <input name="purchaseDate" type="date" required defaultValue={investment?.purchaseDate} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">Maturity</label>
            <input name="termDate" type="date" defaultValue={investment?.termDate === 'perpetual' ? '' : investment?.termDate} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">Rate %</label>
            <input name="interestRate" type="number" step="0.1" required defaultValue={investment?.interestRate} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">Payout</label>
            <select name="payoutFrequency" defaultValue={investment?.payoutFrequency} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700">
              <option value="semi-annual">Semi-annual</option><option value="annual">Annual</option><option value="end-of-term">End of term</option>
            </select>
          </div>
          <div className="col-span-full">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">{t.comment}</label>
            <textarea name="comment" defaultValue={investment?.comment} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" rows={2} />
          </div>
          <div className="col-span-full flex space-x-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 p-5 rounded-3xl bg-gray-100 dark:bg-gray-800 font-black uppercase tracking-widest">{t.cancel}</button>
            <button type="submit" className="flex-1 p-5 rounded-3xl text-white font-black uppercase tracking-widest" style={{ backgroundColor: settings.accentColor }}>{t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;
