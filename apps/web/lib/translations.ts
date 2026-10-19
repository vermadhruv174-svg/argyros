export type SupportedLanguage = 'en' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: 'हिं' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Announcements
    'announcement.free_shipping': 'COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹2,999',
    'announcement.purity': '925 STERLING SILVER',
    'announcement.heritage': 'HOUSE OF SIDDHI JEWELLERS · HALDWANI',
    'announcement.packaging': 'GIFT-READY PACKAGING ON EVERY ORDER',
    'announcement.made_to_order': 'SCULPTURAL STERLING SILVER · MADE TO ORDER',

    // Navigation
    'nav.shop': 'Shop',
    'nav.collections': 'Collections',
    'nav.gifts': 'Gifts',
    'nav.bespoke': '✦ Bespoke',
    'nav.heritage': 'Our Heritage',
    'nav.search': 'Search',
    'nav.account': 'Account',
    'nav.bag': 'Bag',
    'nav.all_pieces': 'Shop All Pieces',
    'nav.rings': 'Rings',
    'nav.earrings': 'Earrings',
    'nav.necklaces': 'Necklaces',
    'nav.bracelets': 'Bracelets & Cuffs',

    // Brand & General
    'brand.tagline': 'Sculptural sterling silver, made to order.',
    'brand.subtagline': 'Designed to be worn daily and kept for generations.',
    'brand.provenance': 'Haldwani, Nainital District, Uttarakhand',
    'brand.atelier_name': 'House of Siddhi Jewellers Atelier',

    // Common CTAs & Actions
    'action.explore_collection': 'Explore Collection',
    'action.shop_first_edition': 'Shop the First Edition',
    'action.explore_collections': 'Explore Collections',
    'action.view_piece': 'Inspect Piece',
    'action.add_to_bag': 'Add to Selection Bag',
    'action.proceed_to_checkout': 'Proceed to Atelier Checkout',
    'action.continue_shopping': 'Continue Browsing Collection',
    'action.whatsapp_concierge': 'WhatsApp Atelier Concierge',
    'action.open_search': 'Search pieces, collections, rings...',

    // Trust Pillars
    'trust.purity_title': '100% Solid 925 Sterling Silver',
    'trust.purity_desc': '92.5% pure silver with 7.5% structural copper. Zero nickel, zero lead.',
    'trust.karigar_title': 'Haldwani Master Karigars',
    'trust.karigar_desc': 'Crafted in Uttarakhand by third-generation generational artisans.',
    'trust.exchange_title': '15-Day Size Exchange',
    'trust.exchange_desc': 'Complimentary pickup & re-sizing for an exact, comfortable fit.',
    'trust.shipping_title': 'Insured White-Glove Transit',
    'trust.shipping_desc': 'Discreet tamper-evident packaging with OTP-verified handover.',

    // Collection Worlds
    'world.universe': 'The Argyros Universe',
    'world.active_editions': 'Active Collection Worlds',
    'world.travel': 'Travel to Another World',
    'world.first_edition_badge': 'WORLD 01 · CELESTIAL SOLSTICE',
    'world.first_edition_tagline': 'Where pure architectural geometry meets generational silver',
    'world.pahadi_badge': 'WORLD 02 · KUMAON PINE RIDGES',
    'world.pahadi_tagline': 'Mountain-born motifs refined from ancient Himalayan ornaments',
    'world.daily_badge': 'WORLD 03 · THE SUNLIT BENCH',
    'world.daily_tagline': 'Tactile silver essentials sculpted for daily intimacy',
    'world.premium_badge': 'WORLD 04 · THE OBSIDIAN VAULT',
    'world.premium_tagline': 'Substantial silver weight with uncompromising monolithic presence',
    'world.gifts_badge': 'WORLD 05 · THE HEIRLOOM KEEPSAKE',
    'world.gifts_tagline': 'Precious made-to-order gifts that never compromise on craft',
    'world.oxidised_badge': 'WORLD 06 · THE SMOKED ANVIL',
    'world.oxidised_tagline': 'The timeless character of darkened patina against mirror relief',

    // Cart & Checkout
    'checkout.client_registry': 'Client & Courier Registry',
    'checkout.atelier_settlement': 'Private Atelier Settlement',
    'checkout.bench_allocation': 'Haldwani Workshop Bench #2 Active Allocation',
    'checkout.authorize_button': 'Authorize Atelier Commission',
    'checkout.deed_issued': 'Atelier Deed of Authenticity Issued',
  },
  hi: {
    // Announcements
    'announcement.free_shipping': '₹2,999 से अधिक के ऑर्डर पर निःशुल्क बीमाकृत डिलीवरी',
    'announcement.purity': '925 शुद्ध स्टर्लिंग चांदी',
    'announcement.heritage': 'हाउस ऑफ सिद्धि ज्वेलर्स · हल्द्वानी, उत्तराखण्ड',
    'announcement.packaging': 'प्रत्येक ऑर्डर पर उपहार-योग्य रीगिड बॉक्स पैकेजिंग',
    'announcement.made_to_order': 'मूर्तिकला स्टर्लिंग चांदी · आदेश पर निर्मित',

    // Navigation
    'nav.shop': 'शॉप',
    'nav.collections': 'कलेक्शन्स',
    'nav.gifts': 'उपहार',
    'nav.bespoke': '✦ कस्टम शिल्प',
    'nav.heritage': 'हमारी धरोहर',
    'nav.search': 'खोजें',
    'nav.account': 'खाता',
    'nav.bag': 'बैग',
    'nav.all_pieces': 'सभी आभूषण →',
    'nav.rings': 'अंगूठियां (Rings)',
    'nav.earrings': 'कर्णफूल (Earrings)',
    'nav.necklaces': 'कंठहार (Necklaces)',
    'nav.bracelets': 'कड़े व कंगन (Cuffs)',

    // Brand & General
    'brand.tagline': 'मूर्तिकला स्टर्लिंग चांदी, विशेष रूप से आपके लिए निर्मित।',
    'brand.subtagline': 'प्रतिदिन पहनने और पीढ़ियों तक सहेजने के लिए गढ़ा गया शिल्प।',
    'brand.provenance': 'हल्द्वानी, नैनीताल जनपद, उत्तराखण्ड',
    'brand.atelier_name': 'हाउस ऑफ सिद्धि ज्वेलर्स कार्यशाला',

    // Common CTAs & Actions
    'action.explore_collection': 'कलेक्शन देखें',
    'action.shop_first_edition': 'प्रथम संस्करण देखें',
    'action.explore_collections': 'सभी कलेक्शन्स देखें',
    'action.view_piece': 'आभूषण देखें',
    'action.add_to_bag': 'बैग में जोड़ें',
    'action.proceed_to_checkout': 'कार्यशाला चेकआउट करें',
    'action.continue_shopping': 'अन्य आभूषण देखें',
    'action.whatsapp_concierge': 'व्हाट्सएप कारीगर सहायता',
    'action.open_search': 'आभूषण, अंगूठियां, कलेक्शन्स खोजें...',

    // Trust Pillars
    'trust.purity_title': '100% शुद्ध 925 स्टर्लिंग चांदी',
    'trust.purity_desc': '92.5% शुद्ध चांदी और 7.5% तांबा मिश्रण। निकल व सीसा मुक्त।',
    'trust.karigar_title': 'हल्द्वानी के सिद्धहस्त कारीगर',
    'trust.karigar_desc': 'उत्तराखण्ड में तीन पीढ़ियों के अनुभवी स्वर्णकारों द्वारा हस्तनिर्मित।',
    'trust.exchange_title': '15 दिनों में निःशुल्क साइज एक्सचेंज',
    'trust.exchange_desc': 'सही और आरामदायक फिट के लिए घर से निःशुल्क पिकअप व री-साइजिंग।',
    'trust.shipping_title': 'सुरक्षित बीमाकृत डिलीवरी',
    'trust.shipping_desc': 'ओटीपी-सत्यापित सुरक्षित डिलीवरी व सीलबंद पैकेजिंग।',

    // Collection Worlds
    'world.universe': 'आर्जिरोस संसार',
    'world.active_editions': 'सक्रिय कलेक्शन्स व संसार',
    'world.travel': 'अन्य संसार में प्रवेश करें',
    'world.first_edition_badge': 'संसार 01 · सौर संक्रांति व वास्तुशिल्प',
    'world.first_edition_tagline': 'जहाँ शुद्ध वास्तुशिल्प ज्यामिति पीढ़ियों की चांदी से मिलती है',
    'world.pahadi_badge': 'WORLD 02 · कुमाऊं की देवदार पर्वतमाला',
    'world.pahadi_tagline': 'हिमालयी पर्वत श्रृंखलाओं व पारम्परिक आभूषणों से प्रेरित रजत शिल्प',
    'world.daily_badge': 'WORLD 03 · धूप खिली कार्यशाला',
    'world.daily_tagline': 'दैनिक जीवन में सहज स्पर्श और सुरुचि के लिए गढ़े गए आभूषण',
    'world.premium_badge': 'WORLD 04 · राजसी तिजोरी व वजनदार रजत',
    'world.premium_tagline': 'ठोस चांदी का वजनदार वैभव और अविस्मरणीय राजसी उपस्थिति',
    'world.gifts_badge': 'WORLD 05 · अनमोल स्मृति उपहार',
    'world.gifts_tagline': 'सच्चे शिल्प से तैयार किए गए अविस्मरणीय उपहार',
    'world.oxidised_badge': 'WORLD 06 · धूमिल पाटन व अग्नि-शिल्प',
    'world.oxidised_tagline': 'काले पाटन और चमकदार चांदी का शाश्वत विरोधाभास',

    // Cart & Checkout
    'checkout.client_registry': 'ग्राहक विवरण व पता',
    'checkout.atelier_settlement': 'कार्यशाला भुगतान व कारीगर आवंटन',
    'checkout.bench_allocation': 'हल्द्वानी कार्यशाला बेंच #2 सक्रिय आवंटन',
    'checkout.authorize_button': 'आभूषण निर्माण अधिकृत करें',
    'checkout.deed_issued': 'आधिकारिक प्रामाणिकता पत्र जारी',
  },
};
