import { Product, StoreId } from '../types';
import { STORES, STORE_KEYS } from '../data/stores';

export interface CheapestResult {
  cheapestStore: StoreId;
  minPrice: number;
  maxPrice: number;
  saving: number;
  savingPercent: number;
  badge: string;
  rankedStores: {
    storeId: StoreId;
    price: number;
    diffFromCheapest: number;
    isCheapest: boolean;
  }[];
}

/**
 * Core Logic: findCheapest(product, cityStores, cityName)
 * Computes the cheapest store among stores present in the selected city,
 * or across all 4 stores by default.
 */
export function findCheapest(
  product: Product,
  cityStores: StoreId[] = STORE_KEYS,
  cityName: string = 'المغرب'
): CheapestResult {
  // Filter stores available in this city
  const activeStores = cityStores.length > 0 ? cityStores : STORE_KEYS;
  
  const entries: { storeId: StoreId; price: number }[] = activeStores.map((s) => ({
    storeId: s,
    price: product.prices[s] ?? 0,
  }));

  // Sort ascending by price
  entries.sort((a, b) => a.price - b.price);

  const minItem = entries[0];
  const maxItem = entries[entries.length - 1];

  const minPrice = minItem ? minItem.price : 0;
  const maxPrice = maxItem ? maxItem.price : minPrice;
  const saving = Number((maxPrice - minPrice).toFixed(2));
  const savingPercent = maxPrice > 0 ? Math.round((saving / maxPrice) * 100) : 0;

  const rankedStores = entries.map((item) => ({
    storeId: item.storeId,
    price: item.price,
    diffFromCheapest: Number((item.price - minPrice).toFixed(2)),
    isCheapest: item.storeId === minItem.storeId,
  }));

  return {
    cheapestStore: minItem.storeId,
    minPrice,
    maxPrice,
    saving,
    savingPercent,
    badge: `أرخص ثمن في ${cityName}`,
    rankedStores,
  };
}

/**
 * Format Moroccan Dirham currency to match the screenshot: 9,20 MAD
 */
export function formatMAD(amount: number): string {
  return `${amount.toFixed(2).replace('.', ',')} MAD`;
}

export function formatDH(amount: number): string {
  return formatMAD(amount);
}

