import React from 'react';
import { Product, MoroccanCity, StoreId } from '../types';
import { STORES, STORE_KEYS } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { findCheapest, formatDH } from '../utils/pricing';
import { ProductImage } from './ProductImage';
import { ShoppingBag, Sparkles, TrendingDown, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SmartBasketViewProps {
  favoriteProducts: Product[];
  city: MoroccanCity;
  onRemoveFavorite: (id: string) => void;
  onOpenExplore: () => void;
}

export const SmartBasketView: React.FC<SmartBasketViewProps> = ({
  favoriteProducts,
  city,
  onRemoveFavorite,
  onOpenExplore,
}) => {
  if (favoriteProducts.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">قفة التوفير فارغة حالياً</h3>
        <p className="text-sm text-slate-500 mb-6">
          أضف منتجاتك اليومية إلى المفضلة (بالضغط على رمز القلب ❤️) لنقارن لك تكلفة قفة الشهر بين المتاجر الأربعة ونحسب لك أقصى توفير ممكن في {city.nameAr}!
        </p>
        <button
          onClick={onOpenExplore}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>تصفح المنتجات وأضف للقفة</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    );
  }

  // Calculate totals per store
  const storeTotals: Record<StoreId, { total: number; availableCount: number }> = {
    marjane: { total: 0, availableCount: 0 },
    carrefour: { total: 0, availableCount: 0 },
    aswak: { total: 0, availableCount: 0 },
    bim: { total: 0, availableCount: 0 },
  };

  let smartOptimizedTotal = 0;
  let worstCaseTotal = 0;

  favoriteProducts.forEach((prod) => {
    const cheapest = findCheapest(prod, city.stores, city.nameAr);
    smartOptimizedTotal += cheapest.minPrice;
    worstCaseTotal += cheapest.maxPrice;

    STORE_KEYS.forEach((s) => {
      if (city.stores.includes(s)) {
        storeTotals[s].total += prod.prices[s];
        storeTotals[s].availableCount += 1;
      }
    });
  });

  const totalPossibleSavings = worstCaseTotal - smartOptimizedTotal;

  // Find cheapest single store if you want to buy everything in one place
  const storeRanking = STORE_KEYS.filter((s) => city.stores.includes(s))
    .map((s) => ({
      storeId: s,
      total: storeTotals[s].total,
    }))
    .sort((a, b) => a.total - b.total);

  const bestSingleStore = storeRanking[0];

  return (
    <div className="space-y-6">
      {/* Hero Savings Calculator Box */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-white/10 backdrop-blur-md rounded-2xl text-xl">
                🇲🇦 🧺
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  مقارنة قفة الشهر في {city.nameAr}
                </h2>
                <p className="text-xs text-emerald-200">
                  حساب دقيق لـ {favoriteProducts.length} منتج في سلتك
                </p>
              </div>
            </div>

            <div className="bg-emerald-500/30 border border-emerald-400/30 backdrop-blur-md px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold text-emerald-100">
                أقصى توفير ممكن:
              </span>
              <span className="text-sm font-black text-amber-300">
                {formatDH(totalPossibleSavings)}
              </span>
            </div>
          </div>

          {/* Smart Optimal vs Single Store comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Smart Mixed Basket */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  خيار التوفير الذكي (شراء كل منتج من الأرخص)
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  توفير خارق 🏆
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {formatDH(smartOptimizedTotal)}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                تشتري كل سلعة من المتجر الأرخص لها بين مرجان وكارفور وأسواق السلام وبيم
              </p>
            </div>

            {/* Best Single Store */}
            {bestSingleStore && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">
                    أرخص متجر واحد لشراء كل القفة دفعة واحدة
                  </span>
                  <StoreLogo storeId={bestSingleStore.storeId} className="w-5 h-5 text-[9px]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-100">
                  {formatDH(bestSingleStore.total)}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  في متجر <strong className="text-amber-300">{STORES[bestSingleStore.storeId].nameAr}</strong> لو أردت التسوق من مكان واحد فقط
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Stores Total Comparison Matrix */}
      <div>
        <h3 className="font-extrabold text-lg text-slate-800 mb-3 flex items-center gap-2">
          <span>تكلفة السلة كاملة في كل متجر:</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STORE_KEYS.map((s) => {
            const isAvail = city.stores.includes(s);
            const total = storeTotals[s].total;
            const diffWithSmart = total - smartOptimizedTotal;
            const isBestSingle = bestSingleStore && bestSingleStore.storeId === s;

            return (
              <div
                key={s}
                className={`p-4 rounded-3xl border transition-all ${
                  !isAvail
                    ? 'bg-slate-50 border-dashed border-slate-200 opacity-50'
                    : isBestSingle
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <StoreLogo storeId={s} className="w-6 h-6 text-[10px]" />
                  <span className="text-xs font-bold text-slate-700">
                    {STORES[s].nameAr}
                  </span>
                </div>

                {isAvail ? (
                  <>
                    <div className="text-lg sm:text-xl font-black text-slate-900">
                      {formatDH(total)}
                    </div>
                    <div className="text-[11px] mt-1 font-semibold">
                      {isBestSingle ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> الأوفر إجمالاً
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          أغلى بـ +{formatDH(diffWithSmart)}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 mt-2 font-medium">
                    غير متوفر في {city.nameAr}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Products List in Basket */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-extrabold text-base text-slate-800">
            المنتجات المحددة في قفتك ({favoriteProducts.length})
          </h4>
          <span className="text-xs text-slate-400">مرتبة حسب الأرخص في {city.nameAr}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {favoriteProducts.map((p) => {
            const cheapest = findCheapest(p, city.stores, city.nameAr);
            return (
              <div
                key={p.id}
                className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <ProductImage product={p} size="xs" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm line-clamp-1">
                      {p.nameAr}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{p.brand}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        أرخص عند {STORES[cheapest.cheapestStore].nameAr} ({formatDH(cheapest.minPrice)})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-black text-slate-800 hidden sm:inline">
                    {formatDH(cheapest.minPrice)}
                  </span>
                  <button
                    onClick={() => onRemoveFavorite(p.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="حذف من السلة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
