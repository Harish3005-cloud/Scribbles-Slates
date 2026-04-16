import React from 'react';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';

const Register = ({ onBack }) => {
  return (
    <div className="page-container slide-up">
      <div className="form-card">
        <button 
          onClick={onBack} 
          className="back-btn"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
        
        <h2 className="form-title font-serif">Join the Circle</h2>
        <p className="form-subtitle">Create an account to start your collection.</p>
        
        <div className="form-fields">
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input type="text" placeholder="Full Name" className="form-input" />
          </div>
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input type="email" placeholder="Email Address" className="form-input" />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input type="password" placeholder="Create Password" className="form-input" />
          </div>
          <button className="submit-btn">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
