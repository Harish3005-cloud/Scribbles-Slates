import React, { useState } from 'react';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';

const Register = ({ onBack, onRegister }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      return setError('Please fill all fields');
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('userInfo', JSON.stringify(data));
      if (onRegister) onRegister();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container slide-up">
      <div className="form-card">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={14} /> Back to Home
        </button>
        
        <h2 className="form-title font-serif">Join the Circle</h2>
        <p className="form-subtitle">Create an account to start your collection.</p>
        
        {error && <div style={{ color: '#ea580c', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="form-fields">
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input 
              type="text" 
              placeholder="Full Name" 
              className="form-input" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="form-input" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input 
              type="password" 
              placeholder="Create Password" 
              className="form-input" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
