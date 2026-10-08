import React, { useState } from 'react';
import { Product, StoreId } from '../types';
import { STORES } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { ProductImage } from './ProductImage';
import { formatDH } from '../utils/pricing';
import { TrendingDown, X, Calendar, AlertCircle } from 'lucide-react';

interface PriceHistoryModalProps {
  product: Product | null;
  onClose: () => void;
  cityName: string;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
  product,
  onClose,
  cityName,
}) => {
  const [activeStore, setActiveStore] = useState<StoreId | 'all'>('all');

  if (!product) return null;

  const history = product.history30d;

  // Calculate min & max price in history to scale chart
  let allHistoricalPrices: number[] = [];
  history.forEach((h) => {
    allHistoricalPrices.push(h.marjane, h.carrefour, h.aswak, h.bim);
  });
  const minVal = Math.min(...allHistoricalPrices);
  const maxVal = Math.max(...allHistoricalPrices);
  const paddingRange = Math.max((maxVal - minVal) * 0.2, 1);
  const chartMin = Math.max(0, minVal - paddingRange);
  const chartMax = maxVal + paddingRange;

  const getYCoord = (val: number, height: number) => {
    if (chartMax === chartMin) return height / 2;
    return height - ((val - chartMin) / (chartMax - chartMin)) * height;
  };

  const chartHeight = 180;
  const chartWidth = 500;
  const stepX = chartWidth / (history.length - 1);

  const getStorePolyline = (storeId: StoreId) => {
    return history
      .map((pt, i) => {
        const x = i * stepX;
        const y = getYCoord(pt[storeId], chartHeight);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const storeColors: Record<StoreId, string> = {
    marjane: '#004B93',
    carrefour: '#00387B',
    aswak: '#047857',
    bim: '#DC2626',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-emerald-50 to-white">
          <div className="flex items-center gap-3">
            <ProductImage product={product} size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  تطور الأسعار لـ 30 يوماً
                </span>
                <span className="text-xs text-slate-400">في {cityName}</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-800 line-clamp-1 mt-0.5">
                {product.nameAr}
              </h3>
              <p className="text-xs text-slate-400">{product.nameFr}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Store Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto text-xs">
            <button
              onClick={() => setActiveStore('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeStore === 'all'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              جميع المتاجر (4)
            </button>
            {(['marjane', 'carrefour', 'aswak', 'bim'] as StoreId[]).map((s) => (
              <button
                key={s}
                onClick={() => setActiveStore(s)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  activeStore === s
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: storeColors[s] }}
                />
                {STORES[s].nameAr}
              </button>
            ))}
          </div>

          {/* Current prices overview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['marjane', 'carrefour', 'aswak', 'bim'] as StoreId[]).map((s) => {
              const currentP = product.prices[s];
              const pastP = history[0][s];
              const diff = currentP - pastP;
              return (
                <div
                  key={s}
                  className={`p-3 rounded-2xl border transition-all ${
                    activeStore === s || activeStore === 'all'
                      ? 'bg-slate-50 border-slate-200'
                      : 'opacity-40 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <StoreLogo storeId={s} className="w-5 h-5 text-[9px]" />
                    <span className="text-[11px] font-bold text-slate-500">
                      {STORES[s].nameAr}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {formatDH(currentP)}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] mt-0.5">
                    {diff < 0 ? (
                      <span className="text-emerald-600 font-bold flex items-center">
                        ↓ {Math.abs(diff).toFixed(2)} DH (انخفض)
                      </span>
                    ) : diff > 0 ? (
                      <span className="text-red-500 font-bold">
                        ↑ +{diff.toFixed(2)} DH (ارتفع)
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">مستقر (0.00 DH)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart SVG */}
          <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
              <span className="flex items-center gap-1.5 font-bold">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                منحنى الأسعار آخر 30 يوماً
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                تحديث يومي دوري
              </span>
            </div>

            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
                className="w-full h-44 overflow-visible"
              >
                {/* Horizontal reference grid lines */}
                {[0.25, 0.5, 0.75].map((factor, idx) => {
                  const y = chartHeight * factor;
                  return (
                    <line
                      key={idx}
                      x1="0"
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Plot line for each store */}
                {(['marjane', 'carrefour', 'aswak', 'bim'] as StoreId[]).map((s) => {
                  if (activeStore !== 'all' && activeStore !== s) return null;
                  const pts = getStorePolyline(s);
                  return (
                    <g key={s}>
                      <polyline
                        fill="none"
                        stroke={storeColors[s]}
                        strokeWidth={activeStore === s ? '3.5' : '2'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={pts}
                      />
                      {/* Dots on data points */}
                      {history.map((pt, i) => {
                        const cx = i * stepX;
                        const cy = getYCoord(pt[s], chartHeight);
                        return (
                          <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r={i === history.length - 1 ? 4.5 : 2.5}
                            fill={storeColors[s]}
                            stroke="#0f172a"
                            strokeWidth="1.5"
                          />
                        );
                      })}
                    </g>
                  );
                })}

                {/* Date labels on bottom */}
                {history.map((pt, i) => {
                  if (i % 2 !== 0 && i !== history.length - 1) return null;
                  const x = i * stepX;
                  return (
                    <text
                      key={i}
                      x={x}
                      y={chartHeight + 20}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {pt.date}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3 pt-3 border-t border-slate-800 text-[11px]">
              {(['marjane', 'carrefour', 'aswak', 'bim'] as StoreId[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: storeColors[s] }}
                  />
                  <span className="text-slate-300 font-semibold">{STORES[s].nameAr}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p>
              يتم جمع وتحديث الأسعار دورياً من الفواتير والزيارات الميدانية في متاجر {cityName}. يمكنك التبليغ إن لاحظت فرقاً في متجرك المحلي!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
