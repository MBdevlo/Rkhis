import React from 'react';
import { Product, MoroccanCity, StoreId, AdBanner } from '../types';
import { STORES, STORE_KEYS, getStoreBranchInfo } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { findCheapest, formatMAD } from '../utils/pricing';
import { AdSpace } from './AdSpace';
import { ProductImage } from './ProductImage';
import { Check, ArrowRight, CheckCircle2, ChevronRight, MapPin, Store, Navigation } from 'lucide-react';

interface DetailedComparisonViewProps {
  product: Product;
  city: MoroccanCity;
  onOpenStoreModal?: (storeId: StoreId) => void;
  onGoBack?: () => void;
  onOpenCityModal: () => void;
  ad?: AdBanner;
  onAdClick?: (adId: string) => void;
  adsEnabled?: boolean;
}

export const DetailedComparisonView: React.FC<DetailedComparisonViewProps> = ({
  product,
  city,
  onOpenStoreModal,
  onGoBack,
  onOpenCityModal,
  ad,
  onAdClick,
  adsEnabled = true,
}) => {
  const cheapest = findCheapest(product, city.stores, city.nameAr);
  const cheapestStoreInfo = STORES[cheapest.cheapestStore];
  const cheapestBranch = getStoreBranchInfo(cheapest.cheapestStore, city.nameAr);

  return (
    <div className="w-full max-w-md mx-auto space-y-3.5 pb-4 animate-fade-in font-sans">
      {/* Sub-header title */}
      <div className="text-center pt-1 pb-1">
        <h2 className="text-slate-900 font-extrabold text-base tracking-tight">
          مقارنة الأسعار | Comparer les prix
        </h2>
        <button
          onClick={onOpenCityModal}
          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline mt-0.5 cursor-pointer"
        >
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>المدينة: {city.nameAr} ({city.nameFr}) - تغيير</span>
        </button>
      </div>

      {/* Selected Product Card (Top White Box) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100/90 flex items-center gap-4">
        {/* Product Packshot Image */}
        <ProductImage product={product} size="hero" allowZoom={true} />

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-slate-900 text-lg leading-tight line-clamp-1">
            {product.nameFr || product.nameAr}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {product.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              • {product.brand} • {product.volume}
            </span>
          </div>

          {/* Update Badge */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
            <span>Mise à jour il y a 5 min • تم التحديث منذ</span>
          </div>
        </div>
      </div>

      {/* Best Price Hero Green Banner */}
      <div className="bg-[#15803d] text-white rounded-2xl p-3.5 shadow-sm flex items-center gap-3">
        {/* Checkmark circle */}
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-inner">
          <Check className="w-5 h-5 text-white stroke-[3]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-sm leading-tight text-white flex items-center justify-between">
            <span>أفضل سعر اليوم • Meilleur prix aujourd'hui</span>
          </div>
          <div className="text-xs text-emerald-100 font-semibold mt-0.5 truncate">
            {cheapestStoreInfo.nameFr} • {formatMAD(cheapest.minPrice)} • Vous économisez {formatMAD(cheapest.saving)}
          </div>
        </div>
      </div>

      {/* SPACE FOR ADS (Espace Publicitaire) */}
      {adsEnabled && ad && (
        <AdSpace ad={ad} onAdClick={onAdClick} position="comparison_inline" />
      )}

      {/* Comparison List Title */}
      <div className="pt-1">
        <h3 className="text-slate-900 font-extrabold text-base tracking-tight">
          مقارنة الأسعار | Comparaison des prix
        </h3>
      </div>

      {/* 4 Stores Price Cards List */}
      <div className="space-y-2.5">
        {STORE_KEYS.map((storeId) => {
          const store = STORES[storeId];
          const isCheapest = storeId === cheapest.cheapestStore;
          const price = product.prices[storeId];
          const diffPrice = price - cheapest.minPrice;
          const diffPercent = cheapest.minPrice > 0 ? ((diffPrice / cheapest.minPrice) * 100).toFixed(1) : '0';
          const branch = getStoreBranchInfo(storeId, city.nameAr);
          const isAvailable = city.stores.includes(storeId);

          return (
            <div
              key={storeId}
              className={`bg-white rounded-2xl p-3.5 border transition-all flex items-center justify-between gap-3 shadow-xs ${
                isCheapest
                  ? 'border-emerald-200 shadow-sm ring-1 ring-emerald-500/10'
                  : 'border-slate-100'
              } ${!isAvailable ? 'opacity-50' : ''}`}
            >
              {/* Store Logo & Details */}
              <div className="flex items-center gap-3 min-w-0">
                <StoreLogo storeId={storeId} className="w-11 h-11" />
                <div className="min-w-0">
                  <h4 className="font-black text-slate-900 text-base leading-tight">
                    {store.nameFr}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                    {branch.branchName} • {branch.distance}
                  </p>
                </div>
              </div>

              {/* Price Container */}
              <div className="text-right flex-shrink-0">
                {isCheapest ? (
                  /* The green highlighted box for cheapest store from mockup */
                  <div className="bg-[#dcfce7] border border-[#86efac] rounded-2xl px-3.5 py-1.5 text-center min-w-[110px]">
                    <div className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                      {formatMAD(price)}
                    </div>
                    <div className="text-[10px] font-black text-emerald-700 mt-0.5 flex items-center justify-center gap-0.5">
                      <span>✓ Le moins cher • الأرخص</span>
                    </div>
                  </div>
                ) : (
                  /* Other stores normal price box from mockup */
                  <div className="text-right pr-1 min-w-[95px]">
                    <div className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                      {formatMAD(price)}
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                      +{formatMAD(diffPrice)} • +{diffPercent}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main CTA: Aller au moins cher */}
      <div className="pt-2 space-y-2">
        <button
          onClick={() => {
            if (onOpenStoreModal) {
              onOpenStoreModal(cheapest.cheapestStore);
            }
          }}
          className="w-full bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] text-white font-extrabold py-3.5 px-5 rounded-2xl text-base shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Aller au moins cher • الذهاب إلى الأرخص</span>
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </button>

        <p className="text-center text-[11px] text-slate-400 font-semibold">
          Prix TTC • شامل الضريبة • Les prix peuvent varier en magasin
        </p>
      </div>
    </div>
  );
};

