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
        shortDesc: 'Fish Fry – कुरकुरीत आणि चमचमीत फिश फ्राय.', 
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
      // New requested Chicken Specialities
      { 
        id: 'nv-chicken-curry',
        name: 'Chicken Curry', 
        price: 180, 
        isVeg: false, 
        shortDesc: 'Chicken Curry – पारंपरिक सुगंधी चिकन रस्सा.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.7, 
        reviewCount: 130, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-chicken-sukka',
        name: 'Chicken Sukka', 
        price: 190, 
        isVeg: false, 
        shortDesc: 'Chicken Sukka – सुके खोबरे घालून बनवलेले सुके चिकन.', 
        spiceLevel: 'hot', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 140, 
        image: '/images/menu/chicken_thali.png' 
      },
      { 
        id: 'nv-chicken-kolhapuri',
        name: 'Chicken Kolhapuri', 
        price: 210, 
        isVeg: false, 
        shortDesc: 'Chicken Kolhapuri – झणझणीत कोल्हापुरी मसाल्यांचे चिकन.', 
        spiceLevel: 'hot', 
        prepTime: '16 mins', 
        rating: 4.9, 
        reviewCount: 175, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-chicken-masala',
        name: 'Chicken Masala', 
        price: 190, 
        isVeg: false, 
        shortDesc: 'Chicken Masala – जाडसर मसाल्यातील लज्जतदार चिकन.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 160, 
        image: '/images/menu/chicken_handi.png' 
      },
      { 
        id: 'nv-chicken-kheema',
        name: 'Chicken Kheema', 
        price: 220, 
        isVeg: false, 
        shortDesc: 'Chicken Kheema – बारीक खिमा आणि मसाल्यांचे मिश्रण.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 92, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-chicken-tikka',
        name: 'Chicken Tikka', 
        price: 240, 
        isVeg: false, 
        shortDesc: 'Chicken Tikka – दही आणि मसाल्यात मॅरीनेट केलेले तंदूर चिकन.', 
        spiceLevel: 'medium', 
        prepTime: '18 mins', 
        rating: 4.8, 
        reviewCount: 110, 
        image: '/images/menu/tandoori_chicken.png' 
      },
      { 
        id: 'nv-chicken-lollipop',
        name: 'Chicken Lollipop', 
        price: 180, 
        isVeg: false, 
        shortDesc: 'Chicken Lollipop – चटपटीत आणि कुरकुरीत चिकन लॉलीपॉप.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.7, 
        reviewCount: 185, 
        image: '/images/menu/tandoori_chicken.png' 
      },
      { 
        id: 'nv-chicken-65',
        name: 'Chicken 65', 
        price: 200, 
        isVeg: false, 
        shortDesc: 'Chicken 65 – दक्षिण भारतीय पद्धतीचे डीप-फ्राईड स्पायसी चिकन.', 
        spiceLevel: 'hot', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 120, 
        image: '/images/menu/tandoori_chicken.png' 
      },
      { 
        id: 'nv-chicken-chilli',
        name: 'Chicken Chilli', 
        price: 190, 
        isVeg: false, 
        shortDesc: 'Chicken Chilli – इंडो-चायनीज पद्धतीचे स्पायसी चिली चिकन.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.7, 
        reviewCount: 145, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-chicken-manchurian',
        name: 'Chicken Manchurian', 
        price: 180, 
        isVeg: false, 
        shortDesc: 'Chicken Manchurian – गोड आणि तिखट सॉस मधील चिकन मंचुरियन.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.7, 
        reviewCount: 115, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-butter-chicken',
        name: 'Butter Chicken', 
        price: 260, 
        isVeg: false, 
        shortDesc: 'Butter Chicken – क्रीमी टोमॅटो ग्रेव्हीमध्ये शिजवलेले तंदूर चिकन.', 
        spiceLevel: 'mild', 
        prepTime: '20 mins', 
        rating: 4.9, 
        reviewCount: 310, 
        image: '/images/menu/chicken_handi.png' 
      },
      { 
        id: 'nv-kadai-chicken',
        name: 'Kadai Chicken', 
        price: 240, 
        isVeg: false, 
        shortDesc: 'Kadai Chicken – शिमला मिरची आणि कढई मसाल्यांचे चिकन.', 
        spiceLevel: 'medium', 
        prepTime: '18 mins', 
        rating: 4.8, 
        reviewCount: 95, 
        image: '/images/menu/chicken_handi.png' 
      },
      { 
        id: 'nv-chicken-do-pyaza',
        name: 'Chicken Do Pyaza', 
        price: 230, 
        isVeg: false, 
        shortDesc: 'Chicken Do Pyaza – भरपूर कांद्यासह बनवलेले गोडसर-स्पायसी चिकन.', 
        spiceLevel: 'medium', 
        prepTime: '18 mins', 
        rating: 4.7, 
        reviewCount: 78, 
        image: '/images/menu/chicken_handi.png' 
      },
      { 
        id: 'nv-chicken-hyderabadi',
        name: 'Chicken Hyderabadi', 
        price: 250, 
        isVeg: false, 
        shortDesc: 'Chicken Hyderabadi – हैदराबादी पद्धतीचे चवदार चिकन.', 
        spiceLevel: 'hot', 
        prepTime: '20 mins', 
        rating: 4.8, 
        reviewCount: 88, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-chicken-pulav',
        name: 'Chicken Pulav', 
        price: 170, 
        isVeg: false, 
        shortDesc: 'Chicken Pulav – सुगंधी मसाल्यात शिजवलेला चिकन पुलाव.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.7, 
        reviewCount: 95, 
        image: '/images/menu/chicken_biryani.png' 
      },
      // New requested Mutton Specialities
      { 
        id: 'nv-mutton-curry',
        name: 'Mutton Curry', 
        price: 240, 
        isVeg: false, 
        shortDesc: 'Mutton Curry – पारंपरिक आणि चविष्ट मटण रस्सा.', 
        spiceLevel: 'hot', 
        prepTime: '20 mins', 
        rating: 4.8, 
        reviewCount: 165, 
        image: '/images/menu/mutton_rassa.png' 
      },
      { 
        id: 'nv-mutton-sukka',
        name: 'Mutton Sukka', 
        price: 260, 
        isVeg: false, 
        shortDesc: 'Mutton Sukka – सुक्या मसाल्यात फ्राय केलेले मटण सुक्के.', 
        spiceLevel: 'hot', 
        prepTime: '20 mins', 
        rating: 4.9, 
        reviewCount: 198, 
        image: '/images/menu/mutton_thali.png' 
      },
      { 
        id: 'nv-mutton-kolhapuri',
        name: 'Mutton Kolhapuri', 
        price: 280, 
        isVeg: false, 
        shortDesc: 'Mutton Kolhapuri – झणझणीत आणि तिखट कोल्हापुरी मटण.', 
        spiceLevel: 'extra-hot', 
        prepTime: '22 mins', 
        rating: 4.9, 
        reviewCount: 145, 
        image: '/images/menu/mutton_rassa.png' 
      },
      { 
        id: 'nv-mutton-masala',
        name: 'Mutton Masala', 
        price: 270, 
        isVeg: false, 
        shortDesc: 'Mutton Masala – घट्ट आणि मसालेदार मटण मसाला ग्रेव्ही.', 
        spiceLevel: 'hot', 
        prepTime: '20 mins', 
        rating: 4.8, 
        reviewCount: 132, 
        image: '/images/menu/mutton_handi.png' 
      },
      { 
        id: 'nv-mutton-kheema',
        name: 'Mutton Kheema', 
        price: 290, 
        isVeg: false, 
        shortDesc: 'Mutton Kheema – मटण खिमा आणि वाटाण्यांचे झणझणीत मिश्रण.', 
        spiceLevel: 'hot', 
        prepTime: '18 mins', 
        rating: 4.9, 
        reviewCount: 154, 
        image: '/images/menu/mutton_rassa.png' 
      },
      { 
        id: 'nv-mutton-pulav',
        name: 'Mutton Pulav', 
        price: 220, 
        isVeg: false, 
        shortDesc: 'Mutton Pulav – सुगंधी तांदूळ आणि मऊ मटण तुकड्यांचा पुलाव.', 
        spiceLevel: 'medium', 
        prepTime: '18 mins', 
        rating: 4.8, 
        reviewCount: 90, 
        image: '/images/menu/mutton_biryani.png' 
      },
      { 
        id: 'nv-mutton-rogan-josh',
        name: 'Mutton Rogan Josh', 
        price: 340, 
        isVeg: false, 
        shortDesc: 'Mutton Rogan Josh – काश्मिरी मसाल्यांचे सुगंधी मटण.', 
        spiceLevel: 'medium', 
        prepTime: '25 mins', 
        rating: 4.9, 
        reviewCount: 88, 
        image: '/images/menu/mutton_rassa.png' 
      },
      { 
        id: 'nv-mutton-liver-fry',
        name: 'Mutton Liver Fry (Kaleji Fry)', 
        price: 220, 
        isVeg: false, 
        shortDesc: 'Mutton Liver Fry – तव्यावर तिखट-मीठ लावून फ्राय केलेली मटण कलेजी.', 
        spiceLevel: 'hot', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 125, 
        image: '/images/menu/mutton_rassa.png' 
      },
      { 
        id: 'nv-mutton-brain-fry',
        name: 'Mutton Brain Fry (Bheja Fry)', 
        price: 240, 
        isVeg: false, 
        shortDesc: 'Mutton Brain Fry – मसाल्यात फ्राय केलेला भेजा.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 94, 
        image: '/images/menu/mutton_rassa.png' 
      },
      { 
        id: 'nv-mutton-paya-soup',
        name: 'Mutton Leg Soup (Paya Soup)', 
        price: 180, 
        isVeg: false, 
        shortDesc: 'Mutton Leg Soup – आरोग्यदायी आणि गरम मटण पाया सूप.', 
        spiceLevel: 'mild', 
        prepTime: '20 mins', 
        rating: 4.9, 
        reviewCount: 140, 
        image: '/images/menu/mutton_rassa.png' 
      },
      { 
        id: 'nv-mutton-chops',
        name: 'Mutton Chops', 
        price: 320, 
        isVeg: false, 
        shortDesc: 'Mutton Chops – मसाल्यात लपेटून ग्रिल केलेले मटण चॉप्स.', 
        spiceLevel: 'hot', 
        prepTime: '20 mins', 
        rating: 4.8, 
        reviewCount: 78, 
        image: '/images/menu/mutton_thali.png' 
      },
      // New requested Fish Specialities
      { 
        id: 'nv-fish-curry',
        name: 'Fish Curry', 
        price: 200, 
        isVeg: false, 
        shortDesc: 'Fish Curry – नारळाच्या दुधातील तिखट-आंबट माशांचे सार.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.7, 
        reviewCount: 110, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-surmai-fry',
        name: 'Surmai Fry', 
        price: 280, 
        isVeg: false, 
        shortDesc: 'Surmai Fry – रवा लावून फ्राय केलेला मऊ सुरमई मासा.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.9, 
        reviewCount: 168, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-pomfret-fry',
        name: 'Pomfret Fry', 
        price: 350, 
        isVeg: false, 
        shortDesc: 'Pomfret Fry – डीप-फ्राईड कुरकुरीत पापलेट मासा.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.9, 
        reviewCount: 134, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-bangda-fry',
        name: 'Bangda Fry', 
        price: 180, 
        isVeg: false, 
        shortDesc: 'Bangda Fry – कुरकुरीत फ्राय केलेला बांगडा मासा.', 
        spiceLevel: 'hot', 
        prepTime: '12 mins', 
        rating: 4.8, 
        reviewCount: 145, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-bangda-curry',
        name: 'Bangda Curry', 
        price: 170, 
        isVeg: false, 
        shortDesc: 'Bangda Curry – तिखट आणि आंबट बांगड्याचे तिखटले.', 
        spiceLevel: 'hot', 
        prepTime: '15 mins', 
        rating: 4.7, 
        reviewCount: 92, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-rawas-fry',
        name: 'Rawas Fry', 
        price: 300, 
        isVeg: false, 
        shortDesc: 'Rawas Fry – स्वादिष्ट आणि मऊ रावस फिश फ्राय.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 74, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-fish-thali',
        name: 'Fish Thali', 
        price: 290, 
        isVeg: false, 
        shortDesc: 'Fish Thali – फिश फ्राय, फिश करी, भात आणि भाकरीसह परिपूर्ण थाळी.', 
        isBestseller: true,
        spiceLevel: 'medium', 
        prepTime: '20 mins', 
        rating: 4.9, 
        reviewCount: 180, 
        image: '/images/menu/fish_fry.png' 
      },
      // New requested Crab & Seafood Specialities
      { 
        id: 'nv-crab-curry-seafood',
        name: 'Crab Curry', 
        price: 260, 
        isVeg: false, 
        shortDesc: 'Crab Curry – नारळाच्या तिखट मसाल्यातील खेकडा रस्सा.', 
        spiceLevel: 'hot', 
        prepTime: '18 mins', 
        rating: 4.7, 
        reviewCount: 65, 
        image: '/images/menu/khekda_rassa.png' 
      },
      { 
        id: 'nv-prawn-fry',
        name: 'Prawn Fry', 
        price: 240, 
        isVeg: false, 
        shortDesc: 'Prawn Fry – कुरकुरीत कोळंबी फ्राय.', 
        spiceLevel: 'medium', 
        prepTime: '12 mins', 
        rating: 4.8, 
        reviewCount: 112, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-prawn-curry',
        name: 'Prawn Curry', 
        price: 220, 
        isVeg: false, 
        shortDesc: 'Prawn Curry – पारंपरिक कोकणी पद्धतीचा कोळंबी रस्सा.', 
        spiceLevel: 'medium', 
        prepTime: '15 mins', 
        rating: 4.7, 
        reviewCount: 94, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-prawn-masala',
        name: 'Prawn Masala', 
        price: 250, 
        isVeg: false, 
        shortDesc: 'Prawn Masala – सुक्या मसाल्यातील चमचमीत कोळंबी मसाला.', 
        spiceLevel: 'hot', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 124, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-prawn-biryani',
        name: 'Prawn Biryani', 
        price: 280, 
        isVeg: false, 
        shortDesc: 'Prawn Biryani – सुगंधी बासमती तांदळातील कोळंबी बिर्याणी.', 
        isChefSpecial: true,
        spiceLevel: 'medium', 
        prepTime: '20 mins', 
        rating: 4.9, 
        reviewCount: 104, 
        image: '/images/menu/chicken_biryani.png' 
      },
      { 
        id: 'nv-squid-fry',
        name: 'Squid Fry (Kalamari)', 
        price: 220, 
        isVeg: false, 
        shortDesc: 'Squid Fry – मसाल्यात तळलेले कालमारी फ्राय.', 
        spiceLevel: 'medium', 
        prepTime: '12 mins', 
        rating: 4.7, 
        reviewCount: 58, 
        image: '/images/menu/fish_fry.png' 
      },
      { 
        id: 'nv-squid-masala',
        name: 'Squid Masala', 
        price: 240, 
        isVeg: false, 
        shortDesc: 'Squid Masala – सुक्या तिखट मसाल्यातील स्क्विड मसाला.', 
        spiceLevel: 'hot', 
        prepTime: '15 mins', 
        rating: 4.8, 
        reviewCount: 62, 
        image: '/images/menu/fish_fry.png' 
      },
      // New requested Desi / Gavran
      { 
        id: 'nv-desi-kombdi-rassa',
        name: 'Desi Kombdi Rassa', 
        price: 240, 
        isVeg: false, 
        shortDesc: 'Desi Kombdi Rassa – गावरान कोंबडीचा तिखट झणझणीत रस्सा.', 
        isChefSpecial: true,
        spiceLevel: 'extra-hot', 
        prepTime: '22 mins', 
        rating: 4.9, 
        reviewCount: 194, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-desi-kombdi-sukka',
        name: 'Desi Kombdi Sukka', 
        price: 260, 
        isVeg: false, 
        shortDesc: 'Desi Kombdi Sukka – गावठी कोंबडीचे चवदार सुके मटण.', 
        spiceLevel: 'hot', 
        prepTime: '20 mins', 
        rating: 4.9, 
        reviewCount: 146, 
        image: '/images/menu/chicken_thali.png' 
      },
      { 
        id: 'nv-desi-chicken-thali',
        name: 'Desi Chicken Thali', 
        price: 320, 
        isVeg: false, 
        shortDesc: 'Desi Chicken Thali – गावरान कोंबडी, रस्सा आणि भाकरीसह गावठी थाळी.', 
        isBestseller: true,
        spiceLevel: 'hot', 
        prepTime: '25 mins', 
        rating: 4.9, 
        reviewCount: 220, 
        image: '/images/menu/chicken_thali.png' 
      },
      { 
        id: 'nv-gavran-mutton-thali',
        name: 'Gavran Mutton Thali', 
        price: 380, 
        isVeg: false, 
        shortDesc: 'Gavran Mutton Thali – अस्सल गावरान पद्धतीने बनवलेली भरगच्च मटण थाळी.', 
        isBestseller: true,
        spiceLevel: 'extra-hot', 
        prepTime: '25 mins', 
        rating: 4.9, 
        reviewCount: 204, 
        image: '/images/menu/mutton_thali.png' 
      },
      { 
        id: 'nv-gavran-chicken-handi',
        name: 'Gavran Chicken Handi', 
        price: 450, 
        isVeg: false, 
        shortDesc: 'Gavran Chicken Handi – मातीच्या भांड्यात शिजवलेले गावरान चिकन.', 
        isChefSpecial: true,
        spiceLevel: 'hot', 
        prepTime: '22 mins', 
        rating: 4.9, 
        reviewCount: 118, 
        image: '/images/menu/chicken_handi.png' 
      },
      // New requested Egg Specialities
      { 
        id: 'nv-egg-curry',
        name: 'Egg Curry', 
        price: 120, 
        isVeg: false, 
        shortDesc: 'Egg Curry – मसाल्याच्या तिखट ग्रेव्हीमधील अंड्यांची करी.', 
        spiceLevel: 'medium', 
        prepTime: '10 mins', 
        rating: 4.7, 
        reviewCount: 168, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-egg-masala',
        name: 'Egg Masala', 
        price: 130, 
        isVeg: false, 
        shortDesc: 'Egg Masala – सुक्या कांदा-टोमॅटो मसाल्यातील उकडलेली अंडी.', 
        spiceLevel: 'medium', 
        prepTime: '12 mins', 
        rating: 4.8, 
        reviewCount: 130, 
        image: '/images/menu/chicken_rassa.png' 
      },
      { 
        id: 'nv-egg-bhurji',
        name: 'Egg Bhurji', 
        price: 80, 
        isVeg: false, 
        shortDesc: 'Egg Bhurji – कांदा, टोमॅटो आणि अंडी यांचे चमचमीत मिश्रण.', 
        isBestseller: true,
        spiceLevel: 'medium', 
        prepTime: '8 mins', 
        rating: 4.8, 
        reviewCount: 285, 
        image: '/images/menu/kanda_poha.png' 
      },
      { 
        id: 'nv-egg-fry',
        name: 'Egg Fry', 
        price: 60, 
        isVeg: false, 
        shortDesc: 'Egg Fry – तव्यावर फ्राय केलेले अंडी फ्राय.', 
        spiceLevel: 'mild', 
        prepTime: '5 mins', 
        rating: 4.6, 
        reviewCount: 94, 
        image: '/images/menu/kanda_poha.png' 
      },
      { 
        id: 'nv-boiled-egg',
        name: 'Boiled Egg', 
        price: 40, 
        isVeg: false, 
        shortDesc: 'Boiled Egg – उकडलेली ताजी अंडी (२ नग).', 
        spiceLevel: 'mild', 
        prepTime: '5 mins', 
        rating: 4.7, 
        reviewCount: 140, 
        image: '/images/menu/kanda_poha.png' 
      },
      { 
        id: 'nv-egg-biryani',
        name: 'Egg Biryani', 
        price: 160, 
        isVeg: false, 
        shortDesc: 'Egg Biryani – मसाल्याचे उकडलेले अंडे आणि सुगंधी भात बिर्याणी.', 
        spiceLevel: 'medium', 
        prepTime: '18 mins', 
        rating: 4.8, 
        reviewCount: 154, 
        image: '/images/menu/chicken_biryani.png' 
      },
      { 
        id: 'nv-anda-ghotala',
        name: 'Anda Ghotala', 
        price: 140, 
        isVeg: false, 
        shortDesc: 'Anda Ghotala – उकडलेले अंडे, भुर्जी आणि हाफ फ्रायचे मिश्रण.', 
        isChefSpecial: true,
        spiceLevel: 'hot', 
        prepTime: '12 mins', 
        rating: 4.9, 
        reviewCount: 110, 
        image: '/images/menu/kanda_poha.png' 
      },
      { 
        id: 'nv-half-fry',
        name: 'Half Fry', 
        price: 65, 
        isVeg: false, 
        shortDesc: 'Half Fry – चमचमीत पिवळा बलक असलेले हाफ फ्राय अंडे.', 
        spiceLevel: 'mild', 
        prepTime: '5 mins', 
        rating: 4.8, 
        reviewCount: 198, 
        image: '/images/menu/kanda_poha.png' 
      },
      { 
        id: 'nv-omelette',
        name: 'Omelette', 
        price: 70, 
        isVeg: false, 
        shortDesc: 'Omelette – कांदा-मिरची टाकून बनवलेले ताजे ऑम्लेट.', 
        spiceLevel: 'medium', 
        prepTime: '5 mins', 
        rating: 4.8, 
        reviewCount: 220, 
        image: '/images/menu/kanda_poha.png' 
      },
      { 
        id: 'nv-cheese-omelette',
        name: 'Cheese Omelette', 
        price: 90, 
        isVeg: false, 
        shortDesc: 'Cheese Omelette – भरपूर अमूल चीज घालून बनवलेले क्रीमी ऑम्लेट.', 
        spiceLevel: 'mild', 
        prepTime: '6 mins', 
        rating: 4.8, 
        reviewCount: 142, 
        image: '/images/menu/kanda_poha.png' 
      }
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
