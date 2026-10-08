import { StoreId, StoreInfo } from '../types';

export const STORES: Record<StoreId, StoreInfo> = {
  carrefour: {
    id: 'carrefour',
    nameAr: 'كارفور',
    nameFr: 'Carrefour',
    tagline: 'Je positive - بالحسن أضمن',
    primaryColor: '#00387B',
    accentColor: '#EF4444',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-800',
    logoText: 'C',
    branchesCount: 110,
  },
  marjane: {
    id: 'marjane',
    nameAr: 'مرجان',
    nameFr: 'Marjane',
    tagline: 'مربوح مع مرجان - Tout le monde y gagne',
    primaryColor: '#004B93',
    accentColor: '#FBBF24',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    logoText: 'M',
    branchesCount: 140,
  },
  aswak: {
    id: 'aswak',
    nameAr: 'أسواق السلام',
    nameFr: 'Aswak Assalam',
    tagline: 'الراحة والتوفير لكل العائلة',
    primaryColor: '#047857',
    accentColor: '#D97706',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    logoText: 'AS',
    branchesCount: 35,
  },
  bim: {
    id: 'bim',
    nameAr: 'بيم',
    nameFr: 'BIM',
    tagline: 'الجودة بثمن رخيص في حومتك',
    primaryColor: '#DC2626',
    accentColor: '#991B1B',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    logoText: 'BIM',
    branchesCount: 650,
  },
};

export const STORE_KEYS: StoreId[] = ['carrefour', 'marjane', 'aswak', 'bim'];

export function getStoreBranchInfo(storeId: StoreId, cityName: string): { branchName: string; distance: string } {
  const branches: Record<StoreId, Record<string, string>> = {
    carrefour: {
      'الرباط': 'Hay Riad, Rabat',
      'الدار البيضاء': 'Sidi Maârouf, Casablanca',
      'مراكش': 'Targa, Marrakech',
      'طنجة': 'Socco Alto, Tanger',
      'فاس': 'Route d’Imouzzer, Fès',
      'أكادير': 'Avenue Hassan II, Agadir',
    },
    marjane: {
      'الرباط': 'Marjane Bouregreg, Rabat',
      'الدار البيضاء': 'Marjane Anfa, Casablanca',
      'مراكش': 'Marjane Menara, Marrakech',
      'طنجة': 'Marjane Medina, Tanger',
      'فاس': 'Marjane Agdal, Fès',
      'أكادير': 'Marjane Founty, Agadir',
    },
    aswak: {
      'الرباط': 'Aswak Assalam Agdal',
      'الدار البيضاء': 'Aswak Assalam Ouled Ziane',
      'مراكش': 'Aswak Assalam Guéliz',
      'طنجة': 'Aswak Assalam Malabata',
      'أكادير': 'Aswak Assalam Talborjt',
    },
    bim: {
      'الرباط': 'BIM Hay Salam',
      'الدار البيضاء': 'BIM Maarif',
      'مراكش': 'BIM Daoudiate',
      'طنجة': 'BIM Castilla',
      'فاس': 'BIM Narjiss',
      'أكادير': 'BIM Dakhla',
    },
  };

  const branchName = branches[storeId]?.[cityName] || `${STORES[storeId].nameFr} Centre, ${cityName}`;
  const distances: Record<StoreId, string> = {
    carrefour: '1.2 km',
    marjane: '2.5 km',
    aswak: '3.0 km',
    bim: '0.8 km',
  };

  return {
    branchName,
    distance: distances[storeId] || '1.5 km',
  };
}

