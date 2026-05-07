import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Feather, Search, ShoppingCart, User, LogOut, ChevronDown, Package, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header({ onCartOpen }) {
  const { user, logout }        = useAuth();
  const { itemCount }           = useCart();
  const navigate                = useNavigate();
  const [query, setQuery]       = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef             = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-ink shadow-header">
      <div className="page-container">
        <div className="flex items-center gap-4 h-16">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center
                            group-hover:bg-gold/30 transition-colors">
              <Feather size={18} className="text-gold" />
            </div>
            <span className="font-serif text-cream text-lg font-semibold hidden sm:block whitespace-nowrap">
              Scribbles &amp; Slates
            </span>
          </Link>

          {/* ── Search Bar ───────────────────────────────────── */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <input
                id="header-search"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, categories…"
                className="w-full pl-4 pr-12 py-2.5 rounded-lg bg-white/10 border border-white/20
                           text-cream placeholder-cream/50 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-white/15
                           transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 p-1.5 rounded-md text-cream/70 hover:text-gold
                           hover:bg-white/10 transition-all"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* ── Right Actions ────────────────────────────────── */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Cart Button */}
            <button
              id="cart-btn"
              onClick={onCartOpen}
              className="relative p-2 rounded-lg text-cream/80 hover:text-cream hover:bg-white/10
                         transition-all duration-150"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1
                                 bg-gold text-ink text-xs font-bold rounded-full
                                 flex items-center justify-center animate-badge-pop">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* User Account */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                             text-cream/80 hover:text-cream hover:bg-white/10
                             transition-all duration-150 text-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center">
                    <User size={14} className="text-gold" />
                  </div>
                  <span className="hidden md:block font-medium max-w-[100px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-cardHover
                                  border border-gray-100 py-1 animate-fade-in z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="font-medium text-gray-800 text-sm truncate">{user.name}</p>
                      <p className="text-slate text-xs truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700
                                 hover:bg-parchment hover:text-ink transition-colors"
                    >
                      <Package size={15} /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700
                                   hover:bg-parchment hover:text-ink transition-colors"
                      >
                        <Shield size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger
                                 hover:bg-danger/5 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  to="/login"
                  id="login-link"
                  className="px-3 py-2 rounded-lg text-sm text-cream/80 hover:text-cream
                             hover:bg-white/10 font-medium transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  id="register-link"
                  className="px-3 py-2 rounded-lg text-sm bg-gold text-ink font-semibold
                             hover:bg-goldLight transition-all hidden sm:block"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
