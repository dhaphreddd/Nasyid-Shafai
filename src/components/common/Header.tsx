import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogIn, LogOut, ShieldCheck, Music2, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ subtitle }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-darkBg-surface/90 backdrop-blur-md border-b border-gray-100 dark:border-darkBg-border shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-primary-dark shadow-gold-glow group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-primary-dark" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-gray-900 dark:text-white leading-snug tracking-tight font-outfit">
              Nasyid Shafai
            </h1>
            {subtitle && (
              <p className="text-xs text-gold-600 dark:text-gold-400 font-medium">{subtitle}</p>
            )}
          </div>
        </Link>

        {/* Action Buttons: Theme Toggle + Admin Badge + Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkBg-card border border-gray-200 dark:border-darkBg-border transition-colors focus:outline-none"
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-gold-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-700" />
            )}
          </button>

          {currentUser && isAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 dark:bg-gold-900/40 text-gold-800 dark:text-gold-300 border border-gold-300 dark:border-gold-700">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
              Admin
            </span>
          )}

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-gray-200 dark:border-darkBg-border transition-colors focus:outline-none"
              title="Logout Admin"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold text-primary-dark bg-gold-400 hover:bg-gold-300 shadow-sm transition-all focus:outline-none active:scale-95"
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
