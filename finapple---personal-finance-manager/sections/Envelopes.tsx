
import React, { useState } from 'react';
import { Envelope, Transaction, AppSettings } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

interface EnvelopesSectionProps {
  t: any;
  envelopes: Envelope[];
  setEnvelopes: React.Dispatch<React.SetStateAction<Envelope[]>>;
  transactions: Transaction[];
  settings: AppSettings;
  onEnvelopeClick: (id: string) => void;
}

const EnvelopesSection: React.FC<EnvelopesSectionProps> = ({ t, envelopes, setEnvelopes, transactions, settings, onEnvelopeClick }) => {
  const [editing, setEditing] = useState<Envelope | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated: Envelope = {
      id: editing?.id || Date.now().toString(),
      name: formData.get('name') as string,
      balance: parseFloat(formData.get('balance') as string),
      goal: parseFloat(formData.get('goal') as string),
      currency: formData.get('currency') as any,
      color: formData.get('color') as string,
    };
    if (editing) setEnvelopes(prev => prev.map(ev => ev.id === editing.id ? updated : ev));
    else setEnvelopes(prev => [...prev, updated]);
    setIsOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tighter">{t.envelopes}</h1>
        <button onClick={(e) => { e.stopPropagation(); setEditing(null); setIsOpen(true); }} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <PlusIcon className="w-6 h-6" style={{ color: settings.accentColor }} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {envelopes.map((env) => {
          const progress = Math.min(100, (env.balance / env.goal) * 100);
          return (
            <div 
              key={env.id}
              onClick={() => onEnvelopeClick(env.id)}
              className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-3xl" style={{ backgroundColor: `${env.color}15`, color: env.color }}>
                    <ArchiveBoxIcon className="w-8 h-8 stroke-[2px]" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl">{env.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.goal}: {env.goal.toLocaleString()} {env.currency}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); setEditing(env); setIsOpen(true); }} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"><PencilIcon className="w-4 h-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); setEnvelopes(prev => prev.filter(e => e.id !== env.id)); }} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-xl transition-colors"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-black">{env.balance.toLocaleString()} {env.currency}</span>
                  <span className="text-sm font-black text-gray-400">{Math.round(progress)}%</span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%`, backgroundColor: env.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 space-y-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black">{editing ? t.edit : t.add} {t.envelopes}</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-widest opacity-50 block mb-2">{t.name}</label>
                <input name="name" required defaultValue={editing?.name} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest opacity-50 block mb-2">{t.balance}</label>
                  <input name="balance" type="number" required defaultValue={editing?.balance} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest opacity-50 block mb-2">{t.goal}</label>
                  <input name="goal" type="number" required defaultValue={editing?.goal} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest opacity-50 block mb-2">{t.currency}</label>
                  <select name="currency" defaultValue={editing?.currency || '₴'} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700">
                    {settings.currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest opacity-50 block mb-2">{t.color}</label>
                  <input name="color" type="color" defaultValue={editing?.color || '#3B82F6'} className="w-full h-[3.4rem] p-1 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-100 dark:ring-gray-700" />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 p-5 rounded-3xl bg-gray-100 dark:bg-gray-800 font-black uppercase tracking-widest">{t.cancel}</button>
                <button type="submit" className="flex-1 p-5 rounded-3xl text-white font-black uppercase tracking-widest" style={{ backgroundColor: settings.accentColor }}>{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvelopesSection;
