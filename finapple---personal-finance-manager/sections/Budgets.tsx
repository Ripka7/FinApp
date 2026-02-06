
import React, { useState } from 'react';
import { Budget, AppSettings } from '../types';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface BudgetsSectionProps {
  t: any;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  settings: AppSettings;
}

const BudgetsSection: React.FC<BudgetsSectionProps> = ({ t, budgets, setBudgets, settings }) => {
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated: Budget = {
      id: editingBudget?.id || Date.now().toString(),
      name: formData.get('name') as string,
      limit: parseFloat(formData.get('limit') as string),
      spent: editingBudget?.spent || 0,
      currency: formData.get('currency') as any,
      color: formData.get('color') as string,
    };

    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === editingBudget.id ? updated : b));
    } else {
      setBudgets([...budgets, updated]);
    }
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  return (
    <div className="pt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t.budgets}</h1>
        <button 
          onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
          style={{ color: settings.accentColor }}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const remaining = Math.max(0, budget.limit - budget.spent);
          const percentageRemaining = Math.max(0, Math.min(100, (remaining / budget.limit) * 100));
          return (
            <div 
              key={budget.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{budget.name}</h3>
                  <p className="text-sm text-gray-500 font-bold">{t.remaining}: {remaining.toLocaleString()} {budget.currency}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => { setEditingBudget(budget); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-gray-600"><PencilSquareIcon className="w-5 h-5" /></button>
                  <button onClick={() => setBudgets(budgets.filter(b => b.id !== budget.id))} className="p-2 text-red-400 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                  <span>{budget.spent.toLocaleString()} {budget.currency}</span>
                  <span className="opacity-50">{budget.limit.toLocaleString()} {budget.currency}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 rounded-full"
                    style={{ width: `${percentageRemaining}%`, backgroundColor: budget.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 space-y-6">
            <h2 className="text-2xl font-bold">{editingBudget ? t.edit : t.add} {t.budgets}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.name}</label>
                <input name="name" required defaultValue={editingBudget?.name} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Limit</label>
                  <input name="limit" type="number" step="0.01" required defaultValue={editingBudget?.limit} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.currency}</label>
                  <select name="currency" defaultValue={editingBudget?.currency || '₴'} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700">
                    <option value="₴">₴</option><option value="$">$</option><option value="€">€</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.color}</label>
                <input name="color" type="color" defaultValue={editingBudget?.color || '#dae5a5'} className="w-full h-12 p-1 rounded-xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800">{t.cancel}</button>
                <button type="submit" className="flex-1 p-4 rounded-2xl text-white" style={{ backgroundColor: settings.accentColor }}>{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsSection;
