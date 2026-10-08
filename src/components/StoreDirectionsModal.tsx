import React from 'react';
import { StoreId, Product, MoroccanCity } from '../types';
import { STORES, getStoreBranchInfo } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { formatMAD } from '../utils/pricing';
import { X, MapPin, Navigation, Clock, CheckCircle2, TrendingUp, Flag, Phone } from 'lucide-react';

interface StoreDirectionsModalProps {
  storeId: StoreId | null;
  product: Product;
  city: MoroccanCity;
  onClose: () => void;
  onOpenHistory: (p: Product) => void;
  onOpenReport: (p: Product) => void;
}

export const StoreDirectionsModal: React.FC<StoreDirectionsModalProps> = ({
  storeId,
  product,
  city,
  onClose,
  onOpenHistory,
  onOpenReport,
}) => {
  if (!storeId) return null;

  const store = STORES[storeId];
  const branch = getStoreBranchInfo(storeId, city.nameAr);
  const price = product.prices[storeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <StoreLogo storeId={storeId} className="w-9 h-9" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                {store.nameFr}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {branch.branchName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Price highlight */}
          <div className="bg-[#dcfce7] border border-[#86efac] rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 block">السعر المسجل:</span>
              <span className="text-lg font-black text-slate-900">{formatMAD(price)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                ✓ متوفر في المتجر
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>المسافة: <strong>{branch.distance}</strong> عن وسط المدينة</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>مواعيد العمل: يومياً من <strong>08:30 إلى 21:30</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>آخر تحقق من الرف: اليوم (مُعتمد)</span>
            </div>
          </div>

          {/* Quick buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenHistory(product);
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>تاريخ السعر 30d</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenReport(product);
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flag className="w-4 h-4 text-rose-500" />
              <span>بلغ عن خطأ</span>
            </button>
          </div>

          {/* Map CTA */}
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(`${store.nameFr} ${city.nameFr} Morocco`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>فتح في خرائط Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};
