import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={toggleSidebar} className="menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ff9d">
            <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 44 44">
            <polygon points="22,2 42,12 42,32 22,42 2,32 2,12" fill="none" stroke="#00ff9d" strokeWidth="2" />
            <polygon points="22,8 36,15 36,29 22,36 8,29 8,15" fill="none" stroke="rgba(0,207,255,0.5)" strokeWidth="1" />
            <text x="22" y="26" textAnchor="middle" fill="#00ff9d" fontSize="12" fontFamily="Orbitron" fontWeight="900">S</text>
          </svg>
          <div>
            <div className="logo-text">SENTINEL</div>
            <div className="logo-sub">FEDERATED AI SECURITY NETWORK</div>
          </div>
        </div>
      </div>

      <div className="header-status">
        {user && (
          <>
            <div className="status-badge">
              <span className="pulse-dot green" />
              <span>{user.name} · {user.country === 'SN' ? 'Sénégal' : 'Admin'}</span>
            </div>
            <div className="status-badge">
              <span className="pulse-dot yellow" />
              <span>Session active</span>
            </div>
          </>
        )}
        <div className="header-time">
          {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        {user && (
          <button onClick={logout} className="logout-btn">
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
}