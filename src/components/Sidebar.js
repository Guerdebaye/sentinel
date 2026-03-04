import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ isOpen }) {
  const { user } = useAuth();

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard', roles: ['user', 'national_admin'] },
    { path: '/threat-map', icon: '🗺️', label: 'Carte des Menaces', roles: ['user', 'national_admin'] },
    { path: '/community', icon: '👥', label: 'Détection Communautaire', roles: ['user', 'national_admin'] },
    { path: '/federated', icon: '🧠', label: 'Apprentissage Fédéré', roles: ['national_admin'] },
    { path: '/national', icon: '🏛️', label: 'Dashboard National', roles: ['national_admin'] },
    { path: '/privacy', icon: '🔒', label: 'Centre Vie Privée', roles: ['user', 'national_admin'] },
    { path: '/mobile', icon: '📱', label: 'Application Mobile', roles: ['user', 'national_admin'] },
    { path: '/about', icon: 'ℹ️', label: 'À Propos', roles: ['user', 'national_admin'] },
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'user')
  );

  if (!isOpen) return null;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {filteredItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="network-status">
          <span className="pulse-dot green" />
          <span>Réseau: 128 nœuds actifs</span>
        </div>
        <div className="version-info">
          SENTINEL v1.0.0
        </div>
      </div>
    </aside>
  );
}