import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowLeft, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login }              = useAuth();
  const navigate               = useNavigate();
  const [formData, setFormData]= useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError]      = useState('');
  const [loading, setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.phone || !formData.password)
      return setError('Please fill all fields');
    if (!/^\d{10}$/.test(formData.phone))
      return setError('Enter a valid 10-digit mobile number');
    if (formData.password.length < 6)
      return setError('Password must be at least 6 characters');

    try {
      setLoading(true);
      const res  = await fetch('http://localhost:5000/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      login(data.token, { _id: data._id, name: data.name, email: data.email, phone: data.phone, role: data.role });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">

        <div className="bg-white rounded-2xl shadow-cardHover p-8 space-y-6">

          {/* Brand */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-ink/10 flex items-center justify-center mx-auto mb-3">
              <Feather size={24} className="text-ink" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">Join the Circle</h1>
            <p className="text-slate text-sm mt-1">Create an account to start your collection.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-danger/5 border border-danger/20 text-danger text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                id="register-name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="input-field pl-9"
              />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                id="register-email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="input-field pl-9"
              />
            </div>

            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                id="register-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Mobile Number (10 digits)"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                className="input-field pl-9"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                id="register-password"
                type="password"
                placeholder="Create Password (min. 6 chars)"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="input-field pl-9"
              />
            </div>

            <button id="register-submit" type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading
                ? <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                : null
              }
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate">
            Already have an account?{' '}
            <Link to="/login" className="text-ink font-medium hover:underline">Sign In</Link>
          </p>

          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate hover:text-ink transition-colors">
            <ArrowLeft size={12} /> Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
