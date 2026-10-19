export interface CollectionWorldTheme {
  slug: string;
  worldNumber: string;
  worldTitle: string;
  worldTitleHi: string;
  tagline: string;
  taglineHi: string;
  storyParagraph: string;
  storyParagraphHi: string;
  heroImage: string;
  bgGradient: string;
  cardGradient: string;
  gridBg: string;
  accentColor: string;
  accentBorder: string;
  ambientGlow: string;
  badgeBg: string;
  badgeText: string;
  materialSignature: string;
  karigarTechnique: string;
  provenanceNote: string;
}

export const COLLECTION_WORLDS: Record<string, CollectionWorldTheme> = {
  'the-first-edition': {
    slug: 'the-first-edition',
    worldNumber: '01',
    worldTitle: 'The Celestial Solstice',
    worldTitleHi: 'सौर संक्रांति व वास्तुशिल्प',
    tagline: 'Where pure architectural geometry meets generational silver.',
    taglineHi: 'जहाँ शुद्ध वास्तुशिल्प ज्यामिति पीढ़ियों की चांदी से मिलती है।',
    storyParagraph:
      'The foundational universe of Argyros. Fifteen monolithic silhouettes engineered with sharp mirror-bevelled edges and ergonomic interior curves, capturing the stark balance of light and shadow at celestial dawn.',
    storyParagraphHi:
      'आर्जिरोस का आधारभूत संसार। पंद्रह मूर्तिकला आभूषण, जिन्हें तीक्ष्ण दर्पण-पॉलिश किनारों और आंतरिक सहजता के साथ ढाला गया है—प्रभात के प्रकाश और छाया का जीवंत संतुलन।',
    heroImage: '/images/jewellery-hero.jpg',
    bgGradient: 'from-[#07101e] via-[#0b1a30] to-[#07101e]',
    cardGradient: 'from-[#0a1628] to-[#060e1c]',
    gridBg: 'bg-[#FAF8F5]',
    accentColor: '#C5A028',
    accentBorder: 'border-gold/30',
    ambientGlow: 'rgba(197, 160, 40, 0.18)',
    badgeBg: 'bg-gold/15',
    badgeText: 'text-gold',
    materialSignature: 'Solid 925 Sterling · High-Mirror Facets & Bevelled Shanks',
    karigarTechnique: 'Lost-Wax Induction Casting · Hand Needle Filing · 3-Stage Diamond Polish',
    provenanceNote: 'House of Siddhi Jewellers · Haldwani Atelier',
  },

  'pahadi-edit': {
    slug: 'pahadi-edit',
    worldNumber: '02',
    worldTitle: 'Kumaon Pine Ridges',
    worldTitleHi: 'कुमाऊं की देवदार पर्वतमाला',
    tagline: 'Mountain-born motifs refined from ancient Himalayan ornaments.',
    taglineHi: 'हिमालयी पर्वत श्रृंखलाओं व पारम्परिक आभूषणों से प्रेरित रजत शिल्प।',
    storyParagraph:
      'Born from the mist-covered pine valleys of Nainital and Almora. Heavy repoussé silver, ridged torques, and architectural peaks forged in homage to the towering snowcapped Trishul crests of Uttarakhand.',
    storyParagraphHi:
      'नैनीताल और अल्मोड़ा की धुंध भरी देवदार घाटियों से जन्मा संसार। भारी रजत कड़े और पहाड़ी आभूषण, जो उत्तराखण्ड की त्रिशूल चोटियों के पावन गौरव को समर्पित हैं।',
    heroImage: '/images/uttarakhand-sunrise.jpg',
    bgGradient: 'from-[#071711] via-[#10271e] to-[#071711]',
    cardGradient: 'from-[#091b14] to-[#05110d]',
    gridBg: 'bg-[#F5F8F6]',
    accentColor: '#4E9E78',
    accentBorder: 'border-emerald-600/40',
    ambientGlow: 'rgba(78, 158, 120, 0.22)',
    badgeBg: 'bg-emerald-950/80',
    badgeText: 'text-emerald-300',
    materialSignature: 'Solid 925 Silver · Hand-Beaten Chiseled Contours · Heavy Torque Gauge',
    karigarTechnique: 'Traditional Himalayan Repoussé · Hand Chasing · Satin Pine Finish',
    provenanceNote: 'Himalayan Ridge Footprints · Kumaon Division, Uttarakhand',
  },

  'daily-luxe': {
    slug: 'daily-luxe',
    worldNumber: '03',
    worldTitle: 'The Sunlit Atelier',
    worldTitleHi: 'धूप खिली कार्यशाला व सहज विलासिता',
    tagline: 'Tactile silver essentials sculpted for daily intimacy.',
    taglineHi: 'दैनिक जीवन में सहज स्पर्श और सुरुचि के लिए गढ़े गए आभूषण।',
    storyParagraph:
      'Pure quiet luxury. Lightweight yet substantial solid silver essentials calibrated to catch morning daylight on linen cuffs and open collars. Pieces that become an effortless second skin.',
    storyParagraphHi:
      'शांत विलासिता का स्वरूप। हल्के मगर ठोस चांदी के आभूषण, जो सुबह की धूप में चमक बिखेरते हैं और आपके व्यक्तित्व का सहज अंग बन जाते हैं।',
    heroImage: '/images/collections-hero.jpg',
    bgGradient: 'from-[#1a1714] via-[#2a241f] to-[#1a1714]',
    cardGradient: 'from-[#1f1b17] to-[#13110e]',
    gridBg: 'bg-[#FAF8F5]',
    accentColor: '#D4AF37',
    accentBorder: 'border-amber-500/30',
    ambientGlow: 'rgba(212, 175, 55, 0.18)',
    badgeBg: 'bg-amber-900/30',
    badgeText: 'text-amber-300',
    materialSignature: 'Solid 925 Sterling · Rounded Ergonomic Interior Comfort Tapers',
    karigarTechnique: 'Micro-Seamless Solder Joints · Velvet Satin Face & Burnished Edges',
    provenanceNote: 'Atelier Morning Shift · Bench Sizing IN 10 through IN 18',
  },

  'premium-reserve': {
    slug: 'premium-reserve',
    worldNumber: '04',
    worldTitle: 'The Obsidian Vault',
    worldTitleHi: 'राजसी तिजोरी व वजनदार रजत',
    tagline: 'Substantial silver weight. Uncompromising monolithic presence.',
    taglineHi: 'ठोस चांदी का वजनदार वैभव और अविस्मरणीय राजसी उपस्थिति।',
    storyParagraph:
      'Reserved for statement pieces of uncompromising presence. Massive solid silver signets, hand-linked collars, and heavy cuff bracelets weighing up to 45 grams of pure hallmarked silver.',
    storyParagraphHi:
      'विशिष्ट आभूषणों का राजसी संग्रह। 45 ग्राम तक की ठोस 925 चांदी से गढ़े गए भारी कड़े, चौड़े सिगनेट रिंग्स और भारी चेनें, जो आभूषण की अमिट पहचान बनाती हैं।',
    heroImage: '/images/karigar-workshop.jpg',
    bgGradient: 'from-[#03070f] via-[#081224] to-[#03070f]',
    cardGradient: 'from-[#060d1b] to-[#02050b]',
    gridBg: 'bg-[#F6F7FA]',
    accentColor: '#E5C365',
    accentBorder: 'border-gold/40',
    ambientGlow: 'rgba(229, 195, 101, 0.25)',
    badgeBg: 'bg-[#0a1832]',
    badgeText: 'text-gold',
    materialSignature: 'High-Gram Solid 925 Sterling · Monolithic Ingot Gauge (15g–45g)',
    karigarTechnique: 'Heavy Centrifugal Casting · Micro-Millgrain Inscriptions · Ultrasonic Mirror Polish',
    provenanceNote: 'Master Silversmith Bench #1 · House of Siddhi Jewellers',
  },

  'gifts-under-3000': {
    slug: 'gifts-under-3000',
    worldNumber: '05',
    worldTitle: 'The Heirloom Keepsake',
    worldTitleHi: 'अनमोल स्मृति उपहार',
    tagline: 'Precious made-to-order gifts that never compromise on craft.',
    taglineHi: 'सच्चे शिल्प से तैयार किए गए अविस्मरणीय उपहार।',
    storyParagraph:
      'Thoughtfully curated silver pieces crafted for milestone moments and treasured gestures. Each piece arrives nestled in our midnight velvet cassette with an individual Certificate of Authenticity.',
    storyParagraphHi:
      'जीवन के विशेष क्षणों और अपनों के लिए प्रेमपूर्ण उपहार। प्रत्येक आभूषण आर्जिरोस के रीगिड वेलवेट बॉक्स और प्रामाणिकता पत्र के साथ सुसज्जित होकर पहुँचता है।',
    heroImage: '/images/collections-hero.jpg',
    bgGradient: 'from-[#160c1c] via-[#25132e] to-[#160c1c]',
    cardGradient: 'from-[#1c0f24] to-[#100815]',
    gridBg: 'bg-[#FAF7F9]',
    accentColor: '#C89D7C',
    accentBorder: 'border-rose-400/30',
    ambientGlow: 'rgba(200, 157, 124, 0.20)',
    badgeBg: 'bg-purple-950/70',
    badgeText: 'text-rose-200',
    materialSignature: 'Solid 925 Sterling · Signature Keepsake Cassette & Microfiber Suede Pouch',
    karigarTechnique: 'Fine Diamond-Cut Link Sizing · Precision Butterfly Enclosures',
    provenanceNote: 'Gift-Ready Assembly · Handwritten Inscription Available',
  },

  'oxidised': {
    slug: 'oxidised',
    worldNumber: '06',
    worldTitle: 'The Smoked Anvil',
    worldTitleHi: 'धूमिल पाटन व अग्नि-शिल्प',
    tagline: 'The timeless character of darkened patina against mirror relief.',
    taglineHi: 'काले पाटन और चमकदार चांदी का शाश्वत विरोधाभास।',
    storyParagraph:
      'A study in chiaroscuro. Raw sterling silver treated with traditional liver-of-sulphur smoke to create an antique blackened patina in deep crevices, highlighting hand-chiseled relief with dramatic depth.',
    storyParagraphHi:
      'काले और उज्ज्वल का सम्मोहन। सल्फर धुएं से गहरी रेखाओं में गहरा पाटन और उभरे हुए हिस्सों पर चमकदार चांदी का अद्भुत कलात्मक खेल।',
    heroImage: '/images/karigar-workshop.jpg',
    bgGradient: 'from-[#09090b] via-[#141418] to-[#09090b]',
    cardGradient: 'from-[#101014] to-[#070708]',
    gridBg: 'bg-[#F5F5F7]',
    accentColor: '#9CA3AF',
    accentBorder: 'border-neutral-600/40',
    ambientGlow: 'rgba(156, 163, 175, 0.20)',
    badgeBg: 'bg-neutral-900',
    badgeText: 'text-neutral-300',
    materialSignature: 'Solid 925 Silver · Antique Oxidised Blackening · High-Relief Chiaroscuro',
    karigarTechnique: 'Controlled Chemical Patination · Selective Felt Buffing · Relief Burnishing',
    provenanceNote: 'Artisanal Patina Station · Haldwani Foundry',
  },
};

export function getCollectionWorld(slug: string): CollectionWorldTheme {
  return COLLECTION_WORLDS[slug] || COLLECTION_WORLDS['the-first-edition'];
}
