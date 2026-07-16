import type { Product } from '@/types';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const MENU_CATEGORIES = [
  { 
    id: 'veg-specialities', 
    name: 'Veg Specialities', 
    slug: 'veg-specialities', 
    description: 'Famous Maharashtrian vegetarian selections.', 
    image: '/images/menu/misal_pav.png' 
  },
  { 
    id: 'non-veg-specialities', 
    name: 'Non-Veg Specialities', 
    slug: 'non-veg-specialities', 
    description: 'Delectable regional non-vegetarian dishes.', 
    image: '/images/menu/chicken_thali.png' 
  },
  { 
    id: 'breads', 
    name: 'Traditional Breads', 
    slug: 'breads', 
    description: 'Traditional rotis, bhakris, and naans.', 
    image: '/images/menu/pithla_bhakri.png' 
  },
  { 
    id: 'desserts', 
    name: 'Desserts', 
    slug: 'desserts', 
    description: 'Traditional sweets and desserts.', 
    image: '/images/menu/jalebi.png' 
  },
  { 
    id: 'beverages', 
    name: 'Beverages', 
    slug: 'beverages', 
    description: 'Refreshing hot and cold regional drinks.', 
    image: '/images/menu/cutting_chai.png' 
  },
];

const buildMenuItem = (
  categoryId: string,
  categoryName: string,
  item: {
    id?: string;
    name: string;
    price: number;
    isVeg: boolean;
    shortDesc: string;
    isBestseller?: boolean;
    isChefSpecial?: boolean;
    spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot' | string;
    prepTime?: string;
    rating?: number;
    reviewCount?: number;
    image: string;
  }
): Product => ({
  id: item.id || `${categoryId}-${slugify(item.name)}`,
  name: item.name,
  slug: slugify(item.name),
  description: item.shortDesc,
  shortDesc: item.shortDesc,
  price: item.price,
  stock: 999,
  images: [item.image],
  categoryId,
  category: { name: categoryName, slug: categoryId },
  rating: item.rating ?? 4.8,
  reviewCount: item.reviewCount ?? 120,
  isActive: true,
  isFeatured: item.isChefSpecial ?? false,
  isBestseller: item.isBestseller ?? false,
  isVeg: item.isVeg,
  isChefSpecial: item.isChefSpecial ?? false,
  spiceLevel: item.spiceLevel as ('mild' | 'medium' | 'hot' | 'extra-hot' | undefined),
  prepTime: item.prepTime ?? '15 mins',
  createdAt: new Date().toISOString(),
});

const inventoryByCategory = [
  {
    categoryId: 'veg-specialities',
    categoryName: 'Veg Specialities',
    items: [
      { 
        id: 'v-misal-pav',
        name: 'Misal Pav', 
        price: 120, 
        isVeg: true, 
        shortDesc: 'Misal Pav – अकोल्यातील सर्वात लोकप्रिय नाश्ता.', 
        isBestseller: true, 
        isChefSpecial: true,
        spiceLevel: 'hot', 
        prepTime: '10 mins', 
        rating: 4.9, 
        reviewCount: 245, 
        image: '/images/menu/misal_pav.png' 
      },
      { 
        id: 'v-pithla-bhakri',
        name: 'Pithla Bhakri / Zunka Bhakri', 
        price: 150, 
        isVeg: true, 
        shortDesc: 'Pithla Bhakri / Zunka Bhakri – ग्रामीण भागातील पारंपरिक जेवण.', 
        isChefSpecial: true,
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.9, 
        reviewCount: 176, 
        image: '/images/menu/pithla_bhakri.png' 
      },
      { 
        id: 'v-thalipeeth',
        name: 'Thalipeeth', 
        price: 100, 
        isVeg: true, 
        shortDesc: 'Thalipeeth – लोणी किंवा दह्यासोबत.', 
        spiceLevel: 'mild', 
        prepTime: '12 mins', 
        rating: 4.7, 
        reviewCount: 96, 
        image: '/images/menu/thalipeeth.png' 
      },
      { 
        id: 'v-vada-pav',
        name: 'Vada Pav', 
        price: 40, 
        isVeg: true, 
        shortDesc: 'Vada Pav – गरम वडा आणि चटणीसह.', 
        isBestseller: true, 
        spiceLevel: 'medium', 
        prepTime: '5 mins', 
        rating: 4.9, 
        reviewCount: 312, 
        image: '/images/menu/classic_vada_pav.png' 
      },
      { 
        id: 'v-sabudana-khichdi',
        name: 'Sabudana Khichdi', 
        price: 90, 
        isVeg: true, 
        shortDesc: 'Sabudana Khichdi – हलका आणि चविष्ट पदार्थ.', 
        spiceLevel: 'mild', 
        prepTime: '8 mins', 
        rating: 4.7, 
        reviewCount: 128, 
        image: '/images/menu/sabudana_khichdi.png' 
      },
      { 
        id: 'v-sabudana-vada',
        name: 'Sabudana Vada', 
        price: 80, 
        isVeg: true, 
        shortDesc: 'Sabudana Vada – उपवासात आणि नाश्त्यासाठी प्रसिद्ध.', 
        isBestseller: true,
        spiceLevel: 'mild', 
        prepTime: '8 mins', 
        rating: 4.8, 
        reviewCount: 142, 
        image: '/images/menu/sabudana_vada.png' 
      },
      { 
        id: 'v-kanda-bhaji',
        name: 'Kanda Bhaji', 
        price: 60, 
        isVeg: true, 
        shortDesc: 'Kanda Bhaji – कुरकुरीत आणि गरमागरम कांदा भजी.', 
        isBestseller: true,
        spiceLevel: 'medium', 
        prepTime: '10 mins', 
        rating: 4.8, 
        reviewCount: 195, 
        image: '/images/menu/kanda_bhaji.png' 
      },
      { 
        id: 'v-batata-bhaji',
        name: 'Batata Bhaji', 
        price: 60, 
        isVeg: true, 
        shortDesc: 'Batata Bhaji – गरमागरम आणि कुरकुरीत बटाटा भजी.', 
        isBestseller: true,
        spiceLevel: 'medium', 
        prepTime: '10 mins', 
        rating: 4.8, 
        reviewCount: 172, 
        image: '/images/menu/batata_bhaji.png' 
      },
      { 
        id: 'v-pohe',
        name: 'Pohe', 
        price: 50, 
        isVeg: true, 
        shortDesc: 'Pohe – कांदा आणि पोहे, लिंबू आणि ओल्या खोबऱ्यासह.', 
        spiceLevel: 'mild', 
        prepTime: '8 mins', 
        rating: 4.8, 
        reviewCount: 167, 
        image: '/images/menu/kanda_poha.png' 
      },
      { 
        id: 'v-maswadi',
        name: 'Maswadi', 
        price: 160, 
        isVeg: true, 
        shortDesc: 'Maswadi – पारंपरिक महाराष्ट्रीयन मासवडी आणि तिखट रस्सा.', 
        isChefSpecial: true,
        spiceLevel: 'hot', 
        prepTime: '18 mins', 
        rating: 4.9, 
        reviewCount: 142, 
        image: '/images/menu/maswadi.png' 
      },
    ],
  },
  {
    categoryId: 'non-veg-specialities',
    categoryName: 'Non-Veg Specialities',
    items: [
      { 
        id: 'nv-chicken-thali',
        name: 'Chicken Thali', 
        price: 250, 
        isVeg: false, 
        shortDesc: 'Chicken Thali – अस्सल चवीची कोल्हापुरी चिकन थाळी.', 
        isBestseller: true, 
        isChefSpecial: true,
        spiceLevel: 'hot', 
        prepTime: '20 mins', 
        rating: 4.9, 
        reviewCount: 289, 
        image: '/images/menu/chicken_thali.png' 
      },
      { 
        id: 'nv-mutton-thali',
        name: 'Mutton Thali', 
        price: 320, 
        isVeg: false, 
        shortDesc: 'Mutton Thali – मटण सुक्के, रस्सा आणि भाकरीसह भरगच्च थाळी.', 
        isChefSpecial: true,
        spiceLevel: 'hot', 
        prepTime: '22 mins', 
        rating: 4.9, 
        reviewCount: 254, 
        image: '/images/menu/mutton_thali.png' 
      },
      { 
        id: 'nv-mutton-rassa',
        name: 'Mutton Rassa', 
        price: 220, 
        isVeg: false, 
        shortDesc: 'Mutton Rassa – तिखट आणि झणझणीत मटण तांबडा रस्सा.', 
        isBestseller: true,
        spiceLevel: 'extra-hot', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 198, 
        image: '/images/menu/mutton_rassa.png' 
      },
      { 
        id: 'nv-chicken-rassa',
        name: 'Chicken Rassa', 
        price: 180, 
        isVeg: false, 
        shortDesc: 'Chicken Rassa – घरगुती मसाल्यांचा चिकन रस्सा.', 
        spiceLevel: 'hot', 
        prepTime: '15 mins', 
        rating: 4.7, 
        reviewCount: 167, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-chicken-handi',
        name: 'Chicken Handi', 
        price: 380, 
        isVeg: false, 
        shortDesc: 'Chicken Handi – मातीच्या हांडीमधील चविष्ट मसालेदार चिकन.', 
        isBestseller: true,
        spiceLevel: 'medium', 
        prepTime: '20 mins', 
        rating: 4.8, 
        reviewCount: 145, 
        image: '/images/menu/chicken_handi.png' 
      },
      { 
        id: 'nv-mutton-handi',
        name: 'Mutton Handi', 
        price: 480, 
        isVeg: false, 
        shortDesc: 'Mutton Handi – हांडीमध्ये संथ शिजवलेले मसालेदार मटण.', 
        isChefSpecial: true,
        spiceLevel: 'hot', 
        prepTime: '22 mins', 
        rating: 4.9, 
        reviewCount: 112, 
        image: '/images/menu/mutton_handi.png' 
      },
      { 
        id: 'nv-tandoori-chicken',
        name: 'Tandoori Chicken', 
        price: 260, 
        isVeg: false, 
        shortDesc: 'Tandoori Chicken – तंदूरमध्ये भाजलेले चटपटीत चिकन.', 
        spiceLevel: 'medium', 
        prepTime: '18 mins', 
        rating: 4.8, 
        reviewCount: 203, 
        image: '/images/menu/tandoori_chicken.png' 
      },
      { 
        id: 'nv-chicken-biryani',
        name: 'Chicken Biryani', 
        price: 200, 
        isVeg: false, 
        shortDesc: 'Chicken Biryani – सुगंधी बासमती राईसची चिकन बिर्याणी.', 
        isBestseller: true,
        spiceLevel: 'medium', 
        prepTime: '20 mins', 
        rating: 4.9, 
        reviewCount: 341, 
        image: '/images/menu/chicken_biryani.png' 
      },
      { 
        id: 'nv-mutton-biryani',
        name: 'Mutton Biryani', 
        price: 260, 
        isVeg: false, 
        shortDesc: 'Mutton Biryani – गरमागरम आणि लज्जतदार मटण बिर्याणी.', 
        isChefSpecial: true,
        spiceLevel: 'medium', 
        prepTime: '22 mins', 
        rating: 4.9, 
        reviewCount: 212, 
        image: '/images/menu/mutton_biryani.png' 
      },
      { 
        id: 'nv-fish-fry',
        name: 'Fish Fry', 
        price: 220, 
        isVeg: false, 
        shortDesc: 'Fish Fry (काही हॉटेल्समध्ये) – कुरकुरीत आणि चमचमीत फिश फ्राय.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 145, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-crab-masala',
        name: 'Khekda Masala', 
        price: 280, 
        isVeg: false, 
        shortDesc: 'खेकडा मसाला – घट्ट नारळाच्या मसाल्यातील खेकडा.', 
        isChefSpecial: true,
        spiceLevel: 'hot', 
        prepTime: '18 mins', 
        rating: 4.8, 
        reviewCount: 98, 
        image: '/images/menu/khekda_masala.png' 
      },
      { 
        id: 'nv-crab-curry',
        name: 'Khekda Rassa', 
        price: 260, 
        isVeg: false, 
        shortDesc: 'खेकडा रस्सा – झणझणीत खेकड्याचा काळपट-तांबडा रस्सा.', 
        spiceLevel: 'hot', 
        prepTime: '18 mins', 
        rating: 4.7, 
        reviewCount: 84, 
        image: '/images/menu/khekda_rassa.png' 
      },
      { 
        id: 'nv-spicy-crab-fry',
        name: 'Khekda Fry', 
        price: 290, 
        isVeg: false, 
        shortDesc: 'खेकडा फ्राय – सुका व तिखट फ्राय केलेला खेकडा.', 
        isBestseller: true,
        spiceLevel: 'hot', 
        prepTime: '18 mins', 
        rating: 4.8, 
        reviewCount: 76, 
        image: '/images/menu/khekda_fry.png' 
      },
    ],
  },
  {
    categoryId: 'breads',
    categoryName: 'Traditional Breads',
    items: [
      {
        id: 'b-bajri-bhakar',
        name: 'Bajri chi Bhakar',
        price: 30,
        isVeg: true,
        shortDesc: 'Bajri chi Bhakar – गरम आणि पौष्टिक बाजरीची भाकरी.',
        prepTime: '8 mins',
        rating: 4.8,
        reviewCount: 94,
        image: '/images/menu/bajri_bhakar.png'
      },
      {
        id: 'b-tandlachi-bhakar',
        name: 'Tandlachi Bhakar',
        price: 35,
        isVeg: true,
        shortDesc: 'Tandlachi Bhakar – मऊ आणि पांढरीशुभ्र तांदळाची भाकरी.',
        prepTime: '8 mins',
        rating: 4.8,
        reviewCount: 76,
        image: '/images/menu/tandlachi_bhakar.png'
      },
      {
        id: 'b-chapati',
        name: 'Chapati',
        price: 15,
        isVeg: true,
        shortDesc: 'Chapati – गव्हाची मऊ आणि घडीची चपाती (पोळी).',
        prepTime: '5 mins',
        rating: 4.7,
        reviewCount: 152,
        image: '/images/menu/chapati.png'
      },
      {
        id: 'b-roti',
        name: 'Roti',
        price: 12,
        isVeg: true,
        shortDesc: 'Roti – साधी गव्हाची तवा रोटी.',
        prepTime: '5 mins',
        rating: 4.6,
        reviewCount: 110,
        image: '/images/menu/tandoori_roti.png'
      },
      {
        id: 'b-naan',
        name: 'Naan',
        price: 30,
        isVeg: true,
        shortDesc: 'Naan – तंदूरमध्ये भाजलेला बटर नान.',
        prepTime: '8 mins',
        rating: 4.8,
        reviewCount: 185,
        image: '/images/menu/butter_naan.png'
      },
      {
        id: 'b-nagli-bhakar',
        name: 'Nagli chi Bhakar',
        price: 35,
        isVeg: true,
        shortDesc: 'Nagli chi Bhakar – कॅल्शियमयुक्त नागलीची (नाचणीची) भाकरी.',
        prepTime: '8 mins',
        rating: 4.7,
        reviewCount: 68,
        image: '/images/menu/nagli_bhakar.png'
      },
      {
        id: 'b-jwari-bhakar',
        name: 'Jwari chi Bhakar',
        price: 25,
        isVeg: true,
        shortDesc: 'Jwari chi Bhakar – पचनास हलकी आणि रुचकर ज्वारीची भाकरी.',
        prepTime: '8 mins',
        rating: 4.9,
        reviewCount: 204,
        image: '/images/menu/jwari_bhakar.png'
      }
    ]
  },
  {
    categoryId: 'desserts',
    categoryName: 'Desserts',
    items: [
      { 
        id: 'd-puran-poli',
        name: 'Puran Poli', 
        price: 120, 
        isVeg: true, 
        shortDesc: 'Puran Poli – महाराष्ट्राचा पारंपारिक आणि सणासुदीचा गोड पदार्थ.', 
        isBestseller: true,
        spiceLevel: 'mild', 
        prepTime: '10 mins', 
        rating: 4.9, 
        reviewCount: 153, 
        image: '/images/menu/puran_poli.png' 
      },
      { 
        id: 'd-jalebi',
        name: 'Jalebi', 
        price: 80, 
        isVeg: true, 
        shortDesc: 'Jalebi – गरमागरम आणि रसाळ जलेबी.', 
        isBestseller: true,
        spiceLevel: 'mild', 
        prepTime: '5 mins', 
        rating: 4.8, 
        reviewCount: 201, 
        image: '/images/menu/jalebi.png' 
      },
    ],
  },
  {
    categoryId: 'beverages',
    categoryName: 'Beverages',
    items: [
      { 
        id: 'b-cutting-chai',
        name: 'Cutting Chai', 
        price: 25, 
        isVeg: true, 
        shortDesc: 'Cutting Chai – गरम चहा भजी किंवा वडापावसोबत.', 
        isBestseller: true,
        spiceLevel: 'mild', 
        prepTime: '5 mins', 
        rating: 4.9, 
        reviewCount: 389, 
        image: '/images/menu/cutting_chai.png' 
      },
    ],
  },
];

export const MENU_ITEMS: Product[] = inventoryByCategory.flatMap((entry) =>
  entry.items.map((item) => buildMenuItem(entry.categoryId, entry.categoryName, item))
);

export const FEATURED_DISHES = [
  { title: 'Misal Pav', category: 'Veg Specialities', subtitle: 'अकोल्यातील सर्वात लोकप्रिय नाश्ता.', image: '/images/menu/misal_pav.png' },
  { title: 'Chicken Thali', category: 'Non-Veg Specialities', subtitle: 'अस्सल कोल्हापुरी थाळी.', image: '/images/menu/chicken_thali.png' },
  { title: 'Puran Poli', category: 'Desserts', subtitle: 'सणासुदीचा गोड पदार्थ.', image: '/images/menu/puran_poli.png' },
];

export const CHEF_RECOMMENDATIONS = [
  { name: 'Mutton Thali', description: 'अस्सल गावरान मटण थाळी.', image: '/images/menu/mutton_thali.png' },
  { name: 'Thalipeeth', description: 'लोणी किंवा दह्यासोबत.', image: '/images/menu/thalipeeth.png' },
  { name: 'Cutting Chai', description: 'भजी किंवा वडापावसोबत.', image: '/images/menu/cutting_chai.png' },
];

export const TOP_CATEGORY_HIGHLIGHTS = MENU_CATEGORIES.slice(0, 4);
