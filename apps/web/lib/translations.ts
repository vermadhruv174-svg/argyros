export type SupportedLanguage = 'en';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: 'EN' },
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
};
