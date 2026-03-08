import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import GiderEkle from './components/GiderEkle';
import AIChat from './components/AIChat';
import ExpenseCharts from './components/ExpenseCharts';
import DataManagement from './components/DataManagement';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
const STORAGE_KEY = 'giderTakip_giderler';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [giderler, setGiderler] = useState(() => {
    try {
      const veri = localStorage.getItem(STORAGE_KEY);
      return veri ? JSON.parse(veri) : [];
    } catch {
      return [];
    }
  });

  // Giderler değişince otomatik kaydet
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(giderler));
  }, [giderler]);

  const refreshData = () => {
    try {
      const guncel = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setGiderler(guncel);
    } catch {
      setGiderler([]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard giderler={giderler} onDataChange={refreshData} />;
      case 'ekle':
        return <GiderEkle onGiderEkle={refreshData} />;
      case 'analiz':
        return <ExpenseCharts giderler={giderler} />;
      case 'chat':
        return <AIChat apiUrl={API_URL} giderler={giderler} />;
      case 'settings':
        return <DataManagement onDataChange={refreshData} />;
      default:
        return <Dashboard giderler={giderler} onDataChange={refreshData} />;
    }
  };

  return (
    <div className="app">
      <main className="app-main">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
