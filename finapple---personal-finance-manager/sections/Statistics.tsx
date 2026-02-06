
import React, { useState, useMemo } from 'react';
import { Transaction, Investment, AppSettings, TransactionType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatisticsSectionProps {
  t: any;
  transactions: Transaction[];
  investments: Investment[];
  settings: AppSettings;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ t, transactions, investments, settings }) => {
  const [filterType, setFilterType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [timeframe, setTimeframe] = useState('month');

  const chartData = useMemo(() => {
    // Mock data for visualization based on timeframe
    return [
      { name: 'Week 1', value: 4000 },
      { name: 'Week 2', value: 3000 },
      { name: 'Week 3', value: 2000 },
      { name: 'Week 4', value: 2780 },
    ];
  }, [transactions, timeframe, filterType]);

  return (
    <div className="pt-8 space-y-6">
      <h1 className="text-3xl font-bold">{t.statistics}</h1>

      <div className="flex flex-wrap gap-2">
        {[TransactionType.INCOME, TransactionType.EXPENSE, TransactionType.INVESTMENT].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              filterType === type 
              ? 'bg-opacity-100 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}
            style={{ backgroundColor: filterType === type ? settings.accentColor : undefined }}
          >
            {type === TransactionType.INCOME ? t.addIncome : type === TransactionType.EXPENSE ? t.addExpense : t.addInvestment}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-80">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">Trend</h2>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="text-sm bg-gray-50 dark:bg-gray-700 p-1 px-2 rounded-lg border-none ring-1 ring-gray-200 dark:ring-gray-600"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={settings.accentColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={settings.accentColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.4} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="value" stroke={settings.accentColor} strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Detailed Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total</p>
            <p className="text-2xl font-bold mt-1">11,780 ₴</p>
          </div>
          <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Avg Daily</p>
            <p className="text-2xl font-bold mt-1">392 ₴</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
