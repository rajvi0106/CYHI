import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = ({ 
  user, 
  activeTab, 
  onTabChange, 
  showAI, 
  onToggleAI 
}) => {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const tabs = [
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'tasks', label: 'Tasks', icon: '  ' },
    { id: 'insights', label: 'Insights', icon: '📊' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>📅 Daily Planner</h2>
      </div>

      <div className="navbar-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        <button
          className={`ai-toggle-btn ${showAI ? 'active' : ''}`}
          onClick={onToggleAI}
          title="Toggle AI Assistant"
        >
          🤖
        </button>

        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="user-name">{user?.username || 'User'}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <div className="user-avatar-large">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details">
                  <div className="user-name-large">{user?.username || 'User'}</div>
                  <div className="user-email">{user?.email || 'user@example.com'}</div>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item">
                <span className="item-icon">⚙</span>
                Settings
              </button>
              
              <button className="dropdown-item">
                <span className="item-icon">📊</span>
                Analytics
              </button>
              
              <button className="dropdown-item">
                <span className="item-icon">❓</span>
                Help
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <span className="item-icon">🚪</span>
                Logout
              </button>
            </div>
            )}
            </div>
        </div>
    </nav>
    
  );
};

export default Navbar;