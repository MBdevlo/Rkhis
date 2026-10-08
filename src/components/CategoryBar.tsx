import React from 'react';
import { PRODUCT_CATEGORIES, ProductCategory } from '../data/categories';
import { Product } from '../types';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  products: Product[];
  className?: string;
  onOpenAllCategories?: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  products,
  className = '',
  onOpenAllCategories,
}) => {
  // Compute counts per category
  const getCount = (catName: string) => {
    if (catName === 'all') return products.length;
    return products.filter((p) => p.category.includes(catName) || catName.includes(p.category)).length;
  };

  const mainPillars = [
    { id: 'all', label: 'الكل', emoji: '🛍️' },
    // Specific clothing sections requested by user:
    { id: 'ملابس خاصة بالرجال', label: 'ملابس خاصة بالرجال', emoji: '👔' },
    { id: 'ملابس خاصة بالنساء', label: 'ملابس خاصة بالنساء', emoji: '👗' },
    { id: 'ملابس خاصة بالأطفال', label: 'ملابس خاصة بالأطفال', emoji: '🧒' },
    // Food & Groceries:
    { id: 'الألبان والأجبان', label: 'ألبان وأجبان', emoji: '🥛' },
    { id: 'الزيوت والمواد الأساسية', label: 'زيوت ومواد أساسية', emoji: '🌻' },
    { id: 'مواد التنظيف والغسيل', label: 'مواد التنظيف', emoji: '🧼' },
    { id: 'المشروبات والماء', label: 'مشروبات ومياه', emoji: '💧' },
    { id: 'الشاي والقهوة والسكر', label: 'شاي وقهوة', emoji: '🍵' },
    { id: 'بسكويت وشوكولاتة', label: 'بسكويت وحلويات', emoji: '🍪' },
    { id: 'المعلبات والتوابل', label: 'معلبات وتوابل', emoji: '🥫' },
    { id: 'مفروشات ومنسوجات المنزل', label: 'مفروشات المنزل', emoji: '🛏️' },
    { id: 'العناية بالأطفال والنظافة', label: 'عناية وأطفال', emoji: '👶' },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {mainPillars.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-[#15803d] text-white border-[#15803d] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="whitespace-nowrap">{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
