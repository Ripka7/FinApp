
import React, { useState } from 'react';
import { AppSettings, Theme, Language } from '../types';
import { ACCENT_COLORS } from '../constants';
import { 
  SunIcon, MoonIcon, SwatchIcon, GlobeAltIcon, 
  TagIcon, CurrencyDollarIcon, PlusIcon, TrashIcon 
} from '@heroicons/react/24/outline';

interface SettingsSectionProps {
  t: any;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ t, settings, setSettings }) => {
  const [newItem, setNewItem] = useState("");

  const addCategory = (type: 'income' | 'expense' | 'investment') => {
    if (!newItem.trim()) return;
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [type]: [...prev.categories[type], newItem] }
    }));
    setNewItem("");
  };

  const removeCategory = (type: 'income' | 'expense' | 'investment', item: string) => {
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [type]: prev.categories[type].filter(i => i !== item) }
    }));
  };

  const addCurrency = () => {
    if (!newItem.trim()) return;
    setSettings(prev => ({ ...prev, currencies: [...prev.currencies, newItem] }));
    setNewItem("");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <h1 className="text-3xl font-black tracking-tighter">{t.settings}</h1>

      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <SunIcon className="w-6 h-6" />
          <h2 className="font-black text-lg">{t.theme}</h2>
        </div>
        <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800 rounded-3xl w-full">
          <button 
            onClick={() => setSettings({ ...settings, theme: 'light' })}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-2xl transition-all ${settings.theme === 'light' ? 'bg-white shadow-md font-black' : 'opacity-40'}`}
          >
            <SunIcon className="w-5 h-5" />
            <span>{t.light}</span>
          </button>
          <button 
            onClick={() => setSettings({ ...settings, theme: 'dark' })}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-2xl transition-all ${settings.theme === 'dark' ? 'bg-gray-700 text-white shadow-md font-black' : 'opacity-40'}`}
          >
            <MoonIcon className="w-5 h-5" />
            <span>{t.dark}</span>
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <SwatchIcon className="w-6 h-6" />
          <h2 className="font-black text-lg">{t.accent}</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {ACCENT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setSettings({ ...settings, accentColor: color })}
              className={`w-12 h-12 rounded-full border-4 transition-all active:scale-90 ${settings.accentColor === color ? 'border-gray-900 dark:border-white' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <input 
            type="color" 
            className="w-12 h-12 rounded-full border-none p-0 cursor-pointer overflow-hidden ring-2 ring-gray-100" 
            value={settings.accentColor}
            onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <TagIcon className="w-6 h-6" />
          <h2 className="font-black text-lg">{t.categories}</h2>
        </div>
        {(['income', 'expense', 'investment'] as const).map(type => (
          <div key={type} className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-50">{type}</h3>
            <div className="flex flex-wrap gap-2">
              {settings.categories[type].map(cat => (
                <div key={cat} className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <span className="text-sm font-bold">{cat}</span>
                  <button onClick={() => removeCategory(type, cat)} className="text-gray-300 hover:text-rose-500"><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <input 
                  placeholder="New..." 
                  value={newItem} 
                  onChange={e => setNewItem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCategory(type)}
                  className="w-24 p-2 px-3 text-sm rounded-xl bg-gray-100 dark:bg-gray-700 border-none"
                />
                <button onClick={() => addCategory(type)} className="p-2 bg-gray-200 dark:bg-gray-600 rounded-xl"><PlusIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <GlobeAltIcon className="w-6 h-6" />
          <h2 className="font-black text-lg">{t.language}</h2>
        </div>
        <div className="flex space-x-4">
          {['en', 'ua'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSettings({ ...settings, language: lang as Language })}
              className={`flex-1 py-4 rounded-3xl font-black uppercase tracking-widest border-2 transition-all ${
                settings.language === lang 
                ? 'bg-white dark:bg-gray-800 border-gray-900 dark:border-white' 
                : 'bg-gray-100 dark:bg-gray-800 border-transparent opacity-40'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SettingsSection;
