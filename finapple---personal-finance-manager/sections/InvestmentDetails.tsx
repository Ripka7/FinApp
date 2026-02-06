
import React from 'react';
import { Investment, AppSettings } from '../types';
import { ChevronLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ACCENT_COLORS } from '../constants';

interface InvestmentDetailsSectionProps {
  t: any;
  type: string;
  investments: Investment[];
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  onEditInvestment: (inv: Investment) => void;
  onDeleteInvestment: (id: string) => void;
}

const InvestmentDetailsSection: React.FC<InvestmentDetailsSectionProps> = ({ 
  t, type, investments, setActiveTab, settings, onEditInvestment, onDeleteInvestment 
}) => {
  const filteredInvestments = investments.filter(inv => inv.type === type);

  const allTypes = Array.from(new Set(investments.map(i => i.type)));
  const typeIndex = allTypes.indexOf(type);
  const typeColor = ACCENT_COLORS[typeIndex % ACCENT_COLORS.length];

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-12">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setActiveTab('investments')}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tighter">{type}</h1>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Detailed View</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredInvestments.map((inv) => (
          <div 
            key={inv.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: typeColor }} />
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-xl">{inv.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{inv.purchaseDate}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-2xl font-black">{inv.amount.toLocaleString()} {inv.currency}</p>
                </div>
                <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditInvestment(inv)} className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl"><PencilIcon className="w-4 h-4" /></button>
                  <button onClick={() => onDeleteInvestment(inv.id)} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 dark:border-gray-700">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Rate</p>
                <p className="font-bold">{inv.interestRate}% ({inv.interestType})</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Payout</p>
                <p className="font-bold capitalize">{inv.payoutFrequency}</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Maturity</p>
                <p className="font-bold">{inv.termDate === 'perpetual' ? 'Perpetual' : inv.termDate}</p>
              </div>
              {inv.comment && (
                <div className="col-span-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Comment</p>
                  <p className="text-sm italic text-gray-600 dark:text-gray-400">"{inv.comment}"</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredInvestments.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-bold italic">No active entries for this type.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentDetailsSection;
