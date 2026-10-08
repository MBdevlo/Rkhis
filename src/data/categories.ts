export interface ProductCategory {
  id: string;
  nameAr: string;
  nameFr: string;
  emoji: string;
  color: string;
  bgColor: string;
  department: 'clothes_men' | 'clothes_women' | 'clothes_kids' | 'food' | 'cleaning' | 'electromenager';
  description?: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  // ==========================================
  // قسم الملابس (مقسم حسب طلب المستخدم: رجال، نساء، أطفال)
  // ==========================================
  {
    id: 'vetements_homme',
    nameAr: 'ملابس خاصة بالرجال',
    nameFr: 'Vêtements Homme',
    emoji: '👔',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    department: 'clothes_men',
    description: 'أقمصة، بولو، سراويل، تي شيرت، بيجامات وملابس رياضية رجالية',
  },
  {
    id: 'vetements_femme',
    nameAr: 'ملابس خاصة بالنساء',
    nameFr: 'Vêtements Femme',
    emoji: '👗',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 border-rose-200',
    department: 'clothes_women',
    description: 'فساتين، بيجامات، ملابس منزلية، ليغينغ، حجاب وعباءات نسائية',
  },
  {
    id: 'vetements_enfants',
    nameAr: 'ملابس خاصة بالأطفال',
    nameFr: 'Vêtements Enfants & Bébés',
    emoji: '🧒',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    department: 'clothes_kids',
    description: 'أطقم أطفال، بودي رضع، بيجامات مخملية، جوارب وألبسة صيفية وشتوية',
  },
  {
    id: 'linge_maison',
    nameAr: 'مفروشات ومنسوجات المنزل',
    nameFr: 'Linge de Maison',
    emoji: '🛏️',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    department: 'cleaning',
    description: 'فوط حمام، أغطية وسادات، شراشف ومنسوجات قطنية',
  },

  // ==========================================
  // المواد الغذائية (Alimentation)
  // ==========================================
  {
    id: 'laitiers',
    nameAr: 'الألبان والأجبان',
    nameFr: 'Produits laitiers & Fromages',
    emoji: '🥛',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    department: 'food',
  },
  {
    id: 'huiles_epicerie',
    nameAr: 'الزيوت والمواد الأساسية',
    nameFr: 'Huiles & Épicerie',
    emoji: '🌻',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    department: 'food',
  },
  {
    id: 'boissons',
    nameAr: 'المشروبات والماء',
    nameFr: 'Eaux & Boissons',
    emoji: '💧',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 border-cyan-200',
    department: 'food',
  },
  {
    id: 'the_cafe',
    nameAr: 'الشاي والقهوة والسكر',
    nameFr: 'Thé, Café & Sucre',
    emoji: '🍵',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    department: 'food',
  },
  {
    id: 'biscuits',
    nameAr: 'بسكويت وشوكولاتة',
    nameFr: 'Biscuits & Chocolats',
    emoji: '🍪',
    color: 'text-amber-700',
    bgColor: 'bg-orange-50 border-orange-200',
    department: 'food',
  },
  {
    id: 'conserves',
    nameAr: 'المعلبات والتوابل',
    nameFr: 'Conserves & Sauces',
    emoji: '🥫',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    department: 'food',
  },

  // ==========================================
  // مواد التنظيف والعناية (Entretien & Hygiène)
  // ==========================================
  {
    id: 'nettoyage',
    nameAr: 'مواد التنظيف والغسيل',
    nameFr: 'Entretien & Lessive',
    emoji: '🧼',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    department: 'cleaning',
  },
  {
    id: 'bebe_hygiene',
    nameAr: 'العناية بالأطفال والنظافة',
    nameFr: 'Hygiène & Bébé',
    emoji: '👶',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    department: 'cleaning',
  },
  // ==========================================
  // الأجهزة المنزلية والمطبخ (Électroménager & Cuisine)
  // ==========================================
  {
    id: 'electromenager',
    nameAr: 'الأجهزة المنزلية والمطبخ',
    nameFr: 'Électroménager & Cuisine',
    emoji: '🔌',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    department: 'electromenager',
    description: 'خلاطات، محضرات طعام، آلات قهوة، ومجففات وأجهزة منزلية ذكية',
  },
];
