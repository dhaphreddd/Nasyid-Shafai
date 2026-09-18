import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { LogIn, ArrowLeft, Shield, Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setErrorMsg('Email tidak boleh kosong');
      return;
    }

    if (!trimmedPassword) {
      setErrorMsg('Password tidak boleh kosong');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'Gagal Login. Periksa kembali email dan password Anda.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Email atau password yang Anda masukkan salah.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Format email tidak valid.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top back link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-primary-dark mx-auto shadow-gold-glow mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-outfit">Login Admin</h2>
        <p className="mt-1 text-sm text-gray-500">
          Masuk dengan akun admin untuk mengelola koleksi nasyid.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nasyid.com"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:bg-white focus:outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-400/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:bg-white focus:outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-400/20 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-primary-dark font-bold text-sm shadow-gold-glow flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-4 focus:ring-gold-400/30 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-dark border-t-transparent" />
                  <span>Sedang Masuk...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Admin</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
