import React from 'react';
import { Home, ArrowLeftRight, Heart, Bell, User, LayoutGrid, Layers } from 'lucide-react';

export type TabId = 'home' | 'categories' | 'compare' | 'favorites' | 'alerts' | 'profile';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  favoritesCount,
}) => {
  const tabs = [
    {
      id: 'home' as TabId,
      labelFr: 'Accueil',
      labelAr: 'الرئيسية',
      icon: Home,
    },
    {
      id: 'categories' as TabId,
      labelFr: 'Catégories',
      labelAr: 'الفئات',
      icon: LayoutGrid,
    },
    {
      id: 'compare' as TabId,
      labelFr: 'Comparer',
      labelAr: 'مقارنة',
      icon: ArrowLeftRight,
      isPill: true,
    },
    {
      id: 'favorites' as TabId,
      labelFr: 'Favoris',
      labelAr: 'المفضلة',
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      id: 'profile' as TabId,
      labelFr: 'Profil',
      labelAr: 'الحساب',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/70 px-2.5 py-1.5 shadow-lg max-w-md mx-auto">
      <div className="flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.isPill) {
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`relative px-3 py-1.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#dcfce7] text-[#15803d]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#15803d]" />
                )}
                <span className="font-extrabold text-[11px] leading-tight">
                  {tab.labelFr}
                </span>
                <span className="text-[9.5px] font-bold leading-tight mt-0.5">
                  {tab.labelAr}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#15803d]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 leading-none ${isActive ? 'font-black' : 'font-semibold'}`}>
                {tab.labelFr}
              </span>
              <span className="text-[8.5px] text-slate-400 font-medium leading-none mt-0.5">
                {tab.labelAr}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


