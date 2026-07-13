// ============================================================
// SUPPORTED LANGUAGES — 13 Indian Languages
// ============================================================

const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    translations: {
      'welcome': 'Welcome to EmergencyHub',
      'help': 'Help is just 1 tap away',
      'services': 'Services',
      'features': 'Features',
      'pricing': 'Pricing',
      'join': 'Join Waitlist',
      'emergency': 'Emergency',
      'sos': 'SOS Alert',
      'payment': 'Payment',
      'tracking': 'Live Tracking',
      'profile': 'Profile',
      'settings': 'Settings',
      'logout': 'Logout',
      'book_now': 'Book Now',
      'contact': 'Contact',
      'about': 'About Us',
      'search': 'Search',
      'view_all': 'View All',
      'no_results': 'No results found'
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub में आपका स्वागत है',
      'help': 'मदद बस 1 टैप दूर है',
      'services': 'सेवाएँ',
      'features': 'विशेषताएँ',
      'pricing': 'मूल्य निर्धारण',
      'join': 'प्रतीक्षा सूची में शामिल हों',
      'emergency': 'आपातकाल',
      'sos': 'SOS अलर्ट',
      'payment': 'भुगतान',
      'tracking': 'लाइव ट्रैकिंग',
      'profile': 'प्रोफ़ाइल',
      'settings': 'सेटिंग्स',
      'logout': 'लॉगआउट',
      'book_now': 'अभी बुक करें',
      'contact': 'संपर्क करें',
      'about': 'हमारे बारे में',
      'search': 'खोजें',
      'view_all': 'सभी देखें',
      'no_results': 'कोई परिणाम नहीं मिला'
    }
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub मध्ये आपले स्वागत आहे',
      'help': 'मदत फक्त 1 टॅप दूर आहे',
      'services': 'सेवा',
      'features': 'वैशिष्ट्ये',
      'pricing': 'किंमत',
      'join': 'प्रतीक्षा यादीत सामील व्हा',
      'emergency': 'आपत्कालीन',
      'sos': 'SOS अलर्ट',
      'payment': 'पैसे',
      'tracking': 'लाइव्ह ट्रॅकिंग',
      'profile': 'प्रोफाइल',
      'settings': 'सेटिंग्ज',
      'logout': 'बाहेर पडा',
      'book_now': 'आता बुक करा',
      'contact': 'संपर्क करा',
      'about': 'आमच्याबद्दल',
      'search': 'शोधा',
      'view_all': 'सर्व पहा',
      'no_results': 'कोणतेही परिणाम आढळले नाहीत'
    }
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub க்கு வரவேற்கிறோம்',
      'help': 'உதவி ஒரு தொடுதலில்',
      'services': 'சேவைகள்',
      'features': 'அம்சங்கள்',
      'pricing': 'விலை',
      'join': 'காத்திருப்பு பட்டியலில் சேருங்கள்',
      'emergency': 'அவசரம்',
      'sos': 'SOS எச்சரிக்கை',
      'payment': 'கட்டணம்',
      'tracking': 'நேரடி கண்காணிப்பு',
      'profile': 'சுயவிவரம்',
      'settings': 'அமைப்புகள்',
      'logout': 'வெளியேறு',
      'book_now': 'இப்போது பதிவு செய்யுங்கள்',
      'contact': 'தொடர்பு கொள்ளுங்கள்',
      'about': 'எங்களை பற்றி',
      'search': 'தேடுக',
      'view_all': 'அனைத்தையும் காண்க',
      'no_results': 'முடிவுகள் எதுவும் இல்லை'
    }
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub కి స్వాగతం',
      'help': 'సహాయం కేవలం 1 ట్యాప్ దూరంలో',
      'services': 'సేవలు',
      'features': 'లక్షణాలు',
      'pricing': 'ధర',
      'join': 'వేచి జాబితాలో చేరండి',
      'emergency': 'అత్యవసరం',
      'sos': 'SOS అలర్ట్',
      'payment': 'చెల్లింపు',
      'tracking': 'లైవ్ ట్రాకింగ్',
      'profile': 'ప్రొఫైల్',
      'settings': 'సెట్టింగ్లు',
      'logout': 'లాగౌట్',
      'book_now': 'ఇప్పుడు బుక్ చేయండి',
      'contact': 'సంప్రదించండి',
      'about': 'మా గురించి',
      'search': 'వెతకండి',
      'view_all': 'అన్నీ చూడండి',
      'no_results': 'ఫలితాలు లేవు'
    }
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub ಗೆ ಸ್ವಾಗತ',
      'help': 'ಸಹಾಯ ಕೇವಲ 1 ಟ್ಯಾಪ್ ದೂರದಲ್ಲಿ',
      'services': 'ಸೇವೆಗಳು',
      'features': 'ವೈಶಿಷ್ಟ್ಯಗಳು',
      'pricing': 'ಬೆಲೆ',
      'join': 'ಕಾಯುವ ಪಟ್ಟಿಗೆ ಸೇರಿ',
      'emergency': 'ತುರ್ತು',
      'sos': 'SOS ಎಚ್ಚರಿಕೆ',
      'payment': 'ಪಾವತಿ',
      'tracking': 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
      'profile': 'ಪ್ರೊಫೈಲ್',
      'settings': 'ಸೆಟ್ಟಿಂಗ್ಗಳು',
      'logout': 'ಲಾಗೌಟ್',
      'book_now': 'ಈಗ ಬುಕ್ ಮಾಡಿ',
      'contact': 'ಸಂಪರ್ಕಿಸಿ',
      'about': 'ನಮ್ಮ ಬಗ್ಗೆ',
      'search': 'ಹುಡುಕಿ',
      'view_all': 'ಎಲ್ಲವನ್ನು ನೋಡಿ',
      'no_results': 'ಫಲಿತಾಂಶಗಳಿಲ್ಲ'
    }
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub ലേക്ക് സ്വാഗതം',
      'help': 'സഹായം 1 ടാപ്പ് അകലെ',
      'services': 'സേവനങ്ങൾ',
      'features': 'സവിശേഷതകൾ',
      'pricing': 'വില',
      'join': 'കാത്തിരിപ്പ് പട്ടികയിൽ ചേരുക',
      'emergency': 'അടിയന്തരം',
      'sos': 'SOS അലേർട്ട്',
      'payment': 'പേയ്മെന്റ്',
      'tracking': 'തത്സമയ ട്രാക്കിംഗ്',
      'profile': 'പ്രൊഫൈൽ',
      'settings': 'ക്രമീകരണങ്ങൾ',
      'logout': 'ലോഗൗട്ട്',
      'book_now': 'ഇപ്പോൾ ബുക്ക് ചെയ്യുക',
      'contact': 'ബന്ധപ്പെടുക',
      'about': 'ഞങ്ങളെ കുറിച്ച്',
      'search': 'തിരയുക',
      'view_all': 'എല്ലാം കാണുക',
      'no_results': 'ഫലങ്ങളൊന്നുമില്ല'
    }
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub এ স্বাগতম',
      'help': 'সাহায্য মাত্র 1 ট্যাপ দূরে',
      'services': 'সেবা',
      'features': 'বৈশিষ্ট্য',
      'pricing': 'মূল্য',
      'join': 'অপেক্ষা তালিকায় যোগ দিন',
      'emergency': 'জরুরি',
      'sos': 'SOS সতর্কতা',
      'payment': 'পেমেন্ট',
      'tracking': 'লাইভ ট্র্যাকিং',
      'profile': 'প্রোফাইল',
      'settings': 'সেটিংস',
      'logout': 'লগআউট',
      'book_now': 'এখনই বুক করুন',
      'contact': 'যোগাযোগ করুন',
      'about': 'আমাদের সম্পর্কে',
      'search': 'অনুসন্ধান',
      'view_all': 'সব দেখুন',
      'no_results': 'কোন ফলাফল পাওয়া যায়নি'
    }
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub માં આપનું સ્વાગત છે',
      'help': 'મદદ માત્ર 1 ટેપ દૂર છે',
      'services': 'સેવાઓ',
      'features': 'વિશેષતાઓ',
      'pricing': 'કિંમત',
      'join': 'રાહ જોવાની યાદીમાં જોડાઓ',
      'emergency': 'કટોકટી',
      'sos': 'SOS ચેતવણી',
      'payment': 'ચુકવણી',
      'tracking': 'લાઇવ ટ્રેકિંગ',
      'profile': 'પ્રોફાઇલ',
      'settings': 'સેટિંગ્સ',
      'logout': 'લોગઆઉટ',
      'book_now': 'હવે બુક કરો',
      'contact': 'સંપર્ક કરો',
      'about': 'અમારા વિશે',
      'search': 'શોધો',
      'view_all': 'બધુ જુઓ',
      'no_results': 'કોઈ પરિણામ મળ્યું નથી'
    }
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
      'help': 'ਮਦਦ ਸਿਰਫ 1 ਟੈਪ ਦੂਰ',
      'services': 'ਸੇਵਾਵਾਂ',
      'features': 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
      'pricing': 'ਕੀਮਤ',
      'join': 'ਉਡੀਕ ਸੂਚੀ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
      'emergency': 'ਐਮਰਜੈਂਸੀ',
      'sos': 'SOS ਚੇਤਾਵਨੀ',
      'payment': 'ਭੁਗਤਾਨ',
      'tracking': 'ਲਾਈਵ ਟਰੈਕਿੰਗ',
      'profile': 'ਪ੍ਰੋਫਾਈਲ',
      'settings': 'ਸੈਟਿੰਗਜ਼',
      'logout': 'ਲੌਗਆਊਟ',
      'book_now': 'ਹੁਣੇ ਬੁੱਕ ਕਰੋ',
      'contact': 'ਸੰਪਰਕ ਕਰੋ',
      'about': 'ਸਾਡੇ ਬਾਰੇ',
      'search': 'ਖੋਜੋ',
      'view_all': 'ਸਭ ਵੇਖੋ',
      'no_results': 'ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ'
    }
  },
  or: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub କୁ ସ୍ୱାଗତ',
      'help': 'ସାହାଯ୍ୟ କେବଳ 1 ଟ୍ୟାପ୍ ଦୂରରେ',
      'services': 'ସେବାଗୁଡିକ',
      'features': 'ବୈଶିଷ୍ଟ୍ୟ',
      'pricing': 'ମୂଲ୍ୟ',
      'join': 'ଅପେକ୍ଷା ତାଲିକାରେ ଯୋଗ ଦିଅନ୍ତୁ',
      'emergency': 'ଜରୁରୀ',
      'sos': 'SOS ସତର୍କତା',
      'payment': 'ଦେୟ',
      'tracking': 'ଲାଇଭ୍ ଟ୍ରାକିଂ',
      'profile': 'ପ୍ରୋଫାଇଲ୍',
      'settings': 'ସେଟିଂସ୍',
      'logout': 'ଲଗ୍ ଆଉଟ୍',
      'book_now': 'ବର୍ତ୍ତମାନ ବୁକ୍ କରନ୍ତୁ',
      'contact': 'ଯୋଗାଯୋଗ କରନ୍ତୁ',
      'about': 'ଆମ ବିଷୟରେ',
      'search': 'ଖୋଜନ୍ତୁ',
      'view_all': 'ସବୁ ଦେଖନ୍ତୁ',
      'no_results': 'କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ'
    }
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇮🇳',
    translations: {
      'welcome': 'EmergencyHub میں خوش آمدید',
      'help': 'مدد صرف 1 ٹیپ دور ہے',
      'services': 'خدمات',
      'features': 'خصوصیات',
      'pricing': 'قیمت',
      'join': 'ویٹ لسٹ میں شامل ہوں',
      'emergency': 'ہنگامی',
      'sos': 'SOS الرٹ',
      'payment': 'ادائیگی',
      'tracking': 'لائیو ٹریکنگ',
      'profile': 'پروفائل',
      'settings': 'ترتیبات',
      'logout': 'لاگ آؤٹ',
      'book_now': 'ابھی بک کریں',
      'contact': 'رابطہ کریں',
      'about': 'ہمارے بارے میں',
      'search': 'تلاش کریں',
      'view_all': 'سب دیکھیں',
      'no_results': 'کوئی نتیجہ نہیں ملا'
    }
  },
 // ============================================================
// ASSAMESE — FIXED VERSION
// ============================================================
as: {
  code: 'as',
  name: 'Assamese',
  nativeName: 'অসমীয়া',
  flag: '🇮🇳',
  translations: {
    'welcome': 'EmergencyHub লৈ স্বাগতম',
    'help': 'সহায় মাত্ৰ 1 টেপ দূৰত',
    'services': 'সেৱাসমূহ',
    'features': 'বৈশিষ্ট্যসমূহ',
    'pricing': 'মূল্য',
    'join': 'প্ৰতীক্ষা তালিকাত যোগদান কৰক',
    'emergency': 'জৰুৰীকালীন',
    'sos': 'SOS সতৰ্কবাণী',
    "payment": "পে'মেন্ট",
    'tracking': 'লাইভ ট্ৰেকিং',
    "profile": "প্ৰ'ফাইল",
    "settings": "চেটিংছ",
    'logout': 'লগআউট',
    'book_now': 'এতিয়া বুক কৰক',
    'contact': 'যোগাযোগ কৰক',
    'about': 'আমাৰ বিষয়ে',
    'search': 'সন্ধান কৰক',
    'view_all': 'সব চাওক',
    'no_results': 'কোনো ফলাফল পোৱা নগল'
  }
}
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getLanguage(code) {
  return languages[code] || languages['en'];
}

function isValidLanguage(code) {
  return Object.keys(languages).includes(code);
}

function getSupportedLanguages() {
  return Object.keys(languages).map(code => ({
    code: code,
    name: languages[code].name,
    nativeName: languages[code].nativeName,
    flag: languages[code].flag
  }));
}

function getTranslation(key, langCode) {
  const lang = getLanguage(langCode);
  return lang.translations[key] || key;
}

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  languages: languages,
  getLanguage: getLanguage,
  isValidLanguage: isValidLanguage,
  getSupportedLanguages: getSupportedLanguages,
  getTranslation: getTranslation
};