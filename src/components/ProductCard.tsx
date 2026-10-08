import React from 'react';
import { Product, MoroccanCity, StoreId } from '../types';
import { STORES, STORE_KEYS } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { findCheapest, formatDH } from '../utils/pricing';
import { ProductImage } from './ProductImage';
import { Heart, TrendingUp, Flag, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  city: MoroccanCity;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenHistory: (product: Product) => void;
  onOpenReport: (product: Product) => void;
  selectedStoreFilter?: StoreId | 'all';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  city,
  isFavorite,
  onToggleFavorite,
  onOpenHistory,
  onOpenReport,
  selectedStoreFilter = 'all',
}) => {
  const cheapest = findCheapest(product, city.stores, city.nameAr);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Top Banner / Category & Actions */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          {/* Visual Thumbnail & Basic Info */}
          <div className="flex items-start gap-3">
            <ProductImage product={product} size="md" />
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {product.brand}
                </span>
                {product.isCustom && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> مساهمة
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-slate-800 text-base leading-snug line-clamp-2">
                {product.nameAr}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {product.nameFr} • <span className="font-semibold text-slate-500">{product.volume}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                  : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isFavorite ? 'إزالة من المفضلة وقفة التوفير' : 'إضافة إلى المفضلة'}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 stroke-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Highlight Banner: Cheapest Store Badge & Savings */}
        <div className="mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between shadow-sm shadow-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-black">
              🏆
            </div>
            <div>
              <div className="text-[11px] font-medium text-emerald-100 leading-tight">
                {cheapest.badge}
              </div>
              <div className="text-xs font-black flex items-center gap-1.5">
                <span>{STORES[cheapest.cheapestStore].nameAr}</span>
                <span className="text-emerald-100 font-normal">|</span>
                <span>{formatDH(cheapest.minPrice)}</span>
              </div>
            </div>
          </div>

          {cheapest.saving > 0 ? (
            <div className="text-left bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-xl">
              <span className="text-[10px] text-emerald-100 block leading-tight">توفير يصل إلى</span>
              <span className="text-xs font-black tracking-tight text-yellow-300">
                وفر {formatDH(cheapest.saving)} ({cheapest.savingPercent}%)
              </span>
            </div>
          ) : (
            <div className="text-[10px] text-emerald-100 bg-white/10 px-2 py-0.5 rounded-lg">
              الأسعار متقاربة جداً
            </div>
          )}
        </div>
      </div>

      {/* 4 Stores Price Grid */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-2 gap-2">
          {STORE_KEYS.map((storeId) => {
            const store = STORES[storeId];
            const isAvailableInCity = city.stores.includes(storeId);
            const price = product.prices[storeId];
            const isCheapest = storeId === cheapest.cheapestStore && isAvailableInCity;
            const isFiltered = selectedStoreFilter === storeId;

            return (
              <div
                key={storeId}
                className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between ${
                  !isAvailableInCity
                    ? 'bg-slate-50/60 border-dashed border-slate-200 opacity-60'
                    : isCheapest
                    ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400/50 shadow-sm'
                    : isFiltered
                    ? 'bg-blue-50/60 border-blue-300'
                    : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <StoreLogo storeId={storeId} className="w-5 h-5 text-[9px]" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {store.nameAr}
                    </span>
                    {!isAvailableInCity ? (
                      <span className="text-[9px] text-slate-400">غير متوفر هنا</span>
                    ) : isCheapest ? (
                      <span className="text-[9px] font-extrabold text-emerald-700 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> الأرخص
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-400">
                        +{formatDH(price - cheapest.minPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-left">
                  {isAvailableInCity ? (
                    <span
                      className={`text-xs font-extrabold ${
                        isCheapest ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      {formatDH(price)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">---</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Meta & Sub Actions */}
      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>آخر تحديث:</span>
          <span className="font-semibold text-slate-600">{product.updatedAt}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Price history button */}
          <button
            onClick={() => onOpenHistory(product)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors font-medium text-[11px] cursor-pointer"
            title="شاهد منحنى الأسعار لـ 30 يوم"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>تاريخ السعر</span>
          </button>

          {/* Report wrong price button */}
          <button
            onClick={() => onOpenReport(product)}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors text-[11px] cursor-pointer"
            title="بلغ عن ثمن خاطئ"
          >
            <Flag className="w-3 h-3 text-rose-500" />
            <span className="hidden sm:inline">بلغ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
