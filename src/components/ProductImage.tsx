import React, { useState } from 'react';
import { Product } from '../types';
import { Maximize2, X, Sparkles, Tag, Shirt, Milk, Droplets, Coffee, Sparkle } from 'lucide-react';

interface ProductImageProps {
  product: Product;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  allowZoom?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  size = 'md',
  className = '',
  allowZoom = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Determine size classes
  const sizeClasses = {
    xs: 'w-10 h-10 text-lg rounded-xl',
    sm: 'w-12 h-12 text-xl rounded-xl',
    md: 'w-16 h-16 text-2xl rounded-2xl',
    lg: 'w-20 h-20 text-3xl rounded-2xl',
    hero: 'w-24 h-24 sm:w-28 sm:h-28 text-4xl rounded-3xl',
  }[size];

  const hasValidImage = Boolean(product.imageUrl) && !imgError;

  return (
    <>
      <div
        className={`relative group/img overflow-hidden flex-shrink-0 flex items-center justify-center bg-white border border-slate-150 shadow-2xs ${sizeClasses} ${className}`}
        onClick={() => {
          if (allowZoom && hasValidImage) setIsZoomed(true);
        }}
      >
        {hasValidImage ? (
          <img
            src={product.imageUrl}
            alt={product.nameFr || product.nameAr}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          /* High-Fidelity Thematic Packshot Placeholder */
          <div
            className={`w-full h-full bg-gradient-to-br ${product.imageBg || 'from-slate-100 to-slate-200'} flex flex-col items-center justify-center relative p-1 text-center select-none`}
          >
            {/* Subtle Brand Tag Badge on top-right */}
            <span className="text-[7px] font-black text-slate-500/80 uppercase tracking-tighter truncate max-w-[90%] leading-none absolute top-1 right-1 bg-white/70 backdrop-blur-xs px-1 py-0.5 rounded-xs">
              {product.brand.split(' ')[0]}
            </span>

            {/* Central Product Icon */}
            <span className="transform group-hover/img:scale-110 transition-transform duration-200 drop-shadow-xs">
              {product.emoji}
            </span>

            {/* Volume label on bottom */}
            {size !== 'xs' && (
              <span className="text-[8px] font-black text-slate-700 bg-white/80 rounded-full px-1.5 py-0.2 mt-0.5 shadow-2xs leading-none">
                {product.volume}
              </span>
            )}
          </div>
        )}

        {/* Hover Zoom icon for hero or large images */}
        {allowZoom && hasValidImage && (
          <button
            type="button"
            className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer shadow-sm"
            title="تكبير صورة المنتج"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {isZoomed && hasValidImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative bg-white rounded-3xl p-4 max-w-sm w-full shadow-2xl flex flex-col items-center border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-3 shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.nameFr || product.nameAr}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-2"
              />
            </div>

            <div className="text-center w-full px-2">
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                {product.category}
              </span>
              <h4 className="font-black text-slate-900 text-sm">
                {product.nameFr}
              </h4>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {product.nameAr} • {product.volume}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                العلامة التجارية: <strong className="text-slate-700">{product.brand}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
