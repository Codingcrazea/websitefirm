'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Legacy System UI',
  afterLabel = 'Redesigned Modern UI',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    },
    [isDragging, handleMove]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-gold-400" />
          <span>Before & After Interface Redesign</span>
        </h3>
        <p className="text-xs text-slate-400">Drag handle to compare UI</p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] max-h-[480px] rounded-2xl overflow-hidden select-none cursor-ew-resize glass-panel border border-gold-400/20"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Full background) */}
        <div className="absolute inset-0 w-full h-full bg-surface-dark flex items-center justify-center">
          <img
            src={afterImage}
            alt={afterLabel}
            className="w-full h-full object-contain pointer-events-none"
          />
          <span className="absolute bottom-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 backdrop-blur-md">
            {afterLabel}
          </span>
        </div>

        {/* Before Image (Clipped overlay) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden bg-surface-dark flex items-center justify-start border-r border-gold-400"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className="relative h-full"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          >
            <img
              src={beforeImage}
              alt={beforeLabel}
              className="w-full h-full object-contain pointer-events-none"
            />
            <span className="absolute bottom-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 backdrop-blur-md">
              {beforeLabel}
            </span>
          </div>
        </div>

        {/* Slider Divider Bar */}
        <div
          className="absolute inset-y-0 w-0.5 bg-gold-400 shadow-[0_0_12px_rgba(223,183,108,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface border-2 border-gold-400 text-gold-400 flex items-center justify-center shadow-lg">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
