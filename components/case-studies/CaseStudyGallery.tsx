'use client';

import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface CaseStudyGalleryProps {
  images: string[];
  title: string;
}

export default function CaseStudyGallery({ images, title }: CaseStudyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[selectedIndex] || images[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Images className="w-5 h-5 text-gold-400" />
          <span>Dashboard & Gallery Screenshots</span>
        </h3>
        <span className="text-xs text-slate-400">
          {selectedIndex + 1} of {images.length}
        </span>
      </div>

      {/* Main Image Display */}
      <div className="relative group glass-panel rounded-2xl overflow-hidden border border-gold-400/20 aspect-[16/9] max-h-[500px] bg-surface-dark flex items-center justify-center p-2 sm:p-4">
        <img
          src={currentImage}
          alt={`${title} showcase ${selectedIndex + 1}`}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Action Overlay */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/80 hover:bg-gold-400 text-white hover:text-slate-950 transition-all border border-slate-700 hover:border-gold-400 backdrop-blur-md opacity-90 sm:opacity-0 group-hover:opacity-100"
          title="Open Lightbox Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-gold-400 text-white hover:text-slate-950 transition-all border border-slate-700 hover:border-gold-400 backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-gold-400 text-white hover:text-slate-950 transition-all border border-slate-700 hover:border-gold-400 backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative rounded-xl overflow-hidden aspect-[16/9] border transition-all bg-surface-dark ${
                selectedIndex === idx
                  ? 'border-gold-400 ring-2 ring-gold-400/40 opacity-100 scale-105'
                  : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:border-gold-400 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-6xl w-full max-h-[85vh] flex items-center justify-center relative">
            <img
              src={currentImage}
              alt={`${title} Fullscreen ${selectedIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-gold-400/30"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:-left-12 p-3 rounded-full bg-slate-900/90 text-white hover:text-gold-400 border border-slate-700 hover:border-gold-400"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:-right-12 p-3 rounded-full bg-slate-900/90 text-white hover:text-gold-400 border border-slate-700 hover:border-gold-400"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
