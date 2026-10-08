import React from 'react';
import { MoroccanCity, StoreId } from '../types';
import { STORES, STORE_KEYS } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { MapPin, Search, SlidersHorizontal, Sparkles, X, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  currentCity: MoroccanCity;
  onOpenCityModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStore: StoreId | 'all';
  onSelectStore: (store: StoreId | 'all') => void;
  onlyCheapestFilter: boolean;
  onToggleOnlyCheapest: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  sortBy: 'cheapest' | 'savings' | 'name';
  onSortChange: (sort: 'cheapest' | 'savings' | 'name') => void;
  totalProductsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onOpenCityModal,
  searchQuery,
  onSearchChange,
  selectedStore,
  onSelectStore,
  onlyCheapestFilter,
  onToggleOnlyCheapest,
  selectedCategory,
  onSelectCategory,
  categories,
  sortBy,
  onSortChange,
  totalProductsCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      {/* Top Banner with City Selector */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-base shadow-inner">
              ر
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-wide text-white">Rkhiss - أرخص</span>
                <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded">
                  المغرب 🇲🇦
                </span>
              </div>
              <p className="text-[10px] text-emerald-200 leading-none">
                مقارنة أسعار: مرجان • كارفور • أسواق السلام • بيم
              </p>
            </div>
          </div>

          {/* City Selector Button & APK Download */}
          <div className="flex items-center gap-2">
            <a
              href="/download/rkhiss-debug.apk"
              download="rkhiss-debug.apk"
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-xs text-[11px]"
              title="تحميل نسخة التطبيق بصيغة APK (أكبر من 1 ميغابايت)"
            >
              <span>📥 تحميل APK</span>
            </a>
            <button
              onClick={onOpenCityModal}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-all cursor-pointer group shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
              <span className="text-slate-200 text-[11px]">المدينة:</span>
              <span className="font-extrabold text-xs text-white underline decoration-amber-400 decoration-2 underline-offset-2">
                {currentCity.nameAr} ({currentCity.nameFr})
              </span>
              <span className="text-[10px] bg-emerald-500/50 px-1.5 py-0.5 rounded-full">
                {currentCity.stores.length} متاجر
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation & Search Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        {/* Search input and Quick Store Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن أي منتج بالعربية أو الفرنسية (حليب جودة، لوسيور 5L، شاي سلطان، حفاظات، بيمو...)"
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-xs sm:text-sm font-semibold transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Quick Cheapest filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Cheapest only toggle */}
            <button
              onClick={onToggleOnlyCheapest}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                onlyCheapestFilter
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>أرخص العروض فقط</span>
            </button>

            {/* Sort selector */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-0.5 text-xs">
              <span className="text-[11px] text-slate-400 px-2 font-medium">ترتيب:</span>
              <button
                onClick={() => onSortChange('cheapest')}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  sortBy === 'cheapest' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                الأرخص ثمن
              </button>
              <button
                onClick={() => onSortChange('savings')}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  sortBy === 'savings' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                أعلى توفير
              </button>
              <button
                onClick={() => onSortChange('name')}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  sortBy === 'name' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                الاسم
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stores Quick Filter Bar */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
            تصفية المتجر:
          </span>
          <button
            onClick={() => onSelectStore('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedStore === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            جميع المتاجر (4)
          </button>

          {STORE_KEYS.map((s) => {
            const store = STORES[s];
            const isSelected = selectedStore === s;
            const isAvail = currentCity.stores.includes(s);

            return (
              <button
                key={s}
                onClick={() => onSelectStore(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? `${store.bgColor} ${store.borderColor} ${store.textColor} ring-2 ring-emerald-500/30 shadow-xs`
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                } ${!isAvail ? 'opacity-60' : ''}`}
                title={!isAvail ? `غير متوفر في ${currentCity.nameAr}` : undefined}
              >
                <StoreLogo storeId={s} className="w-4 h-4 text-[8px]" />
                <span>{store.nameAr}</span>
                {!isAvail && (
                  <span className="text-[9px] text-rose-500 font-normal">
                    (غير متوفر بالمدينة)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الجميع ({totalProductsCount})
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
