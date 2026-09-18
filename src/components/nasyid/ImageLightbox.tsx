import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { getCloudinaryOptimizedUrl } from '../../services/cloudinaryService';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  title?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex = 0,
  onClose,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when image index changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 8.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.25, 8.0));
    } else {
      setScale((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Pan / Drag handlers when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch gesture support (Pinch zoom)
  const touchStartRef = useRef<{ dist: number; scale: number }>({ dist: 0, scale: 1 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { dist, scale };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartRef.current.dist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartRef.current.dist;
      const newScale = Math.min(Math.max(touchStartRef.current.scale * factor, 1), 8.0);
      setScale(newScale);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
    }
  };

  const currentImageUrl = getCloudinaryOptimizedUrl(images[currentIndex]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between overflow-hidden select-none animate-fade-in"
      ref={containerRef}
      onWheel={handleWheel}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Floating Control Bar */}
      <div className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent text-white">
        <div className="flex flex-col">
          <span className="font-medium text-sm text-gray-200 line-clamp-1">{title}</span>
          <span className="text-xs text-gold-400 font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {scale > 1 && (
            <button
              onClick={handleResetZoom}
              className="p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
              title="Reset Zoom"
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          )}
          <button
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 transition-colors focus:outline-none"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 8}
            className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 transition-colors focus:outline-none"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none ml-2"
            title="Tutup (Esc)"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <img
          src={currentImageUrl}
          alt={`Gambar ${currentIndex + 1}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="max-h-full max-w-full object-contain pointer-events-none"
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-20 transition-all focus:outline-none backdrop-blur-sm z-10"
            aria-label="Gambar sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-20 transition-all focus:outline-none backdrop-blur-sm z-10"
            aria-label="Gambar berikutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="p-4 z-10 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                idx === currentIndex
                  ? 'border-gold-400 scale-105 opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
