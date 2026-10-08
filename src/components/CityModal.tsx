import React, { useState, useMemo } from 'react';
import { MOROCCAN_CITIES } from '../data/cities';
import { MoroccanCity, StoreId } from '../types';
import { StoreLogo } from './StoreBadge';
import { MapPin, Search, X, Check, Building2 } from 'lucide-react';

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: MoroccanCity;
  onSelectCity: (city: MoroccanCity) => void;
}

export const CityModal: React.FC<CityModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return MOROCCAN_CITIES;
    return MOROCCAN_CITIES.filter(
      (c) =>
        c.nameAr.toLowerCase().includes(term) ||
        c.nameFr.toLowerCase().includes(term) ||
        c.region.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-emerald-50 via-teal-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">اختر مدينتك في المغرب</h3>
              <p className="text-xs text-slate-500">
                40 مدينة مغربية متاحة مع تغطية المتاجر الحية
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

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن مدينتك (Casablanca, Rabat, طنجة, مراكش...)"
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm shadow-sm transition-all"
              autoFocus
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-2.5 text-xs text-slate-500 px-1">
            <span>عدد المدن المطابقة: {filteredCities.length}</span>
            <span>المدينة الحالية: <strong className="text-emerald-700">{selectedCity.nameAr}</strong></span>
          </div>
        </div>

        {/* Cities Grid List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1 divide-y divide-slate-50">
          {filteredCities.map((city) => {
            const isSelected = city.id === selectedCity.id;
            return (
              <div
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`pt-2 first:pt-0 cursor-pointer group`}
              >
                <div
                  className={`p-3.5 rounded-2xl transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                      : 'bg-white hover:bg-slate-50/80 border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                      }`}
                    >
                      {city.nameAr.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 text-base">
                          {city.nameAr}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          ({city.nameFr})
                        </span>
                        {city.isPopular && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            رئيسية
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {city.region}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stores available badges */}
                    <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl">
                      {(['marjane', 'carrefour', 'aswak', 'bim'] as StoreId[]).map((s) => {
                        const hasStore = city.stores.includes(s);
                        return (
                          <div
                            key={s}
                            title={hasStore ? `متوفر في ${city.nameAr}` : 'غير متوفر'}
                            className={`opacity-${hasStore ? '100' : '25 grayscale'}`}
                          >
                            <StoreLogo storeId={s} className="w-5 h-5 text-[9px]" />
                          </div>
                        );
                      })}
                    </div>

                    <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 text-slate-600 sm:hidden">
                      {city.stores.length} متاجر
                    </span>

                    {isSelected && (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCities.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Building2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="font-bold">لم نجد هذه المدينة</p>
              <p className="text-xs">جرب كتابة اسم المدينة بالعربية أو الفرنسية</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500">
          تغيير المدينة يقوم بحساب المتاجر الأقرب والمتوفرة تلقائياً في حسابات التوفير
        </div>
      </div>
    </div>
  );
};
