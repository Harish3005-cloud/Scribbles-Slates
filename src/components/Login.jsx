import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

const Login = ({ onBack, onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      return setError('Please fill all fields');
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('userInfo', JSON.stringify(data));
      if (onLogin) onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="form-card">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={14} /> Back to Home
        </button>
        
        <h2 className="form-title font-serif">Welcome Back</h2>
        <p className="form-subtitle">Continue your journey with the finest tools.</p>
        
        {error && <div style={{ color: '#ea580c', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="form-fields">
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
              placeholder="Password" 
              className="form-input" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p className="form-footer">
          Don't have an account? <span className="text-link" onClick={onBack}>Register via Homepage</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
