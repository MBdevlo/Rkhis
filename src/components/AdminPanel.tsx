import React, { useState } from 'react';
import { Product, StoreId, PriceReport, AdBanner } from '../types';
import { STORES, STORE_KEYS } from '../data/stores';
import { StoreLogo } from './StoreBadge';
import { ProductImage } from './ProductImage';
import { formatMAD } from '../utils/pricing';
import {
  ShieldAlert,
  Sliders,
  DollarSign,
  Megaphone,
  Flag,
  Database,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  Search,
  ExternalLink,
  Eye,
  MousePointerClick,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  Edit2
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  reports: PriceReport[];
  onResolveReport: (reportId: string, action: 'approve' | 'reject') => void;
  ads: AdBanner[];
  onUpdateAds: (ads: AdBanner[]) => void;
  adsEnabled: boolean;
  onToggleAdsEnabled: (enabled: boolean) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  reports,
  onResolveReport,
  ads,
  onUpdateAds,
  adsEnabled,
  onToggleAdsEnabled,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'ads' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempPrices, setTempPrices] = useState<Record<StoreId, number>>({
    carrefour: 0,
    marjane: 0,
    aswak: 0,
    bim: 0,
  });

  // New Ad form state
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdSubtitle, setNewAdSubtitle] = useState('');
  const [newAdSponsor, setNewAdSponsor] = useState('BIM Maroc');
  const [newAdStore, setNewAdStore] = useState<StoreId>('bim');
  const [newAdUrl, setNewAdUrl] = useState('https://www.bim.ma');
  const [newAdPosition, setNewAdPosition] = useState<'comparison_inline' | 'catalog_top' | 'feed_interstitial'>('comparison_inline');

  // Stats
  const totalImpressions = ads.reduce((acc, a) => acc + a.impressionsCount, 0);
  const totalClicks = ads.reduce((acc, a) => acc + a.clicksCount, 0);
  const averageCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0';

  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setTempPrices({ ...product.prices });
  };

  const handleSavePrices = (product: Product) => {
    const updated: Product = {
      ...product,
      prices: { ...tempPrices },
      updatedAt: 'مُحدث الآن من الإدارة',
    };
    onUpdateProduct(updated);
    setEditingProductId(null);
  };

  const handleToggleAdStatus = (adId: string) => {
    const updated = ads.map((a) => (a.id === adId ? { ...a, isActive: !a.isActive } : a));
    onUpdateAds(updated);
  };

  const handleDeleteAd = (adId: string) => {
    const updated = ads.filter((a) => a.id !== adId);
    onUpdateAds(updated);
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle.trim()) return;

    const newAd: AdBanner = {
      id: `ad-${Date.now()}`,
      titleAr: newAdTitle,
      titleFr: newAdTitle,
      subtitleAr: newAdSubtitle || 'عرض حصري ومميز لزوار تطبيق أرخص',
      subtitleFr: newAdSubtitle || 'Offre exclusive',
      sponsorName: newAdSponsor,
      sponsorStore: newAdStore,
      ctaTextAr: 'استفد من العرض',
      ctaTextFr: 'Profiter',
      badgeAr: 'إعلان ممول • Sponsorisé',
      badgeFr: 'Sponsorisé',
      bgColor:
        newAdStore === 'carrefour'
          ? 'from-blue-700 via-indigo-800 to-blue-900'
          : newAdStore === 'marjane'
          ? 'from-[#004B93] via-[#00387B] to-slate-900'
          : newAdStore === 'bim'
          ? 'from-red-600 via-rose-700 to-red-800'
          : 'from-emerald-700 via-teal-800 to-slate-900',
      textColor: 'text-white',
      linkUrl: newAdUrl,
      isActive: true,
      clicksCount: 0,
      impressionsCount: 1,
      position: newAdPosition,
    };

    onUpdateAds([newAd, ...ads]);
    setIsAddingAd(false);
    setNewAdTitle('');
    setNewAdSubtitle('');
  };

  const filteredProducts = products.filter(
    (p) =>
      p.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-md overflow-hidden animate-fade-in font-sans">
      <div className="w-full max-w-4xl mx-auto my-auto h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-white">لوحة تحكم المسؤول (Control Panel)</h2>
                <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                إدارة أسعار المتاجر الـ 4، الإعلانات، وبلاغات المجتمع
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors cursor-pointer"
            >
              العودة للتطبيق
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'نظرة عامة وإحصائيات', icon: Sliders },
            { id: 'products', label: `المنتجات والأسعار (${products.length})`, icon: DollarSign },
            { id: 'ads', label: `إدارة الإعلانات (${ads.length})`, icon: Megaphone },
            { id: 'reports', label: `بلاغات الأسعار (${reports.length})`, icon: Flag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-bold block mb-1">إجمالي المنتجات</span>
                  <span className="text-2xl font-black text-slate-900">{products.length}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">✓ 50 منتج مغربي</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-bold block mb-1">المدن المغطاة</span>
                  <span className="text-2xl font-black text-slate-900">40 مدينة</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">تغطية وطنية شاملة</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-bold block mb-1">نقرات الإعلانات</span>
                  <span className="text-2xl font-black text-emerald-700">{totalClicks}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">CTR: {averageCTR}%</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-bold block mb-1">بلاغات قيد الانتظار</span>
                  <span className="text-2xl font-black text-rose-600">
                    {reports.filter((r) => r.status === 'pending').length}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">مساهمات المجتمع</span>
                </div>
              </div>

              {/* Stores Status Matrix */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span>المتاجر الأربعة النشطة في نظام المقارنة:</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STORE_KEYS.map((s) => (
                    <div key={s} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <StoreLogo storeId={s} className="w-8 h-8" />
                      <div>
                        <span className="font-extrabold text-xs text-slate-800 block">
                          {STORES[s].nameFr}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          ● متصل ونشط
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Ads Control Switch */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-emerald-950">
                    حالة الإعلانات في التطبيق (Spaces for Ads)
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    التحكم في ظهور أو إخفاء البنرات الإعلانية والرعايات في جميع شاشات التطبيق
                  </p>
                </div>
                <button
                  onClick={() => onToggleAdsEnabled(!adsEnabled)}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    adsEnabled
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
                  }`}
                >
                  {adsEnabled ? 'الإعلانات مفعّلة (مُشغلة) ✓' : 'الإعلانات مُعطلة ✕'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & PRICES MANAGER */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن منتج بالاسم أو الفئة..."
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
                <div className="text-xs text-slate-500 font-bold whitespace-nowrap">
                  إجمالي المعروض: {filteredProducts.length}
                </div>
              </div>

              {/* Products Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isEditing = editingProductId === p.id;
                  return (
                    <div key={p.id} className="p-3.5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <ProductImage product={p} size="xs" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-slate-900 text-sm">{p.nameFr}</h4>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                {p.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {p.nameAr} • {p.brand} ({p.volume})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <button
                              onClick={() => handleSavePrices(p)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>حفظ</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>تعديل الأسعار</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Store Price Inputs Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
                        {STORE_KEYS.map((s) => {
                          const isStoreCheapest =
                            p.prices[s] === Math.min(...Object.values(p.prices));
                          return (
                            <div
                              key={s}
                              className={`p-2 rounded-xl border flex items-center justify-between ${
                                isStoreCheapest
                                  ? 'bg-emerald-50/80 border-emerald-300'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <StoreLogo storeId={s} className="w-4 h-4 text-[7px]" />
                                <span className="font-bold text-slate-700">{STORES[s].nameFr}</span>
                              </div>

                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.05"
                                  value={tempPrices[s]}
                                  onChange={(e) =>
                                    setTempPrices({
                                      ...tempPrices,
                                      [s]: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  className="w-16 px-1.5 py-0.5 rounded border border-slate-300 text-xs font-black text-right"
                                />
                              ) : (
                                <span className="font-black text-slate-900">
                                  {formatMAD(p.prices[s])}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ADS MANAGER & SPACES */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    إدارة المساحات الإعلانية والرعايات (Ads Control)
                  </h3>
                  <p className="text-xs text-slate-500">
                    إضافة وتعديل عروض كارفور، مرجان، بيم، وأسواق السلام الممولة
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingAd(!isAddingAd)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة مساحة إعلانية جديدة</span>
                </button>
              </div>

              {/* Add New Ad Form */}
              {isAddingAd && (
                <form
                  onSubmit={handleCreateAd}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                >
                  <h4 className="font-black text-xs text-slate-800">تفاصيل الإعلان الجديد:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">عنوان الإعلان</label>
                      <input
                        type="text"
                        required
                        value={newAdTitle}
                        onChange={(e) => setNewAdTitle(e.target.value)}
                        placeholder="مثلاً: عروض نهاية الأسبوع في بيم"
                        className="w-full p-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">النص الفرعي / الوصف</label>
                      <input
                        type="text"
                        value={newAdSubtitle}
                        onChange={(e) => setNewAdSubtitle(e.target.value)}
                        placeholder="تخفيضات تصل إلى 30% على المواد الغذائية"
                        className="w-full p-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">المتجر الراعي</label>
                      <select
                        value={newAdStore}
                        onChange={(e) => setNewAdStore(e.target.value as StoreId)}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {STORE_KEYS.map((s) => (
                          <option key={s} value={s}>
                            {STORES[s].nameFr} ({STORES[s].nameAr})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">موقع الإعلان</label>
                      <select
                        value={newAdPosition}
                        onChange={(e) => setNewAdPosition(e.target.value as any)}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="comparison_inline">داخل شاشة المقارنة (Inline Banner)</option>
                        <option value="catalog_top">أعلى قائمة المنتجات (Top Banner)</option>
                        <option value="feed_interstitial">بين المنتجات (Feed Card)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">رابط الإعلان (URL)</label>
                      <input
                        type="url"
                        value={newAdUrl}
                        onChange={(e) => setNewAdUrl(e.target.value)}
                        placeholder="https://www.bim.ma"
                        className="w-full p-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAd(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      حفظ ونشر الإعلان
                    </button>
                  </div>
                </form>
              )}

              {/* Ads List */}
              <div className="space-y-3">
                {ads.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {ad.sponsorStore && (
                        <StoreLogo storeId={ad.sponsorStore} className="w-10 h-10" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">{ad.titleAr}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ad.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {ad.isActive ? 'مُفعّل ونشط' : 'مُعطل'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{ad.subtitleAr}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {ad.impressionsCount} ظهور
                          </span>
                          <span className="flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3 text-emerald-600" /> {ad.clicksCount} نقرة
                          </span>
                          <span>الموقع: {ad.position}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleAdStatus(ad.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          ad.isActive
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {ad.isActive ? 'تعطيل' : 'تفعيل'}
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="حذف الإعلان"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMMUNITY PRICE REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  بلاغات المجتمع حول فروق الأسعار ({reports.length})
                </h3>
                <p className="text-xs text-slate-500">
                  مراجعة البلاغات المقدمة من المشترين في مختلف المدن المغربية
                </p>
              </div>

              {reports.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold text-sm">لا توجد بلاغات جديدة معلقة</p>
                  <p className="text-xs">جميع الأسعار محدثة ومطابقة للرفوف حالياً</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <StoreLogo storeId={rep.storeId} className="w-9 h-9 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm text-slate-900">
                              {rep.productName}
                            </h4>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              {rep.city}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            السعر المبلغ عنه: <strong className="text-rose-600">{formatMAD(rep.reportedPrice)}</strong> • السبب: {rep.reason}
                          </p>
                          <span className="text-[10px] text-slate-400">{rep.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => onResolveReport(rep.id, 'approve')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>قبول وتحديث</span>
                        </button>
                        <button
                          onClick={() => onResolveReport(rep.id, 'reject')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>تجاهل</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
