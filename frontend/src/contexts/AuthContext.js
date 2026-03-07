import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const storedUser = localStorage.getItem('sentinel_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulation de connexion
    if (email === 'demo@sentinel.africa' && password === 'sentinel2024') {
      const userData = {
        id: 'USR001',
        name: 'Admin Sénégal',
        email: email,
        role: 'national_admin',
        country: 'SN',
        permissions: ['view_all', 'analyze', 'configure']
      };
      localStorage.setItem('sentinel_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: 'Identifiants incorrects' };
  };

  const logout = () => {
    localStorage.removeItem('sentinel_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};