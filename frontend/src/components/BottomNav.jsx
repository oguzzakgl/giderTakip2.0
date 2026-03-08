import './BottomNav.css';

import { Home, PlusCircle, PieChart, Settings, Bot } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: <Home size={22} />, label: 'Ana Sayfa' },
    { id: 'ekle', icon: <PlusCircle size={22} />, label: 'Ekle' },
    { id: 'analiz', icon: <PieChart size={22} />, label: 'Analiz' },
    { id: 'chat', icon: <Bot size={22} />, label: 'Asistan' },
    { id: 'settings', icon: <Settings size={22} />, label: 'Veri' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <div className="nav-icon">{item.icon}</div>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
