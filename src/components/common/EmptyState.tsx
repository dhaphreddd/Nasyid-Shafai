import React from 'react';
import { Music, SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  isSearch?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  isSearch = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 mb-4 border border-gold-200">
        {isSearch ? <SearchX className="w-8 h-8" /> : <Music className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {title || (isSearch ? 'Tidak Ada Nasyid Ditemukan' : 'Belum Ada Koleksi Nasyid')}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        {message ||
          (isSearch
            ? 'Coba kata kunci pencarian lain untuk menemukan nasyid yang Anda cari.'
            : 'Belum ada data nasyid yang tersedia saat ini.')}
      </p>
    </div>
  );
};
