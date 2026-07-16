import { create } from 'zustand';

export type Language = 'en' | 'mr';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: (localStorage.getItem('language') as Language) || 'en',
  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },
}));

export const translations = {
  en: {
    home: 'Home',
    menu: 'Menu',
    about: 'About',
    reserve: 'Reserve',
    events: 'Events',
    gallery: 'Gallery',
    contact: 'Contact',
    orderNow: 'Order Now',
    profileSettings: 'Profile Settings',
    personalDetails: 'Personal Details',
    fullName: 'Full Name',
    phone: 'Phone Number',
    email: 'Email Address',
    saveChanges: 'Save Changes',
    verified: 'Verified',
    accountCredentials: 'Language & Account Settings',
    selectLanguage: 'Select Language',
    english: 'English',
    marathi: 'मराठी (Marathi)',
    searchPlaceholder: 'Search items...',
    cart: 'Cart',
    logout: 'Logout',
    dashboard: 'Dashboard',
    myOrders: 'My Orders',
    wishlist: 'Wishlist',
    blog: 'Blog',
    franchise: 'Franchise',
    settings: 'Settings',
    secureAccount: 'Secure Account',
    supportMessage: 'Email changes require contacting customer support to ensure security.',
    login: 'Login',
    signUp: 'Sign Up',
    
    // Additional Page Translations
    vegSpecialities: 'Veg Specialities',
    nonVegSpecialities: 'Non-Veg Specialities',
    discoverFlavors: 'Discover the Flavors of Maharashtra',
    menuTitle: 'Luxury Maharashtra Café Menu',
    searchPremiumMenu: 'Search our premium menu...',
    all: 'All',
    itemsFound: 'items matching selection.',
    clearFilters: 'Clear Filters',
    noItemsFound: 'No items found',
    resetMenu: 'Reset Menu',
    explore: 'Explore',
    company: 'Company',
    visitUs: 'Visit Us',
    hours: 'Hours',
    footerText: 'Brewing Connections, Serving Memories. A premium café experience crafted for those who appreciate the art of coffee.',
    veg: 'Veg',
    nonVeg: 'Non-Veg',
    traditionalBreads: 'Traditional Breads',
    desserts: 'Desserts',
    beverages: 'Beverages',
    hoursWeek: 'Mon – Fri: 7:00 AM – 11:00 PM',
    hoursWeekend: 'Sat – Sun: 8:00 AM – 12:00 AM',
    reserveTable: 'Reserve a Table',
    aboutUs: 'About Us',

    // Hero Section Translations
    welcomeToCafe: 'Welcome to Akole Cafe',
    heroSub: 'Experience the perfect blend of rich flavors and a cozy atmosphere crafted just for you. Every cup tells a story.',
    exploreMenu: 'Explore Menu',
    brewing: 'Brewing',
    connections: 'Connections,',
    serving: 'Serving',
    memories: 'Memories',
    bestseller: 'Bestseller',

    // Map Translations
    destination: 'Destination',
    yourPosition: 'Your Position',
    liveTrackingActive: 'Live Tracking Active',
    connectingGps: 'Connecting GPS...',
    gpsInactive: 'GPS Inactive',
    drivingDistance: 'Driving Distance',
    estDrive: 'Est. Drive',
    enableGps: 'Enable GPS Directions',
    startNavigation: 'Start Navigation',
    recenterMap: 'Recenter Map',
    satellite: 'Satellite',
    normal: 'Normal',
  },
  mr: {
    home: 'मुख्यपृष्ठ',
    menu: 'मेनू',
    about: 'आमच्याबद्दल',
    reserve: 'टेबल बुक करा',
    events: 'कार्यक्रम',
    gallery: 'गॅलरी',
    contact: 'संपर्क',
    orderNow: 'ऑर्डर करा',
    profileSettings: 'प्रोफाइल सेटिंग्स',
    personalDetails: 'वैयक्तिक तपशील',
    fullName: 'पूर्ण नाव',
    phone: 'फोन नंबर',
    email: 'ईमेल पत्ता',
    saveChanges: 'बदल जतन करा',
    verified: 'सत्यापित',
    accountCredentials: 'भाषा आणि खाते सेटिंग्स',
    selectLanguage: 'भाषा निवडा',
    english: 'English (इंग्रजी)',
    marathi: 'मराठी',
    searchPlaceholder: 'शोध घ्या...',
    cart: 'कार्ट',
    logout: 'बाहेर पडा',
    dashboard: 'डॅशबोर्ड',
    myOrders: 'माझ्या ऑर्डर्स',
    wishlist: 'आवडते पदार्थ',
    blog: 'ब्लॉग',
    franchise: 'फ्रँचायझी',
    settings: 'सेटिंग्ज',
    secureAccount: 'सुरक्षित खाते',
    supportMessage: 'सुरक्षेसाठी ईमेल बदलण्यासाठी ग्राहक समर्थनाशी संपर्क साधणे आवश्यक आहे.',
    login: 'लॉगिन',
    signUp: 'नोंदणी करा',

    // Additional Page Translations
    vegSpecialities: 'शाकाहारी वैशिष्ट्ये',
    nonVegSpecialities: 'मांसाहारी वैशिष्ट्ये',
    discoverFlavors: 'महाराष्ट्राच्या अस्सल चवींचा आस्वाद घ्या',
    menuTitle: 'अकोले कॅफे खास महाराष्ट्रियन मेनू',
    searchPremiumMenu: 'मेनू शोधा...',
    all: 'सर्व',
    itemsFound: 'पदार्थ उपलब्ध आहेत.',
    clearFilters: 'फिल्टर काढा',
    noItemsFound: 'कोणतेही पदार्थ सापडले नाहीत',
    resetMenu: 'मेनू रिसेट करा',
    explore: 'शोधा',
    company: 'कंपनी',
    visitUs: 'पत्ता',
    hours: 'वेळापत्रक',
    footerText: 'सुंदर नाती आणि आठवणी विणणारा आपला कॅफे. कॉफीच्या उत्तम प्रतीचा आस्वाद घेणाऱ्यांसाठी खास बनवला आहे.',
    veg: 'शाकाहारी',
    nonVeg: 'मांसाहारी',
    traditionalBreads: 'पारंपरिक भाकरी / चपाती',
    desserts: 'गोड पदार्थ',
    beverages: 'पेये (Drinks)',
    hoursWeek: 'सोम – शुक्र: सकाळी ७:०० – रात्री ११:००',
    hoursWeekend: 'शनि – रवि: सकाळी ८:०० – रात्री ८:००',
    reserveTable: 'टेबल बुक करा',
    aboutUs: 'आमच्याबद्दल',

    // Hero Section Translations
    welcomeToCafe: 'अकोले कॅफेमध्ये आपले स्वागत आहे',
    heroSub: 'उत्कृष्ट चव आणि आल्हाददायक वातावरणाचा अनुभव घ्या. आमचा प्रत्येक कप एक सुंदर आठवण आणि नवीन ओळख निर्माण करतो.',
    exploreMenu: 'मेनू पहा',
    brewing: 'नाते विणणारे',
    connections: 'कॅफेचे वातावरण,',
    serving: 'आठवणी देणारे',
    memories: 'पदार्थ',
    bestseller: 'विशेष लोकप्रिय',

    // Map Translations
    destination: 'पत्ता',
    yourPosition: 'तुमचे स्थान',
    liveTrackingActive: 'थेट स्थान ट्रॅकिंग सुरू',
    connectingGps: 'जीपीएस कनेक्ट होत आहे...',
    gpsInactive: 'जीपीएस बंद आहे',
    drivingDistance: 'अंतर',
    estDrive: 'अंदाजे वेळ',
    enableGps: 'जीपीएस दिशा-निर्देश सुरू करा',
    startNavigation: 'नेव्हिगेशन सुरू करा',
    recenterMap: 'नकाशा रीसेंटर करा',
    satellite: 'सॅटेलाईट',
    normal: 'नॉर्मल',
  }
};

export const useTranslation = () => {
  const { language, setLanguage } = useLanguageStore();
  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key];
  };
  const getCategoryTranslation = (slug: string, fallback: string) => {
    if (slug === 'veg-specialities') return t('vegSpecialities');
    if (slug === 'non-veg-specialities') return t('nonVegSpecialities');
    if (slug === 'breads') return t('traditionalBreads');
    if (slug === 'desserts') return t('desserts');
    if (slug === 'beverages') return t('beverages');
    return fallback;
  };
  return { t, language, setLanguage, getCategoryTranslation };
};
