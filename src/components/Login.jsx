import React from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

const Login = ({ onBack }) => {
  return (
    <div className="page-container fade-in">
      <div className="form-card">
        <button 
          onClick={onBack} 
          className="back-btn"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
        
        <h2 className="form-title font-serif">Welcome Back</h2>
        <p className="form-subtitle">Continue your journey with the finest tools.</p>
        
        <div className="form-fields">
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input type="email" placeholder="Email Address" className="form-input" />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input type="password" placeholder="Password" className="form-input" />
          </div>
          <button className="submit-btn">
            Sign In
          </button>
        </div>
        
        <p className="form-footer">
          Don't have an account? <span className="text-link">Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
