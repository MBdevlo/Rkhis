export type StoreId = 'marjane' | 'carrefour' | 'aswak' | 'bim';

export interface StoreInfo {
  id: StoreId;
  nameAr: string;
  nameFr: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  logoText: string;
  branchesCount: number;
}

export interface MoroccanCity {
  id: string;
  nameAr: string;
  nameFr: string;
  region: string;
  stores: StoreId[];
  isPopular?: boolean;
}

export interface PriceHistoryPoint {
  date: string; // e.g. "01/09"
  marjane: number;
  carrefour: number;
  aswak: number;
  bim: number;
}

export interface Product {
  id: string;
  nameAr: string;
  nameFr: string;
  brand: string;
  category: string;
  volume: string;
  barcode: string;
  emoji: string;
  imageBg: string;
  imageUrl?: string;
  prices: Record<StoreId, number>;
  updatedAt: string;
  history30d: PriceHistoryPoint[];
  isCustom?: boolean;
  notes?: string;
}

export interface PriceReport {
  id: string;
  productId: string;
  productName: string;
  storeId: StoreId;
  city: string;
  reportedPrice: number;
  reason: string;
  timestamp: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface AdBanner {
  id: string;
  titleAr: string;
  titleFr: string;
  subtitleAr: string;
  subtitleFr: string;
  sponsorName: string;
  sponsorStore?: StoreId;
  ctaTextAr: string;
  ctaTextFr: string;
  badgeAr: string;
  badgeFr: string;
  bgColor: string;
  textColor: string;
  linkUrl: string;
  isActive: boolean;
  clicksCount: number;
  impressionsCount: number;
  position: 'comparison_inline' | 'catalog_top' | 'feed_interstitial';
}

