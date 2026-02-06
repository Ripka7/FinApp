
import React, { useMemo } from 'react';
import { Investment, AppSettings } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  PlusIcon, CalendarIcon, PencilIcon, TrashIcon
} from '@heroicons/react/24/outline';
import { ACCENT_COLORS } from '../constants';

interface InvestmentsSectionProps {
  t: any;
  investments: Investment[];
  settings: AppSettings;
  onTypeClick: (type: string) => void;
  onAddInvestment: () => void;
  onEditInvestment: (inv: Investment) => void;
  onDeleteInvestment: (id: string) => void;
}

const InvestmentsSection: React.FC<InvestmentsSectionProps> = ({ 
  t, investments, settings, onTypeClick, onAddInvestment, onEditInvestment, onDeleteInvestment 
}) => {
  const chartData = useMemo(() => {
    const typesMap: Record<string, { value: number; originalSum: number; symbol: string }> = {};
    investments.forEach(inv => {
      let usdVal = inv.amount;
      if (inv.currency === '₴') usdVal /= 41;
      if (inv.currency === '€') usdVal *= 1.08;
      
      if (!typesMap[inv.type]) {
        typesMap[inv.type] = { value: 0, originalSum: 0, symbol: inv.currency };
      }
      typesMap[inv.type].value += usdVal;
      typesMap[inv.type].originalSum += inv.amount;
    });
    return Object.entries(typesMap).map(([name, data]) => ({ name, ...data }));
  }, [investments]);

  const typeColors = useMemo(() => {
    const map: Record<string, string> = {};
    chartData.forEach((item, index) => {
      map[item.name] = ACCENT_COLORS[index % ACCENT_COLORS.length];
    });
    return map;
  }, [chartData]);

  const payoutEvents = useMemo(() => {
    const events: any[] = [];
    investments.forEach(inv => {
      if (inv.interestRate <= 0) return;
      const start = new Date(inv.purchaseDate);
      const end = inv.termDate === 'perpetual' ? new Date(start.getTime() + 31536000000) : new Date(inv.termDate);
      
      let current = new Date(start);
      const interval = inv.payoutFrequency === 'semi-annual' ? 6 : inv.payoutFrequency === 'annual' ? 12 : 0;

      if (interval > 0) {
        while (current < end) {
          current.setMonth(current.getMonth() + interval);
          if (current <= end) {
            events.push({
              date: current.toISOString().split('T')[0],
              amount: (inv.amount * (inv.interestRate / 100) * (interval / 12)).toFixed(2),
              name: inv.name,
              currency: inv.currency
            });
          }
        }
      } else if (inv.payoutFrequency === 'end-of-term') {
        events.push({
          date: end.toISOString().split('T')[0],
          amount: (inv.amount * (inv.interestRate / 100)).toFixed(2),
          name: inv.name,
          currency: inv.currency
        });
      }
    });
    return events.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  }, [investments]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
          <p className="font-black text-sm uppercase tracking-wider mb-1">{data.name}</p>
          <p className="font-bold text-gray-600 dark:text-gray-400">
            {data.originalSum.toLocaleString()} {data.symbol}
          </p>
        </div>
      );
    }
    return null;
  };

  const handlePieClick = (entry: any) => {
    if (entry && entry.name) onTypeClick(entry.name);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tighter">{t.investments}</h1>
        <button onClick={onAddInvestment} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <PlusIcon className="w-6 h-6" style={{ color: settings.accentColor }} />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-black text-[10px] uppercase tracking-widest mb-6 opacity-40">{t.portfolio}</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.length > 0 ? chartData : [{ name: 'Empty', value: 1 }]}
                cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value"
                stroke="none"
                onClick={handlePieClick}
                className="cursor-pointer"
              >
                {chartData.map((item, index) => (
                  <Cell key={`cell-${index}`} fill={typeColors[item.name]} />
                ))}
                {chartData.length === 0 && <Cell fill="#F3F4F6" />}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black tracking-tight mt-4">Actions</h2>
        {investments.map(inv => (
          <div key={inv.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center group relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: typeColors[inv.type] || settings.accentColor }} />
            <div className="space-y-1 ml-2 min-w-0 flex-1">
              <h3 className="font-black text-lg truncate">{inv.name || inv.type}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
                {inv.type} • {inv.interestRate}% • {inv.payoutFrequency}
              </p>
            </div>
            <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
              <div className="text-right">
                {/* Reduced text size for amount to fit 8 chars as requested */}
                <p className="text-sm font-black whitespace-nowrap">
                  {inv.amount.toLocaleString()} {inv.currency}
                </p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEditInvestment(inv)} className="p-1 hover:text-blue-500"><PencilIcon className="w-4 h-4" /></button>
                <button onClick={() => onDeleteInvestment(inv.id)} className="p-1 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {investments.length === 0 && <p className="text-center text-gray-400 font-bold italic py-8">No actions to show.</p>}
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <CalendarIcon className="w-6 h-6 text-blue-500" />
          <h2 className="font-black text-lg">{t.payoutCalendar}</h2>
        </div>
        <div className="space-y-4">
          {payoutEvents.map((ev, i) => (
            <div key={i} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{ev.date}</p>
                <p className="font-bold">{ev.name}</p>
              </div>
              <p className="font-black text-green-500">+{ev.amount} {ev.currency}</p>
            </div>
          ))}
          {payoutEvents.length === 0 && <p className="text-center text-gray-400 font-bold italic py-4">No upcoming payouts.</p>}
        </div>
      </div>
    </div>
  );
};

export default InvestmentsSection;
