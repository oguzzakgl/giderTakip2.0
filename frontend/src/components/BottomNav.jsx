import './BottomNav.css';

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Özet' },
  { id: 'giderler', icon: '🧾', label: 'Giderler' },
  { id: 'ekle', icon: '➕', label: 'Ekle' },
  { id: 'chat', icon: '🤖', label: 'AI Asistan' },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'nav-item--active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
          {active === item.id && <span className="nav-indicator" />}
        </button>
      ))}
    </nav>
  );
}
