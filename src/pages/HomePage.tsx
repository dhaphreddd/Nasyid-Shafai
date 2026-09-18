import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Nasyid } from '../types/nasyid';
import { subscribeNasyidList, deleteNasyid } from '../repositories/nasyidRepository';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/common/Header';
import { SearchBar } from '../components/nasyid/SearchBar';
import { NasyidGrid } from '../components/nasyid/NasyidGrid';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Plus, AlertTriangle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [nasyidList, setNasyidList] = useState<Nasyid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<Nasyid | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeNasyidList(
      (data) => {
        setNasyidList(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        setError(`Gagal memuat data koleksi nasyid: ${err.message || 'Firebase error'}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter list client-side based on search query
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return nasyidList;
    return nasyidList.filter((item) => item.judul.toLowerCase().includes(q));
  }, [nasyidList, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteNasyid(itemToDelete.id);
      setItemToDelete(null);
    } catch (err) {
      console.error('Failed to delete nasyid:', err);
      alert('Gagal menghapus nasyid. Silakan coba lagi.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-dark dark:bg-darkBg-base transition-colors pb-24">
      <Header subtitle={`Total: ${nasyidList.length} Nasyid`} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Content Body */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900 text-center my-8">
            {error}
          </div>
        ) : filteredList.length > 0 ? (
          <NasyidGrid items={filteredList} onDelete={(item) => setItemToDelete(item)} />
        ) : (
          <EmptyState isSearch={!!searchQuery} />
        )}
      </main>

      {/* Floating Action Button (FAB) for Admin */}
      {isAdmin && (
        <Link
          to="/admin/add"
          className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-primary-dark shadow-gold-glow flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-gold-400/40"
          title="Tambah Nasyid Baru"
          aria-label="Tambah Nasyid Baru"
        >
          <Plus className="w-7 h-7" />
        </Link>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-darkBg-card rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-100 dark:border-darkBg-border animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2 font-outfit">
              Hapus Nasyid
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
              Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-900 dark:text-white">'{itemToDelete.judul}'</span>?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-darkBg-border text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-darkBg-surface transition-colors focus:outline-none"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors focus:outline-none shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
