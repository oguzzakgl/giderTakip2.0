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
  const [aktifEkran, setAktifEkran] = useState('dashboard');
  const [giderler, setGiderler] = useState(storageYukle);

  // Giderler değişince otomatik kaydet
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(giderler));
  }, [giderler]);

  // Yeni gider ekle (sadece localStorage'a)
  const handleGiderEkle = useCallback((yeniGider) => {
    const yeniKayit = {
      ...yeniGider,
      id: Date.now(),
      miktar: parseFloat(yeniGider.miktar),
    };
    setGiderler(prev => [yeniKayit, ...prev]);
    setAktifEkran('giderler');
  }, []);

  const renderEkran = () => {
    switch (aktifEkran) {
      case 'dashboard': return <Dashboard giderler={giderler} />;
      case 'giderler': return <GiderListesi giderler={giderler} />;
      case 'ekle': return <GiderEkle onEkle={handleGiderEkle} />;
      case 'chat': return <AIChat apiUrl={API_URL} giderler={giderler} />;
      default: return <Dashboard giderler={giderler} />;
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
