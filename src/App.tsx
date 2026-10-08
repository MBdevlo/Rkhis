/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MoroccanCity, Product, StoreId, PriceReport, AdBanner } from './types';
import { MOROCCAN_CITIES } from './data/cities';
import { INITIAL_PRODUCTS } from './data/products';
import { INITIAL_ADS } from './data/ads';
import { STORES, STORE_KEYS } from './data/stores';
import { findCheapest, formatMAD } from './utils/pricing';
import { AppTopBar } from './components/AppTopBar';
import { DetailedComparisonView } from './components/DetailedComparisonView';
import { BottomNav, TabId } from './components/BottomNav';
import { ProductCard } from './components/ProductCard';
import { CityModal } from './components/CityModal';
import { PriceHistoryModal } from './components/PriceHistoryModal';
import { ReportPriceModal } from './components/ReportPriceModal';
import { AddPriceModal } from './components/AddPriceModal';
import { StoreDirectionsModal } from './components/StoreDirectionsModal';
import { SearchFilterModal } from './components/SearchFilterModal';
import { SmartBasketView } from './components/SmartBasketView';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdSpace } from './components/AdSpace';
import { CategoryBar } from './components/CategoryBar';
import { CategoriesModal } from './components/CategoriesModal';
import { CategoriesView } from './components/CategoriesView';
import { ProductImage } from './components/ProductImage';
import {
  Bell,
  CheckCircle,
  TrendingDown,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  Store,
  Layers,
  Heart,
  Shield,
  Lock,
  Sliders,
  Megaphone
} from 'lucide-react';

export default function App() {
  // 1. City State (defaults to Rabat/Casablanca)
  const [selectedCity, setSelectedCity] = useState<MoroccanCity>(() => {
    try {
      const saved = localStorage.getItem('rkhiss_city');
      if (saved) {
        const found = MOROCCAN_CITIES.find((c) => c.id === saved);
        if (found) return found;
      }
    } catch {}
    return MOROCCAN_CITIES.find((c) => c.id === 'rabat') || MOROCCAN_CITIES[0];
  });

  // 2. Products state (Initial 65+ products + Custom)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('rkhiss_custom_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customOnly = parsed.filter((p: Product) => p.isCustom);
          return [...INITIAL_PRODUCTS, ...customOnly];
        }
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });

  // 3. Featured / Current Product for comparison (Default: Lait Entier 1L matching mockup)
  const [currentProduct, setCurrentProduct] = useState<Product>(products[0]);

  // 4. Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rkhiss_favorites');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['p-1', 'p-2', 'p-4', 'p-6'];
  });

  // 5. Navigation Tab state: Default to 'compare' to match mockup
  const [activeTab, setActiveTab] = useState<TabId>('compare');

  // 6. Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  // 7. Community Reports State
  const [reports, setReports] = useState<PriceReport[]>(() => {
    try {
      const saved = localStorage.getItem('rkhiss_reports');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'rep-sample-1',
        productId: 'p-1',
        productName: 'Lait Entier 1L',
        storeId: 'bim',
        city: 'الرباط',
        reportedPrice: 9.70,
        reason: 'تخفيض في كتالوج بيم الأسبوعي',
        timestamp: 'اليوم، 14:15',
        status: 'pending',
      },
      {
        id: 'rep-sample-2',
        productId: 'p-2',
        productName: 'Huile Lesieur 5L',
        storeId: 'carrefour',
        city: 'الدار البيضاء',
        reportedPrice: 80.50,
        reason: 'تغير السعر في الرف',
        timestamp: 'اليوم، 12:30',
        status: 'pending',
      },
    ];
  });

  // 8. Ads Management State (Space for Ads)
  const [ads, setAds] = useState<AdBanner[]>(() => {
    try {
      const saved = localStorage.getItem('rkhiss_ads');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ADS;
  });

  const [adsEnabled, setAdsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rkhiss_ads_enabled');
      if (saved !== null) return saved === 'true';
    } catch {}
    return true;
  });

  // 9. Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rkhiss_admin_session') === 'true';
    } catch {}
    return false;
  });
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // 10. Modals
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  const [reportProduct, setReportProduct] = useState<Product | null>(null);
  const [isAddPriceOpen, setIsAddPriceOpen] = useState(false);
  const [directionsStore, setDirectionsStore] = useState<StoreId | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem('rkhiss_city', selectedCity.id);
    } catch {}
  }, [selectedCity]);

  useEffect(() => {
    try {
      localStorage.setItem('rkhiss_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('rkhiss_reports', JSON.stringify(reports));
    } catch {}
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('rkhiss_ads', JSON.stringify(ads));
    } catch {}
  }, [ads]);

  useEffect(() => {
    try {
      localStorage.setItem('rkhiss_ads_enabled', String(adsEnabled));
    } catch {}
  }, [adsEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('rkhiss_admin_session', String(isAdminLoggedIn));
    } catch {}
  }, [isAdminLoggedIn]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Supprimé des favoris' : 'Ajouté aux favoris ❤️');
      return next;
    });
  };

  const handleProductAdded = (newProd: Product) => {
    setProducts((prev) => {
      const updated = [newProd, ...prev];
      try {
        localStorage.setItem('rkhiss_custom_products', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setCurrentProduct(newProd);
    setActiveTab('compare');
    showToast(`Produit "${newProd.nameFr}" ajouté avec succès!`);
  };

  const handleReportSubmitted = (report: PriceReport) => {
    setReports((prev) => [report, ...prev]);
    showToast('Merci! Signalement enregistré pour vérification.');
  };

  // Admin Actions
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      try {
        localStorage.setItem('rkhiss_custom_products', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (currentProduct.id === updated.id) {
      setCurrentProduct(updated);
    }
    showToast(`Prix de "${updated.nameFr}" mis à jour dans les 4 magasins!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      try {
        localStorage.setItem('rkhiss_custom_products', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('Produit supprimé du catalogue.');
  };

  const handleResolveReport = (reportId: string, action: 'approve' | 'reject') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r))
    );
    if (action === 'approve') {
      const report = reports.find((r) => r.id === reportId);
      if (report) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === report.productId) {
              return {
                ...p,
                prices: {
                  ...p.prices,
                  [report.storeId]: report.reportedPrice,
                },
                updatedAt: 'مُحدث بناءً على بلاغ معتمد',
              };
            }
            return p;
          })
        );
      }
      showToast('تم اعتماد البلاغ وتحديث السعر تلقائياً!');
    } else {
      showToast('تم رفض البلاغ.');
    }
  };

  const handleAdClick = (adId: string) => {
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, clicksCount: a.clicksCount + 1 } : a))
    );
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  // Favorite product items
  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);

  // Comparison active ad
  const comparisonAd = ads.find((a) => a.position === 'comparison_inline' && a.isActive) || ads[0];
  // Catalog active ad
  const catalogAd = ads.find((a) => a.position === 'catalog_top' && a.isActive);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-24 selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar with RKHISS logo, back arrow, search and filter */}
      <AppTopBar
        canGoBack={activeTab !== 'compare'}
        onGoBack={() => setActiveTab('compare')}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenFilter={() => setIsSearchModalOpen(true)}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        currentCity={selectedCity}
      />

      {/* Admin Floating Quick Badge */}
      {isAdminLoggedIn && (
        <div className="w-full max-w-md mx-auto px-4 pt-1">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              جلسة المسؤول نشطة (Admin Session)
            </span>
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="px-2.5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] cursor-pointer"
            >
              فتح لوحة التحكم
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-md mx-auto px-4 flex-1">
        {/* TAB 1: EXACT SCREENSHOT VIEW (COMPARE / مقارنة) */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            {/* Quick Product Switcher Pill Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap pl-1">
                منتجات أخرى:
              </span>
              {products.slice(0, 10).map((p) => {
                const isSelected = p.id === currentProduct.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCurrentProduct(p)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition-all text-xs cursor-pointer flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-[#15803d] text-white border-[#15803d] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{p.emoji}</span>
                    <span>{p.nameFr || p.nameAr}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 whitespace-nowrap cursor-pointer"
              >
                + 40 منتج آخر
              </button>
            </div>

            {/* The Detailed Comparison View matching the screenshot with integrated Space for Ads */}
            <DetailedComparisonView
              product={currentProduct}
              city={selectedCity}
              onOpenStoreModal={(storeId) => setDirectionsStore(storeId)}
              onOpenCityModal={() => setIsCityModalOpen(true)}
              ad={comparisonAd}
              onAdClick={handleAdClick}
              adsEnabled={adsEnabled}
            />
          </div>
        )}

        {/* TAB 2: ACCUEIL / الرئيسية (Product Catalog + Category Bar + Ad Space) */}
        {activeTab === 'home' && (
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  جميع المنتجات ({products.length})
                </h2>
                <p className="text-xs text-slate-500">
                  تصفح وقارن الأسعار حسب الفئة في {selectedCity.nameAr}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsCategoriesModalOpen(true)}
                  className="text-xs text-slate-700 font-bold bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                >
                  <Layers className="w-3 h-3 text-emerald-600" />
                  <span>الفئات</span>
                </button>
                <button
                  onClick={() => setIsCityModalOpen(true)}
                  className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full cursor-pointer"
                >
                  {selectedCity.nameAr}
                </button>
              </div>
            </div>

            {/* PRODUCT CATEGORIES BAR */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              products={products}
              onOpenAllCategories={() => setIsCategoriesModalOpen(true)}
            />

            {/* SPACE FOR ADS (Catalog Top Ad Space) */}
            {adsEnabled && catalogAd && (
              <AdSpace ad={catalogAd} onAdClick={handleAdClick} position="catalog_top" />
            )}

            {/* Products List (Filtered by selected category if not 'all') */}
            <div className="space-y-3">
              {products
                .filter((p) => {
                  if (selectedCategory === 'all') return true;
                  return p.category.includes(selectedCategory) || selectedCategory.includes(p.category);
                })
                .map((p) => {
                  const cheapest = findCheapest(p, selectedCity.stores, selectedCity.nameAr);
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setCurrentProduct(p);
                        setActiveTab('compare');
                      }}
                      className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ProductImage product={p} size="sm" />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">
                            {p.nameFr || p.nameAr}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                              {p.category}
                            </span>
                            <span>• {p.brand} ({p.volume})</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                            الأرخص: {STORES[cheapest.cheapestStore].nameFr} ({formatMAD(cheapest.minPrice)})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(p.id);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.includes(p.id)
                                ? 'fill-rose-500 stroke-rose-500 text-rose-500'
                                : ''
                            }`}
                          />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: CATÉGORIES / الفئات */}
        {activeTab === 'categories' && (
          <CategoriesView
            products={products}
            city={selectedCity}
            onSelectProduct={(p) => {
              setCurrentProduct(p);
              setActiveTab('compare');
            }}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* TAB 4: FAVORIS / المفضلة */}
        {activeTab === 'favorites' && (
          <div className="pt-2">
            <SmartBasketView
              favoriteProducts={favoriteProducts}
              city={selectedCity}
              onRemoveFavorite={toggleFavorite}
              onOpenExplore={() => setActiveTab('home')}
            />
          </div>
        )}

        {/* TAB 4: ALERTES / التنبيهات */}
        {activeTab === 'alerts' && (
          <div className="space-y-4 pt-2">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                التنبيهات والتخفيضات • Alertes
              </h2>
              <p className="text-xs text-slate-500">
                أحدث انخفاضات الأسعار في متاجر {selectedCity.nameAr}
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  store: 'carrefour',
                  text: 'انخفاض سعر Lait Entier 1L إلى 9,20 MAD في كارفور',
                  time: 'منذ 15 دقيقة',
                  badge: 'تخفيض -0.70 MAD',
                },
                {
                  store: 'marjane',
                  text: 'عرض ترويجي على زيت لوسيور 5L بسعر 79,50 MAD في مرجان',
                  time: 'منذ ساعتين',
                  badge: 'برومو كتالوج',
                },
                {
                  store: 'bim',
                  text: 'وصول دفعة جديدة من بسكويت بيمو غولدن بسعر 10,90 MAD في بيم',
                  time: 'اليوم',
                  badge: 'أرخص عرض',
                },
              ].map((a, i) => (
                <div key={i} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {a.badge}
                      </span>
                      <span className="text-[10px] text-slate-400">{a.time}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {a.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROFIL / الحساب (with Admin Session & Control Panel access) */}
        {activeTab === 'profile' && (
          <div className="space-y-4 pt-2">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-black mx-auto mb-2 shadow-md shadow-emerald-600/20">
                R
              </div>
              <h3 className="font-black text-slate-900 text-base">مستخدم RKHISS</h3>
              <p className="text-xs text-slate-400">تطبيق مقارنة الأسعار في المغرب</p>
            </div>

            {/* ADMIN ACCESS CARD */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Shield className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-white">
                      جلسة المسؤول • Admin Session
                    </h4>
                    <p className="text-[10px] text-slate-300">
                      {isAdminLoggedIn ? 'تم تسجيل الدخول كـ Super Admin' : 'تسجيل الدخول للتحكم في الأسعار والإعلانات'}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isAdminLoggedIn ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                  {isAdminLoggedIn ? 'نشط ✓' : 'مغلق'}
                </span>
              </div>

              {isAdminLoggedIn ? (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsAdminPanelOpen(true)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>فتح لوحة التحكم (Control Panel)</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      showToast('تم تسجيل الخروج من جلسة المسؤول.');
                    }}
                    className="px-3 py-2.5 bg-white/10 hover:bg-rose-500/20 text-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>تسجيل الدخول كمسؤول (Admin Login)</span>
                </button>
              )}
            </div>

            {/* User Preferences & Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 text-xs font-bold text-slate-700">
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>تغيير المدينة ({selectedCity.nameAr})</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setIsAddPriceOpen(true)}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>أضف ثمناً أو سلعة جديدة (مساهمة)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="p-3.5 flex items-center justify-between text-slate-500 font-medium">
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4 text-emerald-600" />
                  <span>المساحات الإعلانية (Ads Spaces):</span>
                </div>
                <span className={`text-[11px] font-bold ${adsEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {adsEnabled ? 'مفعّلة' : 'معطلة'}
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between text-slate-500 font-medium">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>حالة التطبيق: يعمل بدون إنترنت (Offline)</span>
                </div>
                <span className="text-emerald-600 font-bold">نشط</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Admin Control Panel Modal */}
      {isAdminPanelOpen && (
        <AdminPanel
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onAddProduct={handleProductAdded}
          onDeleteProduct={handleDeleteProduct}
          reports={reports}
          onResolveReport={handleResolveReport}
          ads={ads}
          onUpdateAds={(newAds) => {
            setAds(newAds);
            showToast('تم حفظ تحديثات الإعلانات بنجاح!');
          }}
          adsEnabled={adsEnabled}
          onToggleAdsEnabled={(val) => {
            setAdsEnabled(val);
            showToast(val ? 'تم تفعيل الإعلانات في التطبيق' : 'تم تعطيل الإعلانات');
          }}
          onClose={() => setIsAdminPanelOpen(false)}
          onLogout={() => {
            setIsAdminLoggedIn(false);
            setIsAdminPanelOpen(false);
            showToast('تم تسجيل الخروج من جلسة المسؤول.');
          }}
        />
      )}

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminPanelOpen(true);
          showToast('مرحباً بك في لوحة تحكم المسؤول!');
        }}
      />

      {/* Other App Modals */}
      <CityModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          showToast(`Ville modifiée: ${city.nameFr} (${city.nameAr})`);
        }}
      />

      <SearchFilterModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStore={selectedStore}
        onSelectStore={setSelectedStore}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        products={products}
        onSelectProduct={(p) => {
          setCurrentProduct(p);
          setActiveTab('compare');
        }}
      />

      <StoreDirectionsModal
        storeId={directionsStore}
        product={currentProduct}
        city={selectedCity}
        onClose={() => setDirectionsStore(null)}
        onOpenHistory={(p) => setHistoryProduct(p)}
        onOpenReport={(p) => setReportProduct(p)}
      />

      <PriceHistoryModal
        product={historyProduct}
        onClose={() => setHistoryProduct(null)}
        cityName={selectedCity.nameAr}
      />

      <ReportPriceModal
        product={reportProduct}
        onClose={() => setReportProduct(null)}
        cityName={selectedCity.nameAr}
        onReportSubmitted={handleReportSubmitted}
      />

      <AddPriceModal
        isOpen={isAddPriceOpen}
        onClose={() => setIsAddPriceOpen(false)}
        cityName={selectedCity.nameAr}
        onProductAdded={handleProductAdded}
      />

      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('home');
          showToast(`تم اختيار فئة: ${cat}`);
        }}
        products={products}
      />

      {/* Bottom Navigation matching the mockup */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoritesCount={favorites.length}
      />
    </div>
  );
}

