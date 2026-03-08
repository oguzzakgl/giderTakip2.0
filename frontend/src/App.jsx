import { useState, useEffect, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import GiderListesi from './components/GiderListesi';
import GiderEkle from './components/GiderEkle';
import AIChat from './components/AIChat';
import './App.css';

// AI Chat için API (sadece Gemini erişimi için)
// Netlify deploy'da VITE_API_URL env değişkeniyle üstüne yazılır
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;


// Her cihazın kendi giderleri kendi localStorage'ında saklanır
const STORAGE_KEY = 'giderTakip_giderler';

function storageYukle() {
  try {
    const veri = localStorage.getItem(STORAGE_KEY);
    return veri ? JSON.parse(veri) : [];
  } catch {
    return [];
  }
}

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
      setGiderler(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
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
        {renderEkran()}
      </main>
      <BottomNav active={aktifEkran} onChange={setAktifEkran} />
    </div>
  );
}
