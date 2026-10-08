import React from 'react';
import { PRODUCT_CATEGORIES, ProductCategory } from '../data/categories';
import { Product } from '../types';
import { X, Layers, Check, Shirt, ShoppingBasket, Sparkles } from 'lucide-react';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
  products: Product[];
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  products,
}) => {
  if (!isOpen) return null;

  const getCount = (catName: string) => {
    return products.filter((p) => p.category === catName || p.category.includes(catName)).length;
  };

  const clothesCats = PRODUCT_CATEGORIES.filter(
    (c) => c.department === 'clothes_men' || c.department === 'clothes_women' || c.department === 'clothes_kids'
  );
  const foodCats = PRODUCT_CATEGORIES.filter((c) => c.department === 'food');
  const cleaningCats = PRODUCT_CATEGORIES.filter((c) => c.department === 'cleaning');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                أقسام وفئات السلع • Catégories
              </h3>
              <p className="text-[11px] text-slate-500">
                ملابس خاصة بالرجال، النساء، الأطفال، الأغذية والتنظيف
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

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* All category */}
          <div
            onClick={() => {
              onSelectCategory('all');
              onClose();
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛍️</span>
              <div>
                <span className="font-black text-sm block">جميع المنتجات (Toutes les catégories)</span>
                <span className={`text-[10px] ${selectedCategory === 'all' ? 'text-slate-300' : 'text-slate-400'}`}>
                  {products.length} منتج مسجل
                </span>
              </div>
            </div>
            {selectedCategory === 'all' && <Check className="w-4 h-4" />}
          </div>

          {/* Section 1: قسم الملابس (مقسم إلى 3 أقسام خاصة) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Shirt className="w-4 h-4 text-blue-600" />
              <h4 className="font-black text-xs text-slate-800">
                قسم الملابس والأزياء (رجال • نساء • أطفال)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {clothesCats.map((cat) => {
                const isSelected = selectedCategory === cat.nameAr;
                const count = getCount(cat.nameAr);
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.nameAr);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full text-slate-700 shadow-2xs border border-slate-200">
                        {count} سلع
                      </span>
                    </div>
                    <div>
                      <h5 className="font-black text-xs text-slate-900">
                        {cat.nameAr}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {cat.nameFr}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: المواد الغذائية */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 px-1">
              <ShoppingBasket className="w-4 h-4 text-emerald-600" />
              <h4 className="font-black text-xs text-slate-800">
                المواد الغذائية والتموينية (Alimentation)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {foodCats.map((cat) => {
                const isSelected = selectedCategory === cat.nameAr;
                const count = getCount(cat.nameAr);
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.nameAr);
                      onClose();
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-lg flex-shrink-0">
                        {cat.emoji}
                      </span>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 truncate">
                          {cat.nameAr}
                        </h5>
                        <p className="text-[10px] text-slate-400 truncate">
                          {cat.nameFr}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex-shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: مواد التنظيف والمنزل */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h4 className="font-black text-xs text-slate-800">
                التنظيف والعناية والمنسوجات
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cleaningCats.map((cat) => {
                const isSelected = selectedCategory === cat.nameAr;
                const count = getCount(cat.nameAr);
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.nameAr);
                      onClose();
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-lg flex-shrink-0">
                        {cat.emoji}
                      </span>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 truncate">
                          {cat.nameAr}
                        </h5>
                        <p className="text-[10px] text-slate-400 truncate">
                          {cat.nameFr}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex-shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
