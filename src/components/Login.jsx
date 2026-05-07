import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login }              = useAuth();
  const navigate               = useNavigate();
  const [formData, setFormData]= useState({ email: '', password: '' });
  const [error, setError]      = useState('');
  const [loading, setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) return setError('Please fill all fields');

    try {
      setLoading(true);
      const res  = await fetch('http://localhost:5000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

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

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-cardHover p-8 space-y-6">

          {/* Brand */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-ink/10 flex items-center justify-center mx-auto mb-3">
              <Feather size={24} className="text-ink" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-slate text-sm mt-1">Continue your journey with the finest tools.</p>
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
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                id="login-email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="input-field pl-9"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="input-field pl-9"
              />
            </div>

            <button id="login-submit" type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading
                ? <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                : null
              }
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-ink font-medium hover:underline">Create one</Link>
          </p>

          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate hover:text-ink transition-colors">
            <ArrowLeft size={12} /> Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
