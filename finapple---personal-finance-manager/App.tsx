
import React, { useState, useEffect } from 'react';
import { 
  Wallet, Budget, Envelope, Investment, Transaction, 
  AppSettings, TransactionType, Frequency 
} from './types';
import { translations } from './translations';
import { ACCENT_COLORS } from './constants';
import { 
  HomeIcon, WalletIcon, ChartBarIcon, ArchiveBoxIcon, 
  PresentationChartLineIcon, ChartPieIcon, Cog6ToothIcon, 
  Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';
import HomeSection from './sections/Home';
import WalletsSection from './sections/Wallets';
import BudgetsSection from './sections/Budgets';
import EnvelopesSection from './sections/Envelopes';
import EnvelopeDetailsSection from './sections/EnvelopeDetails';
import InvestmentsSection from './sections/Investments';
import InvestmentDetailsSection from './sections/InvestmentDetails';
import StatisticsSection from './sections/Statistics';
import SettingsSection from './sections/Settings';
import AllTransactionsSection from './sections/AllTransactions';
import TransactionModal from './components/TransactionModal';
import InvestmentModal from './components/InvestmentModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedInvestmentType, setSelectedInvestmentType] = useState<string | null>(null);
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<string | null>(null);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('finapp_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      accentColor: ACCENT_COLORS[0],
      language: 'en',
      currencies: ['₴', '$', '€'],
      categories: {
        income: ['Salary', 'Freelance', 'Gift', 'Dividend', 'Other'],
        expense: ['Food', 'Rent', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Gifts'],
        investment: ['Stock', 'Crypto', 'Real Estate', 'Bond']
      }
    };
  });

  const [wallets, setWallets] = useState<Wallet[]>([
    { id: '1', name: 'Card 1', balance: 50000, currency: '₴', color: '#9bd7fe' },
    { id: '2', name: 'Card 2', balance: 1200, currency: '$', color: '#feb0ec' },
    { id: '3', name: 'Cash', balance: 2500, currency: '₴', color: '#ffeba4' }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: 'b1', name: 'Food', limit: 8000, spent: 4500, currency: '₴', color: '#dae5a5' },
    { id: 'b2', name: 'Entertainment', limit: 3000, spent: 1200, currency: '₴', color: '#a3ebbe' }
  ]);

  const [envelopes, setEnvelopes] = useState<Envelope[]>([
    { id: 'e1', name: 'New Car', balance: 15000, goal: 35000, currency: '$', color: '#9bd7fe' },
    { id: 'e2', name: 'Vacation', balance: 2000, goal: 5000, currency: '€', color: '#feb0ec' }
  ]);

  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: 'inv1',
      type: 'ОВДП України',
      name: 'War Bonds 2025',
      amount: 45000,
      currency: '₴',
      purchaseDate: '2024-01-15',
      termDate: '2025-06-20',
      interestRate: 15.5,
      payoutFrequency: 'semi-annual',
      interestType: 'simple',
      comment: 'Support Ukraine'
    },
    {
      id: 'inv2',
      type: 'Physical Gold',
      name: 'Gold Ingot 1oz',
      amount: 2450,
      currency: '$',
      purchaseDate: '2023-11-10',
      termDate: 'perpetual',
      interestRate: 0,
      payoutFrequency: 'end-of-term',
      interestType: 'simple',
      comment: 'Safe haven asset'
    },
    {
      id: 'inv3',
      type: 'USD ($)',
      name: 'Dollar Cache',
      amount: 1000,
      currency: '$',
      purchaseDate: '2024-02-01',
      termDate: 'perpetual',
      interestRate: 0,
      payoutFrequency: 'end-of-term',
      interestType: 'simple',
      comment: 'Emergency reserve'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', type: TransactionType.INCOME, amount: 15000, currency: '₴', walletId: '1', category: 'Salary', date: '2024-03-25', isAuto: false, frequency: Frequency.NONE },
    { id: 't2', type: TransactionType.INCOME, amount: 400, currency: '$', walletId: '2', category: 'Freelance', date: '2024-03-24', isAuto: false, frequency: Frequency.NONE },
    { id: 't3', type: TransactionType.EXPENSE, amount: 1200, currency: '₴', walletId: '1', category: 'Rent', date: '2024-03-23', isAuto: false, frequency: Frequency.NONE },
    { id: 't4', type: TransactionType.EXPENSE, amount: 650, currency: '₴', walletId: '3', category: 'Food', date: '2024-03-22', isAuto: false, frequency: Frequency.NONE },
    { id: 't5', type: TransactionType.TRANSFER, amount: 100, currency: '$', walletId: '2', toWalletId: '1', category: 'Transfer', date: '2024-03-21', isAuto: false, frequency: Frequency.NONE },
    { id: 't6', type: TransactionType.TRANSFER, amount: 1000, currency: '₴', walletId: '1', toWalletId: '3', category: 'Transfer', date: '2024-03-20', isAuto: false, frequency: Frequency.NONE }
  ]);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const t = translations[settings.language];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    localStorage.setItem('finapp_settings', JSON.stringify(settings));
  }, [settings]);

  const applyImpact = (tx: Transaction, multiplier: number) => {
    if (tx.type === TransactionType.EXPENSE && tx.walletId) {
      setWallets(prev => prev.map(w => w.id === tx.walletId ? { ...w, balance: w.balance - (tx.amount * multiplier) } : w));
      if (tx.budgetId) setBudgets(prev => prev.map(b => b.id === tx.budgetId ? { ...b, spent: b.spent + (tx.amount * multiplier) } : b));
    } else if (tx.type === TransactionType.INCOME && tx.walletId) {
      setWallets(prev => prev.map(w => w.id === tx.walletId ? { ...w, balance: w.balance + (tx.amount * multiplier) } : w));
    } else if (tx.type === TransactionType.TRANSFER && tx.walletId && tx.toWalletId) {
       setWallets(prev => prev.map(w => w.id === tx.walletId ? { ...w, balance: w.balance - (tx.amount * multiplier) } : w));
       setWallets(prev => prev.map(w => w.id === tx.toWalletId ? { ...w, balance: w.balance + (tx.amount * multiplier) } : w));
    }
  };

  const handleSaveTransaction = (tx: Transaction) => {
    if (editingTransaction) {
      applyImpact(editingTransaction, -1);
      applyImpact(tx, 1);
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? tx : t));
    } else {
      applyImpact(tx, 1);
      setTransactions([tx, ...transactions]);
    }
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) applyImpact(tx, -1);
    setTransactions(prev => prev.filter(t => t.id !== id));
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const openTransactionModal = (type: TransactionType, existing?: Transaction) => {
    setModalType(type);
    setEditingTransaction(existing || null);
    setIsTransactionModalOpen(true);
  };

  const handleSaveInvestment = (inv: Investment) => {
    if (editingInvestment) setInvestments(prev => prev.map(i => i.id === editingInvestment.id ? inv : i));
    else setInvestments(prev => [...prev, inv]);
    setIsInvestmentModalOpen(false);
    setEditingInvestment(null);
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
    setIsInvestmentModalOpen(false);
    setEditingInvestment(null);
  };

  const mainNavItems = [
    { id: 'home', icon: HomeIcon, label: t.home },
    { id: 'budgets', icon: ChartBarIcon, label: t.budgets },
    { id: 'investments', icon: PresentationChartLineIcon, label: t.investments },
  ];

  const menuItems = [
    { id: 'wallets', icon: WalletIcon, label: t.wallets },
    { id: 'envelopes', icon: ArchiveBoxIcon, label: t.envelopes },
    { id: 'statistics', icon: ChartPieIcon, label: t.statistics },
    { id: 'settings', icon: Cog6ToothIcon, label: t.settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1C1C1E] transition-all duration-300">
      <main className="pb-32 pt-4 px-4 max-w-2xl mx-auto w-full">
        {activeTab === 'home' && (
          <HomeSection 
            t={t} 
            wallets={wallets} 
            settings={settings}
            transactions={transactions}
            onAddClick={(type) => openTransactionModal(type)}
            onEditTransaction={(tx) => openTransactionModal(tx.type, tx)}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'wallets' && <WalletsSection t={t} wallets={wallets} setWallets={setWallets} transactions={transactions} settings={settings} />}
        {activeTab === 'budgets' && <BudgetsSection t={t} budgets={budgets} setBudgets={setBudgets} settings={settings} />}
        {activeTab === 'envelopes' && (
          <EnvelopesSection 
            t={t} 
            envelopes={envelopes} 
            setEnvelopes={setEnvelopes} 
            transactions={transactions} 
            settings={settings} 
            onEnvelopeClick={(id) => { setSelectedEnvelopeId(id); setActiveTab('envelope_details'); }}
          />
        )}
        {activeTab === 'envelope_details' && selectedEnvelopeId && (
          <EnvelopeDetailsSection 
            t={t}
            envelope={envelopes.find(e => e.id === selectedEnvelopeId)!}
            transactions={transactions}
            onBack={() => setActiveTab('envelopes')}
            onEditTransaction={(tx) => openTransactionModal(tx.type, tx)}
          />
        )}
        {activeTab === 'investments' && (
          <InvestmentsSection 
            t={t} 
            investments={investments} 
            settings={settings} 
            onTypeClick={(type) => {
              setSelectedInvestmentType(type);
              setActiveTab('investment_details');
            }}
            onAddInvestment={() => { setEditingInvestment(null); setIsInvestmentModalOpen(true); }}
            onEditInvestment={(inv) => { setEditingInvestment(inv); setIsInvestmentModalOpen(true); }}
            onDeleteInvestment={handleDeleteInvestment}
          />
        )}
        {activeTab === 'investment_details' && (
          <InvestmentDetailsSection 
            t={t} 
            type={selectedInvestmentType || ''} 
            investments={investments} 
            setActiveTab={setActiveTab}
            settings={settings}
            onEditInvestment={(inv) => { setEditingInvestment(inv); setIsInvestmentModalOpen(true); }}
            onDeleteInvestment={handleDeleteInvestment}
          />
        )}
        {activeTab === 'statistics' && <StatisticsSection t={t} transactions={transactions} investments={investments} settings={settings} />}
        {activeTab === 'settings' && <SettingsSection t={t} settings={settings} setSettings={setSettings} />}
        {activeTab === 'all_transactions' && (
          <AllTransactionsSection 
            t={t} 
            transactions={transactions} 
            onEditTransaction={(tx) => openTransactionModal(tx.type, tx)} 
            setActiveTab={setActiveTab} 
          />
        )}
      </main>

      {/* Nav fixed to bottom edge as per design requirements */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 z-50 pb-safe shadow-2xl">
        <div className="max-w-md mx-auto h-20 flex items-center justify-around px-2">
          {mainNavItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className="flex flex-col items-center space-y-1 w-16">
              <item.icon className="w-7 h-7 transition-all duration-300" style={{ color: activeTab === item.id ? settings.accentColor : '#9CA3AF' }} />
              <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: activeTab === item.id ? settings.accentColor : '#9CA3AF' }}>{item.label}</span>
            </button>
          ))}
          <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center space-y-1 w-16">
            <Bars3Icon className="w-7 h-7 text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{t.menu}</span>
          </button>
        </div>
      </nav>

      <TransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => { setIsTransactionModalOpen(false); setEditingTransaction(null); }}
        type={modalType}
        t={t}
        wallets={wallets}
        budgets={budgets}
        envelopes={envelopes}
        settings={settings}
        transaction={editingTransaction || undefined}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
      />

      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => { setIsInvestmentModalOpen(false); setEditingInvestment(null); }}
        t={t}
        settings={settings}
        investment={editingInvestment || undefined}
        onSave={handleSaveInvestment}
      />

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end animate-in fade-in duration-200" onClick={() => setIsMenuOpen(false)}>
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t.menu}</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }} className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl space-y-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                  <item.icon className="w-8 h-8" style={{ color: settings.accentColor }} />
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
