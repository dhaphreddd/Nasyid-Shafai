import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, LogOut, ShieldCheck, Music2 } from 'lucide-react';

interface HeaderProps {
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ subtitle }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white shadow-gold-glow group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-primary-dark" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-gray-900 leading-snug tracking-tight font-outfit">
              Nasyid As-Shafa
            </h1>
            {subtitle && (
              <p className="text-xs text-gold-600 font-medium">{subtitle}</p>
            )}
          </div>
        </Link>

        {/* User / Admin Action Buttons */}
        <div className="flex items-center gap-3">
          {currentUser && isAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-800 border border-gold-300">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
              Admin
            </span>
          )}

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
              title="Logout Admin"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-primary-dark bg-gold-400 hover:bg-gold-300 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold-400/50 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Login Admin</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
