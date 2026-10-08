import React from 'react';
import { StoreId } from '../types';

export const StoreLogo: React.FC<{ storeId: StoreId; className?: string }> = ({ storeId, className = 'w-10 h-10' }) => {
  switch (storeId) {
    case 'carrefour':
      return (
        <div className={`rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center p-1 shadow-xs flex-shrink-0 ${className}`}>
          {/* Carrefour Iconic Cross Emblem */}
          <svg viewBox="0 0 40 40" className="w-6 h-6">
            <path d="M12 20 L20 12 L20 28 Z" fill="#EF4444" />
            <path d="M28 20 L20 12 L20 28 Z" fill="#00387B" />
            <circle cx="20" cy="20" r="15" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="25 65" />
            <circle cx="20" cy="20" r="15" fill="none" stroke="#00387B" strokeWidth="2.5" strokeDasharray="25 65" strokeDashoffset="45" />
          </svg>
          <span className="text-[7px] font-black text-rose-600 tracking-tighter leading-none mt-0.5">Carrefour</span>
        </div>
      );

    case 'marjane':
      return (
        <div className={`rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center p-1 shadow-xs flex-shrink-0 ${className}`}>
          <div className="flex items-center justify-center">
            {/* Iconic stylized Marjane blue M with yellow star */}
            <div className="w-6 h-5 relative flex items-center justify-center">
              <span className="text-[#004B93] font-black text-base leading-none tracking-tighter">M</span>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
          </div>
          <span className="text-[7px] font-black text-[#004B93] tracking-tighter leading-none mt-0.5">Marjane</span>
        </div>
      );

    case 'aswak':
      return (
        <div className={`rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center p-1 shadow-xs flex-shrink-0 ${className}`}>
          {/* Aswak Assalam green arch */}
          <div className="w-6 h-5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#047857]" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 19 L12 5 L20 19 M7 15 L17 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[6.5px] font-black text-[#047857] tracking-tighter leading-none mt-0.5">Aswak Assalam</span>
        </div>
      );

    case 'bim':
      return (
        <div className={`rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center p-1 shadow-xs flex-shrink-0 ${className}`}>
          {/* BIM iconic red oval pill */}
          <div className="bg-[#DC2626] rounded-md px-1.5 py-0.5 flex items-center justify-center">
            <span className="text-white font-black text-[9px] tracking-wider leading-none">BİM</span>
          </div>
          <span className="text-[7px] font-bold text-amber-500 tracking-tighter leading-none mt-0.5">BIM</span>
        </div>
      );
  }
};

export const StoreBadge: React.FC<{ storeId: StoreId; size?: 'sm' | 'md' | 'lg'; showName?: boolean; className?: string }> = ({
  storeId,
  showName = true,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <StoreLogo storeId={storeId} className="w-5 h-5 text-[8px]" />
      {showName && <span className="font-bold text-xs">{storeId.toUpperCase()}</span>}
    </div>
  );
};

