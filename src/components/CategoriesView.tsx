import React, { useState } from 'react';
import { PRODUCT_CATEGORIES, ProductCategory } from '../data/categories';
import { Product, MoroccanCity } from '../types';
import { STORES } from '../data/stores';
import { findCheapest, formatMAD } from '../utils/pricing';
import { ProductImage } from './ProductImage';
import { Search, ChevronRight, ArrowRight, Shirt, Sparkles, Tag, Check } from 'lucide-react';

interface CategoriesViewProps {
  products: Product[];
  city: MoroccanCity;
  onSelectProduct: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
}

export type MainDepartment = 'all' | 'clothing_all' | 'men' | 'women' | 'kids' | 'food' | 'cleaning' | 'electromenager';

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  products,
  city,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(
    selectedCategory === 'all' ? '' : selectedCategory
  );
  const [selectedDept, setSelectedDept] = useState<MainDepartment>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Explicit mappings for clothing sub-departments
  const menCategoryName = 'ملابس خاصة بالرجال';
  const womenCategoryName = 'ملابس خاصة بالنساء';
  const kidsCategoryName = 'ملابس خاصة بالأطفال';
  const electromenagerCatName = 'الأجهزة المنزلية والمطبخ';

  const foodCats = [
    'الألبان والأجبان',
    'الزيوت والمواد الأساسية',
    'الشاي والقهوة والسكر',
    'المشروبات والماء',
    'المعلبات والتوابل',
    'بسكويت وشوكولاتة',
  ];
  const cleaningCats = ['مواد التنظيف والغسيل', 'العناية بالأطفال والنظافة', 'مفروشات ومنسوجات المنزل'];
  const electromenagerCats = [electromenagerCatName];

  // Total counts for clothing
  const menProductsCount = products.filter((p) => p.category === menCategoryName).length;
  const womenProductsCount = products.filter((p) => p.category === womenCategoryName).length;
  const kidsProductsCount = products.filter((p) => p.category === kidsCategoryName).length;
  const totalClothesCount = menProductsCount + womenProductsCount + kidsProductsCount;
  const electromenagerCount = products.filter((p) => p.category === electromenagerCatName).length;

  // Filter categories by chosen department
  const filterCatByDept = (cat: ProductCategory) => {
    if (selectedDept === 'all') return true;
    if (selectedDept === 'clothing_all') {
      return (
        cat.nameAr === menCategoryName ||
        cat.nameAr === womenCategoryName ||
        cat.nameAr === kidsCategoryName
      );
    }
    if (selectedDept === 'men') return cat.nameAr === menCategoryName;
    if (selectedDept === 'women') return cat.nameAr === womenCategoryName;
    if (selectedDept === 'kids') return cat.nameAr === kidsCategoryName;
    if (selectedDept === 'food') return foodCats.includes(cat.nameAr);
    if (selectedDept === 'cleaning') return cleaningCats.includes(cat.nameAr);
    if (selectedDept === 'electromenager') return cat.nameAr === electromenagerCatName;
    return true;
  };

  const getCategoryCount = (catName: string) => {
    return products.filter((p) => p.category === catName || p.category.includes(catName)).length;
  };

  const visibleCategories = PRODUCT_CATEGORIES.filter(filterCatByDept);

  // Products displayed when a category or a clothing department is active
  const displayedProducts = activeCategory
    ? products.filter(
        (p) =>
          (p.category === activeCategory || p.category.includes(activeCategory)) &&
          (searchQuery === '' ||
            p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : selectedDept === 'clothing_all'
    ? products.filter(
        (p) =>
          (p.category === menCategoryName ||
            p.category === womenCategoryName ||
            p.category === kidsCategoryName) &&
          (searchQuery === '' ||
            p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-4 pt-2 font-sans animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            أقسام وفئات السلع • Rayons
          </h2>
          <p className="text-xs text-slate-500">
            تصفح أسعار المتاجر مقسمة حسب الصنف في المغرب
          </p>
        </div>
        <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-100">
          {products.length} سلعة
        </span>
      </div>

      {/* SPECIAL PROMINENT SECTION: قسم الملابس (مقسم إلى 3 أقسام رئيسية) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white rounded-3xl p-4 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                قسم الملابس والأزياء • Rayon Vêtements
              </h3>
              <p className="text-[10px] text-slate-300">
                مقسم حسب الفئات: رجال • نساء • أطفال ({totalClothesCount} سلع متوفرة)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedDept('clothing_all');
              setActiveCategory('');
            }}
            className="text-[10px] font-bold bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
          >
            عرض الكل ({totalClothesCount})
          </button>
        </div>

        {/* 3 Dedicated Clothing Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* 1. Men */}
          <button
            onClick={() => {
              setSelectedDept('men');
              setActiveCategory(menCategoryName);
              onSelectCategory(menCategoryName);
            }}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
              activeCategory === menCategoryName
                ? 'bg-blue-600 border-blue-400 shadow-sm scale-[1.02]'
                : 'bg-white/10 hover:bg-white/15 border-white/10'
            }`}
          >
            <span className="text-2xl mb-1">👔</span>
            <span className="text-xs font-black text-white leading-tight">ملابس الرجال</span>
            <span className="text-[9px] text-blue-200 mt-0.5">Vêtements Homme</span>
            <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-0.2 rounded-full mt-1.5">
              {menProductsCount} سلع
            </span>
          </button>

          {/* 2. Women */}
          <button
            onClick={() => {
              setSelectedDept('women');
              setActiveCategory(womenCategoryName);
              onSelectCategory(womenCategoryName);
            }}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
              activeCategory === womenCategoryName
                ? 'bg-rose-600 border-rose-400 shadow-sm scale-[1.02]'
                : 'bg-white/10 hover:bg-white/15 border-white/10'
            }`}
          >
            <span className="text-2xl mb-1">👗</span>
            <span className="text-xs font-black text-white leading-tight">ملابس النساء</span>
            <span className="text-[9px] text-rose-200 mt-0.5">Vêtements Femme</span>
            <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-0.2 rounded-full mt-1.5">
              {womenProductsCount} سلع
            </span>
          </button>

          {/* 3. Kids */}
          <button
            onClick={() => {
              setSelectedDept('kids');
              setActiveCategory(kidsCategoryName);
              onSelectCategory(kidsCategoryName);
            }}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
              activeCategory === kidsCategoryName
                ? 'bg-amber-600 border-amber-400 shadow-sm scale-[1.02]'
                : 'bg-white/10 hover:bg-white/15 border-white/10'
            }`}
          >
            <span className="text-2xl mb-1">🧒</span>
            <span className="text-xs font-black text-white leading-tight">ملابس الأطفال</span>
            <span className="text-[9px] text-amber-200 mt-0.5">Enfants & Bébés</span>
            <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-0.2 rounded-full mt-1.5">
              {kidsProductsCount} سلع
            </span>
          </button>
        </div>
      </div>

      {/* Main Department Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-slate-100 rounded-2xl text-xs font-bold">
        <button
          onClick={() => {
            setSelectedDept('all');
            setActiveCategory('');
            onSelectCategory('all');
          }}
          className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer text-center ${
            selectedDept === 'all' && !activeCategory
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>الكل (Tous)</span>
        </button>

        {/* Dedicated Clothing Department Pills */}
        <button
          onClick={() => {
            setSelectedDept('men');
            setActiveCategory(menCategoryName);
            onSelectCategory(menCategoryName);
          }}
          className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer text-center flex items-center justify-center gap-1 ${
            activeCategory === menCategoryName
              ? 'bg-[#15803d] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 bg-white/60'
          }`}
        >
          <span>👔 ملابس خاصة بالرجال</span>
        </button>

        <button
          onClick={() => {
            setSelectedDept('women');
            setActiveCategory(womenCategoryName);
            onSelectCategory(womenCategoryName);
          }}
          className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer text-center flex items-center justify-center gap-1 ${
            activeCategory === womenCategoryName
              ? 'bg-[#15803d] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 bg-white/60'
          }`}
        >
          <span>👗 ملابس خاصة بالنساء</span>
        </button>

        <button
          onClick={() => {
            setSelectedDept('kids');
            setActiveCategory(kidsCategoryName);
            onSelectCategory(kidsCategoryName);
          }}
          className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer text-center flex items-center justify-center gap-1 ${
            activeCategory === kidsCategoryName
              ? 'bg-[#15803d] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 bg-white/60'
          }`}
        >
          <span>🧒 ملابس خاصة بالأطفال</span>
        </button>

        {/* Food */}
        <button
          onClick={() => {
            setSelectedDept('food');
            setActiveCategory('');
          }}
          className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer text-center flex items-center justify-center gap-1 ${
            selectedDept === 'food'
              ? 'bg-[#15803d] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🛒 مواد غذائية</span>
        </button>

        {/* Cleaning */}
        <button
          onClick={() => {
            setSelectedDept('cleaning');
            setActiveCategory('');
          }}
          className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer text-center flex items-center justify-center gap-1 ${
            selectedDept === 'cleaning'
              ? 'bg-[#15803d] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🧼 مواد تنظيف</span>
        </button>

        {/* Electromenager */}
        <button
          onClick={() => {
            setSelectedDept('electromenager');
            setActiveCategory(electromenagerCatName);
            onSelectCategory(electromenagerCatName);
          }}
          className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer text-center flex items-center justify-center gap-1 ${
            activeCategory === electromenagerCatName
              ? 'bg-[#15803d] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 bg-white/60'
          }`}
        >
          <span>🔌 الأجهزة المنزلية</span>
        </button>
      </div>

      {/* If a category is selected OR clothing_all selected: show breadcrumb & category products */}
      {activeCategory || selectedDept === 'clothing_all' ? (
        <div className="space-y-3.5">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
            <button
              onClick={() => {
                setActiveCategory('');
                setSelectedDept('all');
                onSelectCategory('all');
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
              <span>رجوع إلى جميع الأقسام</span>
            </button>
            <span className="font-extrabold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
              {activeCategory || 'جميع الملابس والأزياء'} ({displayedProducts.length})
            </span>
          </div>

          {/* Quick Sub-Tabs if inside clothing */}
          {(activeCategory === menCategoryName ||
            activeCategory === womenCategoryName ||
            activeCategory === kidsCategoryName ||
            selectedDept === 'clothing_all') && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => {
                  setSelectedDept('clothing_all');
                  setActiveCategory('');
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedDept === 'clothing_all' && !activeCategory
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                الكل في الملابس ({totalClothesCount})
              </button>
              <button
                onClick={() => {
                  setActiveCategory(menCategoryName);
                  onSelectCategory(menCategoryName);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  activeCategory === menCategoryName
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <span>👔 ملابس خاصة بالرجال</span>
                <span className="text-[10px] bg-white/20 px-1.5 rounded-full">{menProductsCount}</span>
              </button>
              <button
                onClick={() => {
                  setActiveCategory(womenCategoryName);
                  onSelectCategory(womenCategoryName);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  activeCategory === womenCategoryName
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                <span>👗 ملابس خاصة بالنساء</span>
                <span className="text-[10px] bg-white/20 px-1.5 rounded-full">{womenProductsCount}</span>
              </button>
              <button
                onClick={() => {
                  setActiveCategory(kidsCategoryName);
                  onSelectCategory(kidsCategoryName);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  activeCategory === kidsCategoryName
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                <span>🧒 ملابس خاصة بالأطفال</span>
                <span className="text-[10px] bg-white/20 px-1.5 rounded-full">{kidsProductsCount}</span>
              </button>
            </div>
          )}

          {/* Quick Search within this category */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`بحث داخل ${activeCategory || 'الملابس'} (قميص، فستان، بيجاما، تي شيرت...)...`}
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>

          {/* Category Products List */}
          <div className="space-y-2.5">
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
                <p className="text-xs text-slate-500">لا توجد سلع مطابقة في هذا الصنف حالياً</p>
              </div>
            ) : (
              displayedProducts.map((p) => {
                const cheapest = findCheapest(p, city.stores, city.nameAr);
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="bg-white rounded-2xl p-3 border border-slate-100 hover:border-emerald-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ProductImage product={p} size="sm" />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {p.nameFr || p.nameAr}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {p.nameAr} • {p.volume} • <span className="font-bold text-slate-600">{p.brand}</span>
                        </p>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          الأرخص: {STORES[cheapest.cheapestStore].nameFr} ({formatMAD(cheapest.minPrice)})
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 flex-shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Full Category Cards Grid */
        <div className="grid grid-cols-2 gap-2.5">
          {visibleCategories.map((cat) => {
            const count = getCategoryCount(cat.nameAr);
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.nameAr);
                  onSelectCategory(cat.nameAr);
                }}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-2xl transition-colors">
                      {cat.emoji}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {count} سلع
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {cat.nameAr}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {cat.nameFr}
                  </p>
                  {cat.description && (
                    <p className="text-[9.5px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-emerald-700">
                  <span>تصفح الأسعار</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
