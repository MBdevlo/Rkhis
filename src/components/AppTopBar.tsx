import React from 'react';
import { Search, SlidersHorizontal, ChevronLeft, MapPin } from 'lucide-react';
import { MoroccanCity } from '../types';

interface AppTopBarProps {
  onGoBack?: () => void;
  canGoBack?: boolean;
  onOpenSearch: () => void;
  onOpenFilter: () => void;
  onOpenCityModal: () => void;
  currentCity: MoroccanCity;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  onGoBack,
  canGoBack = false,
  onOpenSearch,
  onOpenFilter,
  onOpenCityModal,
  currentCity,
}) => {
  return (
    <div className="w-full max-w-md mx-auto sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-2 pb-2 px-4 border-b border-slate-100 shadow-xs">
      {/* Mockup iPhone Dynamic Island & Status Bar info */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-900 pb-2 px-1 select-none">
        <span>9:41</span>
        {/* Dynamic Island pill */}
        <div className="w-20 h-4 bg-black rounded-full mx-auto" />
        <div className="flex items-center gap-1.5 text-[10px]">
          <span>5G</span>
          <div className="w-4 h-2.5 border border-slate-900 rounded-xs p-0.5 flex items-center">
            <div className="w-full h-full bg-slate-900 rounded-xs" />
          </div>
        </div>
      </div>

      {/* Main Top Action Bar matching the screenshot */}
      <div className="flex items-center justify-between">
        {/* Left: Back button or City indicator */}
        <div className="flex items-center gap-1">
          {canGoBack ? (
            <button
              onClick={onGoBack}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Retour"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          ) : (
            <button
              onClick={onOpenCityModal}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{currentCity.nameAr}</span>
            </button>
          )}
        </div>

        {/* Center: RKHISS Logo with Shopping Bag + Checkmark */}
        <div className="flex items-center gap-2">
          {/* Green shopping bag icon with checkmark inside */}
          <div className="w-7 h-7 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
              <rect
                x="3.5"
                y="6.5"
                width="17"
                height="14"
                rx="3.5"
                stroke="#047857"
                strokeWidth="2.2"
              />
              <path
                d="M8 6.5V5.5C8 3.567 9.567 2 11.5 2H12.5C14.433 2 16 3.567 16 5.5V6.5"
                stroke="#047857"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M8.5 13.5L11 16L16 10.5"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
            RKHISS
          </h1>
        </div>

        {/* Right: Search & Filter icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Rechercher"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            onClick={onOpenFilter}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Filtres"
          >
            <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
