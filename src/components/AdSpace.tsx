import React, { useState } from 'react';
import { AdBanner, StoreId } from '../types';
import { StoreLogo } from './StoreBadge';
import { ExternalLink, X, Sparkles, Tag } from 'lucide-react';

interface AdSpaceProps {
  ad?: AdBanner;
  position?: 'comparison_inline' | 'catalog_top' | 'feed_interstitial';
  onAdClick?: (adId: string) => void;
  className?: string;
  showDismiss?: boolean;
}

export const AdSpace: React.FC<AdSpaceProps> = ({
  ad,
  position = 'comparison_inline',
  onAdClick,
  className = '',
  showDismiss = true,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!ad || !ad.isActive || isDismissed) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onAdClick) {
      onAdClick(ad.id);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${ad.bgColor} p-3.5 sm:p-4 text-white shadow-md border border-white/10 transition-all ${className}`}
    >
      {/* Background soft glow decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

      {/* Top Tag Row */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="bg-black/30 backdrop-blur-md text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
            <Sparkles className="w-2.5 h-2.5" />
            {ad.badgeAr}
          </span>
          <span className="text-[10px] text-white/70 font-semibold hidden sm:inline">
            {ad.sponsorName}
          </span>
        </div>

        {showDismiss && (
          <button
            onClick={() => setIsDismissed(true)}
            className="w-5 h-5 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Masquer l'annonce"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Main Content Row */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          {ad.sponsorStore && (
            <div className="flex-shrink-0 bg-white rounded-xl p-1 shadow-sm">
              <StoreLogo storeId={ad.sponsorStore} className="w-8 h-8 text-[7px]" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-black text-sm sm:text-base leading-tight text-white line-clamp-1">
              {ad.titleAr}
            </h4>
            <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
              {ad.subtitleAr}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex-shrink-0 px-3.5 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-amber-300 font-extrabold text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap active:scale-95"
        >
          <span>{ad.ctaTextAr}</span>
          <ExternalLink className="w-3 h-3 text-slate-700" />
        </a>
      </div>
    </div>
  );
};
