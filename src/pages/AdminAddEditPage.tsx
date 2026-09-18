import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getNasyidById, addNasyid, updateNasyid } from '../repositories/nasyidRepository';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { ArrowLeft, Upload, Trash2, ArrowLeftRight, Image as ImageIcon, CheckCircle, AlertCircle, MoveLeft, MoveRight } from 'lucide-react';

interface PreviewItem {
  id: string;
  type: 'existing' | 'new';
  url: string;
  file?: File;
}

export const AdminAddEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [judul, setJudul] = useState('');
  const [lirik, setLirik] = useState('');
  const [items, setItems] = useState<PreviewItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progressStatus, setProgressStatus] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing data in Edit mode
  useEffect(() => {
    if (!id) return;
    setFetching(true);
    getNasyidById(id)
      .then((data) => {
        if (data) {
          setJudul(data.judul);
          setLirik(data.lirik || '');
          if (data.images && data.images.length > 0) {
            setItems(
              data.images.map((url, idx) => ({
                id: `existing-${idx}`,
                type: 'existing',
                url: url,
              }))
            );
          }
        } else {
          setErrorMsg('Data Nasyid tidak ditemukan');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setErrorMsg('Gagal memuat data Nasyid');
      })
      .finally(() => setFetching(false));
  }, [id]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);
    const newItems: PreviewItem[] = selectedFiles.map((file, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      type: 'new',
      url: URL.createObjectURL(file),
      file: file,
    }));

    setItems((prev) => [...prev, ...newItems]);

    // Reset input so user can choose the same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Move item left in preview list
  const moveItemLeft = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Move item right in preview list
  const moveItemRight = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Remove preview item
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Nasyid handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedJudul = judul.trim();
    if (!trimmedJudul) {
      setErrorMsg('Judul wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const finalImageUrls: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type === 'existing') {
          finalImageUrls.push(item.url);
        } else if (item.file) {
          setProgressStatus(`Mengunggah gambar ${i + 1} dari ${items.length}...`);
          const uploadedUrl = await uploadToCloudinary(item.file);
          finalImageUrls.push(uploadedUrl);
        }
      }

      setProgressStatus('Menyimpan ke Firestore...');
      if (isEditMode && id) {
        await updateNasyid(id, {
          judul: trimmedJudul,
          lirik: lirik.trim(),
          images: finalImageUrls,
        });
      } else {
        await addNasyid({
          judul: trimmedJudul,
          lirik: lirik.trim(),
          images: finalImageUrls,
        });
      }

      navigate('/');
    } catch (err: any) {
      console.error('Save error:', err);
      setErrorMsg(err.message || 'Gagal menyimpan data Nasyid');
    } finally {
      setLoading(false);
      setProgressStatus('');
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gold-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col pb-16">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-gray-900 text-base sm:text-lg font-outfit">
            {isEditMode ? 'Edit Nasyid' : 'Tambah Nasyid Baru'}
          </h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            {/* Judul Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Judul Nasyid <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Masukkan judul nasyid..."
                disabled={loading}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:bg-white focus:outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-400/20 transition-all font-medium"
              />
            </div>

            {/* Lirik Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Lirik Nasyid <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                value={lirik}
                onChange={(e) => setLirik(e.target.value)}
                placeholder="Tuliskan lirik nasyid di sini..."
                rows={6}
                disabled={loading}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:bg-white focus:outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-400/20 transition-all font-sans"
              />
            </div>

            {/* Image Upload Area */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Gambar Nasyid ({items.length})
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-50 hover:bg-gold-100 text-gold-800 text-xs font-semibold border border-gold-200 transition-colors focus:outline-none"
                >
                  <Upload className="w-4 h-4 text-gold-600" />
                  <span>Pilih Gambar</span>
                </button>
              </div>

              {/* Image Preview Grid (with reordering support matching AddEditNasyidActivity) */}
              {items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm"
                    >
                      <img src={item.url} alt="" className="w-full h-full object-cover" />

                      {/* Reorder and Delete controls overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            disabled={loading}
                            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            title="Hapus gambar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-white">
                          <button
                            type="button"
                            onClick={() => moveItemLeft(idx)}
                            disabled={idx === 0 || loading}
                            className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30"
                            title="Geser Kiri"
                          >
                            <MoveLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold bg-black/60 px-2 py-0.5 rounded-full">
                            {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => moveItemRight(idx)}
                            disabled={idx === items.length - 1 || loading}
                            className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30"
                            title="Geser Kanan"
                          >
                            <MoveRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Klik untuk memilih gambar</p>
                  <p className="text-xs text-gray-400 mt-1">Format JPG, PNG, WEBP (bisa pilih beberapa gambar sekaligus)</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-primary-dark font-bold text-base shadow-gold-glow flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-4 focus:ring-gold-400/30 disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-dark border-t-transparent" />
                <span>{progressStatus || 'Menyimpan...'}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{isEditMode ? 'Simpan Perubahan' : 'Tambah Nasyid'}</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};
