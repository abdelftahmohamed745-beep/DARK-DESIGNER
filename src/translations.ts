export interface TranslationSet {
  // Navigation
  browse: string;
  studio: string;
  verifiedPublisher: string;
  studioOwner: string;

  // Hero Section
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;

  // Filters & Search
  searchPlaceholder: string;
  sortLabel: string;
  sortNewest: string;
  sortLikes: string;
  sortViews: string;
  clear: string;
  noDesignsFound: string;
  noDesignsSub: string;
  resetFilters: string;

  // Design Details Modal
  staffPick: string;
  customQuote: string;
  licensingCost: string;
  customQuoteCommission: string;
  digitalLicense: string;
  licenseTerms: string;
  inquiryTitle: string;
  purchaseTitle: string;
  formName: string;
  formEmail: string;
  formCompany: string;
  formBudget: string;
  formMessage: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  submitInquiry: string;
  submitPurchase: string;
  successTitle: string;
  successSub: string;
  successBody: string;
  closeGallery: string;
  takeDownAsset: string;
  views: string;
  likes: string;
  created: string;
  category: string;
  tags: string;
  licenseAsset: string;
  inquireCustom: string;

  // Studio Welcome Card
  studioWelcomeTitle: string;
  studioWelcomeSub: string;
  publishAssetBtn: string;
  portfolioTab: string;
  publishTab: string;
  inquiriesTab: string;
  emptyPortfolio: string;
  emptyPortfolioSub: string;
  publishFirstAsset: string;

  // Upload Form
  publishNewTitle: string;
  uploadDragDrop: string;
  uploadSupports: string;
  formAssetTitle: string;
  formDesc: string;
  formCategory: string;
  formPrice: string;
  formPriceNote: string;
  formQuotesOption: string;
  formQuotesNote: string;
  formTags: string;
  formTagsNote: string;
  publishToMarketplace: string;

  // Inquiries List
  inquiriesPipeline: string;
  selectToReply: string;
  noInquiriesTitle: string;
  noInquiriesSub: string;
  budgetLabel: string;
  newLeadBadge: string;
  reviewedBadge: string;
  respondedBadge: string;
  markReviewed: string;
  markResponded: string;
  archiveRequest: string;
  replyToClient: string;
  writingReply: string;
  sendReplyBtn: string;
  replySuccess: string;
  inquiryDetailsTitle: string;
  clientMessage: string;
  clientBudget: string;
  clientEmail: string;
  clientCompany: string;

  // Footer & Settings
  footerTitle: string;
  footerSub: string;
  verifiedEnvironment: string;
  monochromeActive: string;
  themeDark: string;
  themeLight: string;
  languageEn: string;
  languageAr: string;
  themeLabel: string;
  languageLabel: string;
}

export const translations: Record<'en' | 'ar', TranslationSet> = {
  en: {
    browse: 'Browse',
    studio: 'Studio',
    verifiedPublisher: 'Verified Publisher',
    studioOwner: 'You (Studio Owner)',
    heroBadge: 'Elite Handcrafted Digital Assets',
    heroHeading: 'ASTA DESIGN WEB',
    heroSubheading: 'A high-end minimalist directory and licensing platform for world-class interactive layouts, assets, and packaging concepts. Acquire premium templates or pitch bespoke commissions.',
    searchPlaceholder: 'Search designs, category keywords, assets or software tags...',
    sortLabel: 'Sort',
    sortNewest: 'Newest Releases',
    sortLikes: 'Most Appreciated',
    sortViews: 'Most Viewed',
    clear: 'Clear',
    noDesignsFound: 'No matching designs found',
    noDesignsSub: "We couldn't find anything matching your search filters. Try adjusting your tags or changing the active category.",
    resetFilters: 'Reset Active Filters',
    staffPick: 'Staff Pick',
    customQuote: 'Custom Quote',
    licensingCost: 'Licensing Cost',
    customQuoteCommission: 'Accepting custom commissions based on this concept',
    digitalLicense: 'Digital Asset License',
    licenseTerms: 'Includes lifetime commercial usage rights, full high-resolution source file package, and free version updates.',
    inquiryTitle: 'Inquire About Custom Commission',
    purchaseTitle: 'Secure Checkout & Licensing',
    formName: 'Your Full Name',
    formEmail: 'Email Address',
    formCompany: 'Company Name (Optional)',
    formBudget: 'Project Budget',
    formMessage: 'Brief message or specifications...',
    cardNumber: 'Credit Card Number',
    cardExpiry: 'Expiry Date',
    cardCvc: 'CVC Code',
    submitInquiry: 'Send Inquiry Offer',
    submitPurchase: 'Acquire License & Download',
    successTitle: 'Thank You!',
    successSub: 'Your request has been successfully processed.',
    successBody: 'The designer has been notified and will contact you shortly at your provided email address.',
    closeGallery: 'Return to Gallery',
    takeDownAsset: 'Take down asset from studio',
    views: 'Views',
    likes: 'Likes',
    created: 'Created',
    category: 'Category',
    tags: 'Tags',
    licenseAsset: 'License Asset',
    inquireCustom: 'Inquire custom project',
    studioWelcomeTitle: 'Welcome to your Design Studio',
    studioWelcomeSub: 'Publish your creations, showcase work portfolios, manage licensing costs, and respond directly to incoming corporate contract inquiries.',
    publishAssetBtn: 'Publish Asset',
    portfolioTab: 'My Portfolio',
    publishTab: 'Publish Work',
    inquiriesTab: 'Inquiries Pipeline',
    emptyPortfolio: "You haven't published any designs yet",
    emptyPortfolioSub: 'Start publishing your works! Upload high-quality screenshots and define licensing tags to attract buyers.',
    publishFirstAsset: 'Publish your first asset',
    publishNewTitle: 'Publish a New Digital Asset',
    uploadDragDrop: 'Drag and drop high-res image here, or click to browse',
    uploadSupports: 'Supports PNG, JPG or WEBP up to 8MB',
    formAssetTitle: 'Design Asset Title',
    formDesc: 'Project Description',
    formCategory: 'Primary Category',
    formPrice: 'Licensing Price (USD)',
    formPriceNote: 'Leave empty to make this work custom-quote only',
    formQuotesOption: 'Allow Custom Quotes & Commissions',
    formQuotesNote: 'Enables clients to pitch custom freelance projects based on this aesthetic style',
    formTags: 'Search Tags (comma separated)',
    formTagsNote: 'e.g., figma, dark-theme, minimal, 3d',
    publishToMarketplace: 'Publish to Marketplace',
    inquiriesPipeline: 'Inquiries Pipeline',
    selectToReply: 'Select card to reply',
    noInquiriesTitle: 'No client requests yet',
    noInquiriesSub: 'Your inquiries pipeline is empty. Published designs with licensing costs will attract custom requests here.',
    budgetLabel: 'Budget',
    newLeadBadge: 'New Lead',
    reviewedBadge: 'Reviewed',
    respondedBadge: 'Responded',
    markReviewed: 'Mark Reviewed',
    markResponded: 'Mark Responded',
    archiveRequest: 'Archive Request',
    replyToClient: 'Reply to Client',
    writingReply: 'Writing your message...',
    sendReplyBtn: 'Send Message Response',
    replySuccess: 'Reply Sent Successfully!',
    inquiryDetailsTitle: 'Inquiry Details',
    clientMessage: 'Client Message',
    clientBudget: 'Proposed Budget / License Fee',
    clientEmail: 'Contact Email',
    clientCompany: 'Client Organization',
    footerTitle: 'ASTA DESIGN WEB',
    footerSub: 'Licensed asset publishing hub & digital architecture showcase',
    verifiedEnvironment: 'Verified Environment',
    monochromeActive: 'Bilingual aesthetic active',
    themeDark: 'Dark Mode 🌙',
    themeLight: 'Light Mode ☀️',
    languageEn: 'English 🇺🇸',
    languageAr: 'العربية 🇸🇦',
    themeLabel: 'Theme',
    languageLabel: 'Language',
  },
  ar: {
    browse: 'تصفح',
    studio: 'الاستوديو',
    verifiedPublisher: 'ناشر معتمد',
    studioOwner: 'أنت (مالك الاستوديو)',
    heroBadge: 'أصول رقمية مميزة ومصنوعة يدوياً',
    heroHeading: 'ASTA DESIGN WEB',
    heroSubheading: 'منصة راقية ومبسطة لعرض وترخيص المخططات التفاعلية، الأصول، ومفاهيم التغليف العالمية. احصل على قوالب مميزة أو اطلب مشاريع مخصصة.',
    searchPlaceholder: 'ابحث عن التصاميم، الكلمات المفتاحية، الأصول أو البرامج...',
    sortLabel: 'ترتيب',
    sortNewest: 'أحدث الإصدارات',
    sortLikes: 'الأكثر إعجاباً',
    sortViews: 'الأكثر مشاهدة',
    clear: 'مسح',
    noDesignsFound: 'لم يتم العثور على أي تصاميم مطابقة',
    noDesignsSub: 'لم نتمكن من العثور على أي شيء يطابق فلاتر البحث الخاصة بك. جرب تعديل الوسوم أو تغيير الفئة النشطة.',
    resetFilters: 'إعادة ضبط الفلاتر النشطة',
    staffPick: 'اختيار المحرر',
    customQuote: 'طلب تسعير خاص',
    licensingCost: 'تكلفة الترخيص',
    customQuoteCommission: 'قبول الطلبات المخصصة بناءً على هذا المفهوم',
    digitalLicense: 'رخصة الأصول الرقمية',
    licenseTerms: 'تشمل حقوق الاستخدام التجاري مدى الحياة، وحزمة الملفات المصدرية عالية الدقة، وتحديثات مجانية.',
    inquiryTitle: 'الاستفسار عن طلب مخصص',
    purchaseTitle: 'الدفع الآمن والترخيص',
    formName: 'الاسم الكامل',
    formEmail: 'البريد الإلكتروني',
    formCompany: 'اسم الشركة (اختياري)',
    formBudget: 'ميزانية المشروع',
    formMessage: 'رسالة موجزة أو المواصفات...',
    cardNumber: 'رقم البطاقة الائتمانية',
    cardExpiry: 'تاريخ الانتهاء',
    cardCvc: 'رمز الأمان CVC',
    submitInquiry: 'إرسال طلب الاستفسار',
    submitPurchase: 'الحصول على الترخيص والتحميل',
    successTitle: 'شكراً لك!',
    successSub: 'تمت معالجة طلبك بنجاح.',
    successBody: 'تم إخطار المصمم وسيتصل بك قريباً على عنوان بريدك الإلكتروني المدخل.',
    closeGallery: 'العودة للمعرض',
    takeDownAsset: 'إلغاء نشر الأصل من الاستوديو',
    views: 'مشاهدات',
    likes: 'إعجابات',
    created: 'تاريخ الإنشاء',
    category: 'الفئة',
    tags: 'الوسوم',
    licenseAsset: 'ترخيص العمل',
    inquireCustom: 'طلب مشروع خاص',
    studioWelcomeTitle: 'أهلاً بك في استوديو التصميم الخاص بك',
    studioWelcomeSub: 'قم بنشر إبداعاتك، وعرض محفظة أعمالك، وإدارة تكاليف التراخيص، والرد مباشرة على طلبات العقود والعملاء الواردة.',
    publishAssetBtn: 'نشر عمل جديد',
    portfolioTab: 'أعمالي',
    publishTab: 'نشر عمل',
    inquiriesTab: 'طلبات العملاء',
    emptyPortfolio: 'لم تقم بنشر أي تصاميم بعد',
    emptyPortfolioSub: 'ابدأ بنشر أعمالك! قم بتحميل لقطات شاشة عالية الجودة وحدد وسوم التراخيص لجذب المشترين.',
    publishFirstAsset: 'انشر عملك الأول',
    publishNewTitle: 'نشر أصل رقمي جديد',
    uploadDragDrop: 'اسحب وأسقط صورة عالية الدقة هنا، أو انقر للتصفح',
    uploadSupports: 'يدعم صيغ PNG أو JPG أو WEBP حتى 8 ميجابايت',
    formAssetTitle: 'عنوان العمل الرقمي',
    formDesc: 'وصف المشروع',
    formCategory: 'الفئة الرئيسية',
    formPrice: 'سعر الترخيص (دولار أمريكي)',
    formPriceNote: 'اتركه فارغاً ليكون العمل متاحاً عن طريق طلب تسعير خاص فقط',
    formQuotesOption: 'السماح بالطلبات المخصصة والتسعير الخاص',
    formQuotesNote: 'تمكين العملاء من تقديم عروض لمشاريع عمل حر مخصصة بناءً على هذا الأسلوب الجمالي',
    formTags: 'وسوم البحث (مفصولة بفاصلة)',
    formTagsNote: 'مثال: figma, dark-theme, minimal, 3d',
    publishToMarketplace: 'انشر في السوق',
    inquiriesPipeline: 'طلبات العملاء',
    selectToReply: 'اختر طلباً للرد عليه',
    noInquiriesTitle: 'لا توجد طلبات عملاء حالياً',
    noInquiriesSub: 'عندما يطلب عملاء الشركات تصاميم مخصصة أو يشترون تراخيص، ستظهر مراسلاتهم هنا.',
    budgetLabel: 'الميزانية',
    newLeadBadge: 'جديد',
    reviewedBadge: 'تمت المراجعة',
    respondedBadge: 'تم الرد',
    markReviewed: 'تحديد كمقروء/مراجع',
    markResponded: 'تحديد كمرود عليه',
    archiveRequest: 'أرشفة الطلب',
    replyToClient: 'الرد على العميل',
    writingReply: 'اكتب رسالتك هنا...',
    sendReplyBtn: 'إرسال الرد للعميل',
    replySuccess: 'تم إرسال الرد بنجاح!',
    inquiryDetailsTitle: 'تفاصيل الطلب',
    clientMessage: 'رسالة العميل',
    clientBudget: 'الميزانية المقترحة / رسوم الترخيص',
    clientEmail: 'البريد الإلكتروني للتواصل',
    clientCompany: 'منظمة العميل',
    footerTitle: 'ASTA DESIGN WEB',
    footerSub: 'منصة نشر الأصول المرخصة ومعرض التصاميم الرقمية الراقية',
    verifiedEnvironment: 'بيئة معتمدة',
    monochromeActive: 'الجمالية ثنائية اللغة نشطة',
    themeDark: 'الوضع الداكن 🌙',
    themeLight: 'الوضع الفاتح ☀️',
    languageEn: 'English 🇺🇸',
    languageAr: 'العربية 🇸🇦',
    themeLabel: 'المظهر',
    languageLabel: 'اللغة',
  }
};

export const getCategoryName = (category: string, lang: 'en' | 'ar'): string => {
  if (lang === 'en') return category;
  const mapping: Record<string, string> = {
    'All': 'الكل',
    'UI/UX Design': 'تصميم واجهات المستخدم',
    'Graphic Design': 'التصميم الجرافيكي',
    '3D Art': 'فن ثلاثي الأبعاد',
    'Brand Identity': 'الهوية البصرية',
    'Illustration': 'الرسم والتوضيح',
    'Motion Graphics': 'الرسوم المتحركة'
  };
  return mapping[category] || category;
};
