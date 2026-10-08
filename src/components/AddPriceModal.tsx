import React, { useState } from 'react';
import { Product, StoreId } from '../types';
import { STORES } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { PlusCircle, X, CheckCircle, Sparkles } from 'lucide-react';

interface AddPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
  onProductAdded: (newProduct: Product) => void;
}

export const AddPriceModal: React.FC<AddPriceModalProps> = ({
  isOpen,
  onClose,
  cityName,
  onProductAdded,
}) => {
  const [nameAr, setNameAr] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('الزيوت والمواد الأساسية');
  const [volume, setVolume] = useState('1 كغ');
  const [emoji, setEmoji] = useState('🛒');
  const [imageUrl, setImageUrl] = useState('');
  const [pMarjane, setPMarjane] = useState('');
  const [pCarrefour, setPCarrefour] = useState('');
  const [pAswak, setPAswak] = useState('');
  const [pBim, setPBim] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    const pm = parseFloat(pMarjane) || 20;
    const pc = parseFloat(pCarrefour) || 21;
    const pa = parseFloat(pAswak) || 19.5;
    const pb = parseFloat(pBim) || 18.9;

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      nameAr,
      nameFr: nameFr || nameAr,
      brand: brand || 'منتج مغربي',
      category,
      volume: volume || 'وحدة',
      barcode: `611${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      emoji: emoji || '🛍️',
      imageBg: 'from-emerald-100 to-teal-50',
      imageUrl: imageUrl.trim() || undefined,
      prices: {
        marjane: pm,
        carrefour: pc,
        aswak: pa,
        bim: pb,
      },
      updatedAt: 'الآن (مساهمة من المجتمع)',
      isCustom: true,
      history30d: [
        { date: 'اليوم', marjane: pm, carrefour: pc, aswak: pa, bim: pb }
      ],
    };

    onProductAdded(newProd);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-emerald-50 via-teal-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-slate-800">أضف ثمناً أو منتجاً جديداً</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  مشاركة مجتمعية
                </span>
              </div>
              <p className="text-xs text-slate-500">
                شارك أسعار متجرك في {cityName} لمساعدة المغاربة على المقارنة
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

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-800">تمت إضافة المنتج بنجاح!</h4>
            <p className="text-sm text-slate-500 max-w-xs">
              شكراً على مساهمتك القيمة. يظهر المنتج الآن في قائمة المنتجات وقفة التوفير فوراً.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
            {/* Product Basic Info */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المنتج بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثلاً: زيت الزيتون واد سوس 1 لتر"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    الاسم بالفرنسية (اختياري)
                  </label>
                  <input
                    type="text"
                    value={nameFr}
                    onChange={(e) => setNameFr(e.target.value)}
                    placeholder="Ex: Huile d'olive 1L"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    العلامة التجارية (Brand)
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="مثلاً: Lesieur, Jaouda..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    الفئة
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                  >
                    <option value="ملابس خاصة بالرجال">👔 ملابس خاصة بالرجال</option>
                    <option value="ملابس خاصة بالنساء">👗 ملابس خاصة بالنساء</option>
                    <option value="ملابس خاصة بالأطفال">🧒 ملابس خاصة بالأطفال</option>
                    <option value="الزيوت والمواد الأساسية">مواد أساسية وزيوت</option>
                    <option value="الألبان والأجبان">ألبان وأجبان</option>
                    <option value="المشروبات والماء">مشروبات وماء</option>
                    <option value="مواد التنظيف والغسيل">تنظيف وغسيل</option>
                    <option value="العناية بالأطفال والنظافة">عناية وأطفال</option>
                    <option value="الشاي والقهوة والسكر">شاي وقهوة</option>
                    <option value="بسكويت وشوكولاتة">بسكويت وحلويات</option>
                    <option value="مفروشات ومنسوجات المنزل">مفروشات ومنسوجات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    الحجم / الوزن
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="1 لتر / 5 كلغ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    أيقونة الإيموجي
                  </label>
                  <div className="flex items-center gap-1">
                    {['🫒', '🥛', '☕', '🧼', '🍫', '🛒'].map((emo) => (
                      <button
                        type="button"
                        key={emo}
                        onClick={() => setEmoji(emo)}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                          emoji === emo ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-110' : 'bg-slate-100'
                        }`}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional Product Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  رابط صورة المنتج (اختياري - Image URL)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... رابط صورة واضحة للمنتج"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
                />
              </div>
            </div>

            {/* Price Inputs for the 4 stores */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  الأسعار في المتاجر الأربعة (بالدرهم DH):
                </label>
                <span className="text-[10px] text-slate-400">حدد سعراً واحداً على الأقل</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['marjane', 'carrefour', 'aswak', 'bim'] as StoreId[]).map((s) => {
                  const val =
                    s === 'marjane'
                      ? pMarjane
                      : s === 'carrefour'
                      ? pCarrefour
                      : s === 'aswak'
                      ? pAswak
                      : pBim;
                  const setVal =
                    s === 'marjane'
                      ? setPMarjane
                      : s === 'carrefour'
                      ? setPCarrefour
                      : s === 'aswak'
                      ? setPAswak
                      : setPBim;

                  return (
                    <div key={s} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <StoreLogo storeId={s} className="w-4 h-4 text-[8px]" />
                        <span className="text-[11px] font-bold text-slate-700">
                          {STORES[s].nameAr}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.05"
                          value={val}
                          onChange={(e) => setVal(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <span className="absolute left-1.5 top-1.5 text-[10px] text-slate-400">
                          DH
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                نشر وحفظ المنتج
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
