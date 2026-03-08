import './BottomNav.css';

import { Home, PlusCircle, PieChart, Settings, Bot } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: <Home size={24} />, label: 'Ana Sayfa' },
    { id: 'ekle', icon: <PlusCircle size={24} />, label: 'Ekle' },
    { id: 'analiz', icon: <PieChart size={24} />, label: 'Analiz' },
    { id: 'chat', icon: <Bot size={24} />, label: 'AI Asistan' },
    { id: 'settings', icon: <Settings size={24} />, label: 'Veri' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
