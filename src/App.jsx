import React, { useState } from 'react';
import { PenTool, UserPlus, LogIn, ChevronRight, Feather, LayoutDashboard } from 'lucide-react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import './App.css';
import FloatingStationery from './components/Stationery.jsx';

/**
 * Scribbles & Slates - Main Application
 */
 

/* ─── Main App ─── */
 
export default function App() {
  const [view, setView] = useState('landing');
 
  const LandingPage = () => (
    <div className="landing-container">
 
      {/* Floating Stationery Animation */}
      <FloatingStationery />
 
      {/* Subtle grid texture overlay */}
      <div className="landing-grid-overlay" aria-hidden="true" />
 
      <div className="content-wrapper">
        {/* Logo */}
        <div className="logo-wrapper">
          <div className="logo-box">
            <div className="logo-inner">
              <Feather size={32} />
            </div>
          </div>
        </div>
 
        {/* Branding */}
        <h1 className="main-title font-serif">
          Scribbles &amp; Slates
        </h1>
        <div className="subtitle-container">
          <div className="subtitle-line"></div>
          <p className="subtitle-text">Fine Tools for the Written Word</p>
          <div className="subtitle-line"></div>
        </div>
 
        {/* CTA Buttons */}
        <div className="button-group">
          <button onClick={() => setView('login')} className="btn btn-primary">
            <LogIn size={20} /> Login
          </button>
          <button onClick={() => setView('register')} className="btn btn-secondary">
            <UserPlus size={20} /> Register
          </button>
        </div>
 
        {/* Secondary Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '4rem', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '0.75rem 1.5rem', borderRadius: '2rem' }}
            onClick={() => setView('dashboard')}
          >
            <LayoutDashboard size={18} /> Enter Dashboard (Dev Preview)
          </button>
          <button className="guest-cta" style={{ marginTop: 0 }}>
            Browse our artisanal catalog as a guest
            <ChevronRight size={16} className="guest-cta-icon" />
          </button>
        </div>
      </div>
 
      {/* Origin Info */}
      <div className="origin-info">
        <div className="origin-text">Crafting Legacy • MMXXIV</div>
        <div className="origin-line"></div>
      </div>
    </div>
  );
 
  return (
    <div className="app-wrapper">
      {view === 'landing'   && <LandingPage />}
      {view === 'login'     && <Login    onBack={() => setView('landing')} onLogin={() => setView('dashboard')} />}
      {view === 'register'  && <Register onBack={() => setView('landing')} onRegister={() => setView('dashboard')} />}
      {view === 'dashboard' && <Dashboard onLogout={() => setView('landing')} />}
    </div>
  );
}
