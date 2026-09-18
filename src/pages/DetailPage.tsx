import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Nasyid } from '../types/nasyid';
import { getNasyidById } from '../repositories/nasyidRepository';
import { ImageLightbox } from '../components/nasyid/ImageLightbox';
import { getCloudinaryOptimizedUrl } from '../services/cloudinaryService';
import { ArrowLeft, Maximize2, Music2, Image as ImageIcon } from 'lucide-react';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nasyid, setNasyid] = useState<Nasyid | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getNasyidById(id)
      .then((data) => {
        if (data) {
          setNasyid(data);
        } else {
          setError('Nasyid tidak ditemukan');
        }
      })
      .catch((err) => {
        console.error('Fetch detail error:', err);
        setError('Gagal memuat detail nasyid.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dark dark:bg-darkBg-base flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gold-400 border-t-transparent mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Memuat detail nasyid...</p>
      </div>
    );
  }

  if (error || !nasyid) {
    return (
      <div className="min-h-screen bg-surface-dark dark:bg-darkBg-base flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-darkBg-card rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-darkBg-border shadow-sm">
          <Music2 className="w-12 h-12 text-gold-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{error || 'Data Tidak Ditemukan'}</h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-400 text-primary-dark font-semibold text-sm hover:bg-gold-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    );
  }

  const hasImages = nasyid.images && nasyid.images.length > 0;

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-darkBg-base text-gray-900 dark:text-gray-100 flex flex-col transition-colors">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-darkBg-surface/90 backdrop-blur-md border-b border-gray-100 dark:border-darkBg-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-darkBg-card transition-colors focus:outline-none"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 text-center truncate">
            <h1 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg truncate font-outfit">
              {nasyid.judul}
            </h1>
            {hasImages && (
              <p className="text-xs text-gold-600 dark:text-gold-400 font-medium">
                {currentImageIndex + 1} / {nasyid.images.length} Gambar
              </p>
            )}
          </div>

          <div className="w-9" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Main Image Banner / Slider */}
        {hasImages ? (
          <div className="bg-white dark:bg-darkBg-card rounded-3xl overflow-hidden border border-gray-100 dark:border-darkBg-border shadow-sm space-y-4 p-4">
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative group aspect-[16/10] sm:aspect-[16/9] w-full bg-gray-950 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center"
            >
              <img
                src={getCloudinaryOptimizedUrl(nasyid.images[currentImageIndex])}
                alt={nasyid.judul}
                className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
              />

              {/* Fullscreen Overlay Hint */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-medium text-sm">
                <Maximize2 className="w-6 h-6 text-gold-400" />
                <span>Klik untuk Zoom & Fullscreen</span>
              </div>

              {/* Counter Badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
                <span>
                  {currentImageIndex + 1} / {nasyid.images.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip if multiple images */}
            {nasyid.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1">
                {nasyid.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      idx === currentImageIndex
                        ? 'border-gold-400 ring-2 ring-gold-400/30 scale-105'
                        : 'border-gray-200 dark:border-darkBg-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 bg-white dark:bg-darkBg-card rounded-2xl border border-gray-100 dark:border-darkBg-border text-center text-gray-500 dark:text-gray-400">
            Tidak ada gambar untuk nasyid ini.
          </div>
        )}

        {/* Lirik Section */}
        {nasyid.lirik && (
          <div className="bg-white dark:bg-darkBg-card rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-darkBg-border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-darkBg-border pb-3 font-outfit flex items-center gap-2">
              <Music2 className="w-5 h-5 text-gold-500" />
              <span>Lirik Nasyid</span>
            </h2>
            <div className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed font-sans text-base">
              {nasyid.lirik}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {isLightboxOpen && hasImages && (
        <ImageLightbox
          images={nasyid.images}
          initialIndex={currentImageIndex}
          onClose={() => setIsLightboxOpen(false)}
          title={nasyid.judul}
        />
      )}
    </div>
  );
};
