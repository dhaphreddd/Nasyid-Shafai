import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nasyid } from '../../types/nasyid';
import { useAuth } from '../../contexts/AuthContext';
import { getCloudinaryThumbnail } from '../../services/cloudinaryService';
import { Edit2, Trash2, Music2, Image as ImageIcon } from 'lucide-react';

interface NasyidCardProps {
  nasyid: Nasyid;
  onDelete: (nasyid: Nasyid) => void;
}

export const NasyidCard: React.FC<NasyidCardProps> = ({ nasyid, onDelete }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const hasImage = nasyid.images && nasyid.images.length > 0;
  const thumbnailUrl = hasImage ? getCloudinaryThumbnail(nasyid.images[0]) : '';

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/edit/${nasyid.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(nasyid);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-card-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      <Link to={`/detail/${nasyid.id}`} className="block flex-1 focus:outline-none">
        {/* Card Thumbnail Image Area */}
        <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden flex items-center justify-center">
          {hasImage && !imageError ? (
            <img
              src={thumbnailUrl}
              alt={nasyid.judul}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300">
              <Music2 className="w-10 h-10 mb-1" />
              <span className="text-xs font-medium text-gray-400">Tanpa Gambar</span>
            </div>
          )}

          {/* Image Count Badge */}
          {hasImage && nasyid.images.length > 1 && (
            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              <span>{nasyid.images.length}</span>
            </div>
          )}
        </div>

        {/* Card Title & Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-gold-600 transition-colors line-clamp-2 leading-snug font-outfit">
              {nasyid.judul}
            </h3>
          </div>
        </div>
      </Link>

      {/* Admin Action Buttons (Visibility matching Android MainActivity checkRole & NasyidAdapter) */}
      {isAdmin && (
        <div className="px-4 pb-4 pt-1 flex items-center gap-2 border-t border-gray-50 mt-auto">
          <button
            onClick={handleEdit}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gold-400 hover:text-primary-dark text-gray-700 transition-all focus:outline-none"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-all focus:outline-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>
      )}
    </div>
  );
};
