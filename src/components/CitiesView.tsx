import React, { useState } from 'react';
import { MOROCCAN_CITIES } from '../data/cities';
import { STORES, STORE_KEYS } from '../data/stores';
import { MoroccanCity, StoreId } from '../types';
import { StoreBadge, StoreLogo } from './StoreBadge';
import { MapPin, Search, Building2, Check, ArrowUpRight } from 'lucide-react';

interface CitiesViewProps {
  currentCity: MoroccanCity;
  onSelectCity: (city: MoroccanCity) => void;
}

export const CitiesView: React.FC<CitiesViewProps> = ({
  currentCity,
  onSelectCity,
}) => {
  const [search, setSearch] = useState('');

  const filteredCities = MOROCCAN_CITIES.filter(
    (c) =>
      c.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      c.nameFr.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* 4 Official Stores Profile Cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            المتاجر الأربعة المعتمدة في "أرخص"
          </h2>
          <p className="text-xs text-slate-500">
            مقارنة حصرية ومستقلة لأكبر 4 سلاسل تجارية في المملكة المغربية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STORE_KEYS.map((s) => {
            const store = STORES[s];
            return (
              <div
                key={s}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <StoreLogo storeId={s} className="w-8 h-8 text-xs" />
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      ~{store.branchesCount} فرع بالمغرب
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-slate-900">{store.nameAr}</h3>
                  <p className="text-xs font-semibold text-slate-400 mb-2">{store.nameFr}</p>
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{store.tagline}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">تغطية المدن:</span>
                  <span className="font-bold text-slate-700">
                    {MOROCCAN_CITIES.filter((c) => c.stores.includes(s)).length} / 40 مدينة
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 40 Moroccan Cities Grid */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              قائمة المدن المغربية الـ 40
            </h3>
            <p className="text-xs text-slate-500">
              اختر مدينتك لتحديث التوفر والأسعار المحلية مباشرة
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مدينة أو جهة..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[550px] overflow-y-auto pr-1">
          {filteredCities.map((city) => {
            const isCurrent = city.id === currentCity.id;
            return (
              <div
                key={city.id}
                onClick={() => onSelectCity(city)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-500/30 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-slate-800">
                      {city.nameAr}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {city.nameFr}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {city.region}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {STORE_KEYS.map((s) => {
                      const has = city.stores.includes(s);
                      return (
                        <div
                          key={s}
                          className={`w-4 h-4 rounded text-[8px] flex items-center justify-center font-bold ${
                            has
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-100 text-slate-300 opacity-40'
                          }`}
                          title={`${STORES[s].nameAr}: ${has ? 'متوفر' : 'غير متوفر'}`}
                        >
                          {STORES[s].nameAr.charAt(0)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {isCurrent ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 hover:text-emerald-600 font-semibold">
                    اختر
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
