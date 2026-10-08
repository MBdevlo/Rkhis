import React from 'react';
import { Search, X, Check, Sparkles } from 'lucide-react';
import { StoreId, Product } from '../types';
import { STORES, STORE_KEYS } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { ProductImage } from './ProductImage';
import { formatMAD } from '../utils/pricing';

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStore: StoreId | 'all';
  onSelectStore: (s: StoreId | 'all') => void;
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
  categories: string[];
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  selectedStore,
  onSelectStore,
  selectedCategory,
  onSelectCategory,
  categories,
  products,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const match =
        p.nameAr.toLowerCase().includes(q) ||
        p.nameFr.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (
      selectedCategory !== 'all' &&
      p.category !== selectedCategory &&
      !p.category.includes(selectedCategory) &&
      !selectedCategory.includes(p.category)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in pt-12">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              بحث وتصفية المنتجات
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث (حليب، زيت، سيدي علي، دانون...)"
              className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs font-semibold"
              autoFocus
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-2.5 p-1 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Store filter */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onSelectStore('all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                selectedStore === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              الكل (4)
            </button>
            {STORE_KEYS.map((s) => (
              <button
                key={s}
                onClick={() => onSelectStore(s)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer border ${
                  selectedStore === s
                    ? `${STORES[s].bgColor} ${STORES[s].borderColor} ${STORES[s].textColor} ring-1 ring-emerald-500`
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <StoreLogo storeId={s} className="w-4 h-4 text-[7px]" />
                <span>{STORES[s].nameFr}</span>
              </button>
            ))}
          </div>

          {/* Categories chips */}
          <div className="flex items-center gap-1 mt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                selectedCategory === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              الجميع
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => onSelectCategory(c)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                  selectedCategory === c ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results list */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1">
          <div className="text-[11px] font-bold text-slate-400 px-2 mb-1">
            اختر منتجاً لعرض مقارنة الأسعار ({filteredProducts.length}):
          </div>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectProduct(p);
                onClose();
              }}
              className="p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <ProductImage product={p} size="xs" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs line-clamp-1">
                    {p.nameFr || p.nameAr}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {p.nameAr} • {p.volume}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-emerald-700">
                  من {formatMAD(Math.min(...Object.values(p.prices)))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
