import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <svg className="logo-icon" viewBox="0 0 44 44">
            <polygon points="22,2 42,12 42,32 22,42 2,32 2,12" fill="none" stroke="#00ff9d" strokeWidth="2" />
            <polygon points="22,8 36,15 36,29 22,36 8,29 8,15" fill="none" stroke="rgba(0,207,255,0.5)" strokeWidth="1" />
            <text x="22" y="26" textAnchor="middle" fill="#00ff9d" fontSize="12" fontFamily="Orbitron" fontWeight="900">S</text>
          </svg>
          <h2>SENTINEL</h2>
          <p>FEDERATED AI SECURITY NETWORK</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@sentinel.africa"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="demo-credentials">
            <p>Identifiants de démonstration :</p>
            <p className="credential">demo@sentinel.africa / sentinel2024</p>
          </div>
        </form>

        <div className="login-footer">
          <p>© 2024 Sentinel · Immunité Numérique Collective</p>
          <p className="privacy-link">Protection des données · RGPD compliant</p>
        </div>
      </div>

      <div className="login-background">
        <div className="scanning-line"></div>
      </div>
    </div>
  );
}