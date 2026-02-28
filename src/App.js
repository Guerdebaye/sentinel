import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import ThreatMap from './pages/ThreatMap';
import CommunityDetection from './pages/CommunityDetection';
import FederatedLearning from './pages/FederatedLearning';
import NationalDashboard from './pages/NationalDashboard';
import PrivacyCenter from './pages/PrivacyCenter';
import MobileApp from './pages/MobileApp';
import About from './pages/About';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './styles/global.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <div className="sentinel-app">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="app-container">
            <Sidebar isOpen={sidebarOpen} />
            <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/threat-map" element={<ProtectedRoute><ThreatMap /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><CommunityDetection /></ProtectedRoute>} />
                <Route path="/federated" element={<ProtectedRoute><FederatedLearning /></ProtectedRoute>} />
                <Route path="/national" element={<ProtectedRoute><NationalDashboard /></ProtectedRoute>} />
                <Route path="/privacy" element={<ProtectedRoute><PrivacyCenter /></ProtectedRoute>} />
                <Route path="/mobile" element={<ProtectedRoute><MobileApp /></ProtectedRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;