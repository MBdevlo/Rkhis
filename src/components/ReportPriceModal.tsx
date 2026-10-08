import React, { useState } from 'react';
import { Product, StoreId, PriceReport } from '../types';
import { STORES } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { ProductImage } from './ProductImage';
import { formatDH } from '../utils/pricing';
import { Flag, X, CheckCircle, AlertTriangle } from 'lucide-react';

interface ReportPriceModalProps {
  product: Product | null;
  onClose: () => void;
  cityName: string;
  onReportSubmitted: (report: PriceReport) => void;
}

export const ReportPriceModal: React.FC<ReportPriceModalProps> = ({
  product,
  onClose,
  cityName,
  onReportSubmitted,
}) => {
  const [selectedStore, setSelectedStore] = useState<StoreId>('bim');
  const [reportedPrice, setReportedPrice] = useState<string>('');
  const [reason, setReason] = useState<string>('تغير السعر في الرف');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!product) return null;

  const currentPrice = product.prices[selectedStore];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(reportedPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const newReport: PriceReport = {
      id: `rep-${Date.now()}`,
      productId: product.id,
      productName: product.nameAr,
      storeId: selectedStore,
      city: cityName,
      reportedPrice: priceNum,
      reason,
      timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
    };

    onReportSubmitted(newReport);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-rose-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">تبليغ عن ثمن خاطئ</h3>
              <p className="text-xs text-slate-500">
                ساعد المجتمع في تصحيح الأسعار في {cityName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-800">شكراً على مساهمتك!</h4>
            <p className="text-sm text-slate-500 max-w-xs">
              تم تسجيل بلاغك وسيتم مراجعته وتحديث ثمن {product.nameAr} فوراً في قاعدة بيانات التطبيق.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
            {/* Product summary */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <ProductImage product={product} size="xs" />
              <div>
                <p className="font-extrabold text-slate-800 text-sm">{product.nameAr}</p>
                <p className="text-xs text-slate-400">{product.brand} - {product.volume}</p>
              </div>
            </div>

            {/* Choose Store */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                اختر المتجر المعني بالخطأ:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['marjane', 'carrefour', 'aswak', 'bim'] as StoreId[]).map((s) => {
                  const isSelected = selectedStore === s;
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSelectedStore(s)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/70 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <StoreLogo storeId={s} className="w-5 h-5 text-[9px]" />
                        <span className="text-xs font-bold text-slate-800">{STORES[s].nameAr}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">
                        {formatDH(product.prices[s])}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  السعر المسجل حالياً:
                </label>
                <div className="p-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">
                  {formatDH(currentPrice)}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  السعر الحقيقي الذي وجدته:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={reportedPrice}
                    onChange={(e) => setReportedPrice(e.target.value)}
                    placeholder="مثلاً: 18.50"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm font-bold shadow-sm"
                  />
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-bold">
                    DH
                  </span>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                سبب البلاغ:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-medium cursor-pointer"
              >
                <option value="تغير السعر في الرف">تغير السعر في الرف (ثمن جديد)</option>
                <option value="تخفيض في الكتالوج / برومو">تخفيض في الكتالوج أو برومو خاص</option>
                <option value="خطأ مطبعي في التطبيق">خطأ مطبعي في التطبيق</option>
                <option value="المنتج غير متوفر بهذا المتجر">المنتج نفذ أو غير متوفر بهذا المتجر</option>
                <option value="سعر الصندوق يختلف عن الرف">سعر الصندوق يختلف عن ملصق الرف</option>
              </select>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-slate-500 text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>مساهمات المواطنين والمشترين هي ما يجعل تطبيق أرخص دقيقاً 100%.</span>
            </div>

            {/* Submit buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                إرسال البلاغ للتأكيد
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
