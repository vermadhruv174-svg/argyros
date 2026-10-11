import type { ProductDetailData, ProductSummary } from '@/types/catalogue';

export interface CollectionData {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: string;
  kind: 'editorial' | 'rule';
  isFeatured: boolean;
  isPublished: boolean;
  showComingSoon: boolean;
  displayOrder: number;
  productCount: number;
  imageUrl?: string | null;
}

const ringSizes = [10, 11, 12, 13, 14, 15, 16, 17, 18].map((size) => {
  const diameter = (15.7 + 0.4 * (size - 10)).toFixed(1);
  return {
    size: `IN ${size}`,
    title: `Indian Size ${size} (${diameter}mm)`,
    diameterMm: diameter,
  };
});

export const FOUNDATION_PRODUCTS: ProductDetailData[] = [
  // 1. Nova Halo Ring
  {
    id: 'prod-01',
    slug: 'nova-halo-ring',
    name: 'Nova Halo Ring',
    description: 'A softly sculpted circular halo ring in solid 925 sterling silver (92.5% pure silver). Hand-polished at the bench with rounded interior comfort fit for effortless daily wear.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    editorialBadge: 'Everyday Essential',
    seoTitle: 'Nova Halo Ring — 925 Sterling Silver | Argyros',
    seoDescription: 'Sculptural circular halo ring in solid 925 sterling silver. Hand-finished by master karigars.',
    images: [
      { id: 'img-nhr-1', url: '/images/products/nova-halo-ring-1-hero.svg', alt: 'Nova Halo Ring in solid 925 sterling silver shown in primary atelier elevation', position: 1 },
      { id: 'img-nhr-2', url: '/images/products/nova-halo-ring-2-on-body.svg', alt: 'Nova Halo Ring shown on index finger scale view', position: 2 },
      { id: 'img-nhr-3', url: '/images/products/nova-halo-ring-3-detail.svg', alt: 'Nova Halo Ring macro craftsmanship showing hand-burnished comfort arc', position: 3 },
      { id: 'img-nhr-4', url: '/images/products/nova-halo-ring-4-profile.svg', alt: 'Nova Halo Ring side profile view showing bevelled shank', position: 4 },
      { id: 'img-nhr-5', url: '/images/products/nova-halo-ring-5-packaging.svg', alt: 'Argyros signature navy keepsake packaging and travel pouch', position: 5 },
      { id: 'img-nhr-6', url: '/images/products/nova-halo-ring-6-hallmark.svg', alt: 'Solid 925 sterling silver benchmark inscription stamp', position: 6 },
    ],
    variants: ringSizes.map((r, i) => ({
      id: `var-nhr-${i + 10}`,
      sku: `ARG-NHR-IN${i + 10}`,
      title: r.title,
      size: r.size,
      weightGrams: 4.2,
      priceCents: 289000, // ₹2,890
      compareAtCents: null,
      stock: 999,
      inStock: true,
    })),
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-daily', slug: 'daily-luxe', name: 'Daily Luxe' },
      { id: 'col-gifts', slug: 'gifts-under-3000', name: 'Gifts Under ₹3,000' },
    ],
    relatedSlugs: {
      completeTheStack: ['vesta-solitaire-band', 'equinox-statement-ring'],
      pairsWellWith: ['solace-pendant', 'luna-hoop-earrings'],
      fromSameEdit: ['aura-stud-earrings', 'meridian-cuff'],
      giftWithThisPiece: ['solace-pendant'],
    },
  },

  // 2. Equinox Statement Ring
  {
    id: 'prod-02',
    slug: 'equinox-statement-ring',
    name: 'Equinox Statement Ring',
    description: 'A wide-profile architectural band ring in solid 925 sterling silver. Features a velvet satin face accented by razor-sharp mirror-polished bevelled edges.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    editorialBadge: 'Premium Reserve',
    seoTitle: 'Equinox Statement Ring — Solid 925 Silver | Argyros',
    seoDescription: 'Architectural wide band ring in solid 925 sterling silver with satin face and bevelled edges.',
    images: [
      { id: 'img-esr-1', url: '/images/products/equinox-statement-ring-1-hero.svg', alt: 'Equinox Statement Ring in solid 925 silver with satin brushed face', position: 1 },
      { id: 'img-esr-2', url: '/images/products/equinox-statement-ring-2-on-body.svg', alt: 'Equinox Statement Ring on hand showing 8.8g presence', position: 2 },
      { id: 'img-esr-3', url: '/images/products/equinox-statement-ring-3-detail.svg', alt: 'Equinox Statement Ring macro craftsmanship showing razor mirror bevels', position: 3 },
      { id: 'img-esr-4', url: '/images/products/equinox-statement-ring-4-profile.svg', alt: 'Equinox Statement Ring profile view showing ergonomic concave taper', position: 4 },
      { id: 'img-esr-5', url: '/images/products/equinox-statement-ring-5-packaging.svg', alt: 'Argyros luxury box packaging and karigar authenticity card', position: 5 },
      { id: 'img-esr-6', url: '/images/products/equinox-statement-ring-6-hallmark.svg', alt: 'Inner shank solid 925 authentication stamp', position: 6 },
    ],
    variants: ringSizes.map((r, i) => ({
      id: `var-esr-${i + 10}`,
      sku: `ARG-ESR-IN${i + 10}`,
      title: r.title,
      size: r.size,
      weightGrams: 8.8,
      priceCents: 629000, // ₹6,290
      compareAtCents: null,
      stock: 999,
      inStock: true,
    })),
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-prem', slug: 'premium-reserve', name: 'Premium Reserve' },
    ],
    relatedSlugs: {
      completeTheStack: ['nova-halo-ring', 'vesta-solitaire-band'],
      pairsWellWith: ['meridian-cuff', 'siddhi-heirloom-kada'],
      fromSameEdit: ['meridian-signet-ring', 'atlas-chain-bracelet'],
      giftWithThisPiece: ['meridian-cuff'],
    },
  },

  // 3. Meridian Signet Ring
  {
    id: 'prod-03',
    slug: 'meridian-signet-ring',
    name: 'Meridian Signet Ring',
    description: 'A contemporary cushion-cut signet ring in heavyweight solid 925 sterling silver. Smooth tactile face ideal for custom monogram engraving.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Meridian Signet Ring — 925 Sterling Silver | Argyros',
    seoDescription: 'Contemporary cushion signet ring in heavy 925 sterling silver. Handcrafted in Haldwani.',
    images: [
      { id: 'img-msr-1', url: '/images/jewellery-hero.jpg', alt: 'Meridian Signet Ring in hand-polished silver', position: 1 },
    ],
    variants: ringSizes.map((r, i) => ({
      id: `var-msr-${i + 10}`,
      sku: `ARG-MSR-IN${i + 10}`,
      title: r.title,
      size: r.size,
      weightGrams: 6.5,
      priceCents: 449000, // ₹4,490
      compareAtCents: null,
      stock: 999,
      inStock: true,
    })),
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-prem', slug: 'premium-reserve', name: 'Premium Reserve' },
    ],
  },

  // 4. Vesta Solitaire Band
  {
    id: 'prod-04',
    slug: 'vesta-solitaire-band',
    name: 'Vesta Solitaire Band',
    description: 'A slender, sculptural ring band with an organic tapering silhouette. Cast in pure 925 sterling silver and hand-finished for everyday stacking.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Vesta Solitaire Band — 925 Sterling Silver | Argyros',
    seoDescription: 'Tapering sculptural silver ring band designed for stacking. Made to order in 925 silver.',
    images: [
      { id: 'img-vsb-1', url: '/images/collections-hero.jpg', alt: 'Vesta Solitaire Band in sterling silver', position: 1 },
    ],
    variants: ringSizes.map((r, i) => ({
      id: `var-vsb-${i + 10}`,
      sku: `ARG-VSB-IN${i + 10}`,
      title: r.title,
      size: r.size,
      weightGrams: 4.8,
      priceCents: 319000, // ₹3,190
      compareAtCents: null,
      stock: 999,
      inStock: true,
    })),
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-daily', slug: 'daily-luxe', name: 'Daily Luxe' },
    ],
  },

  // 5. Luna Hoop Earrings
  {
    id: 'prod-05',
    slug: 'luna-hoop-earrings',
    name: 'Luna Hoop Earrings',
    description: 'Seamless hollow-core hoops in solid 925 sterling silver offering substantial visual volume with feather-light all-day wearability. Secure click-top clasp.',
    category: 'Earrings',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    editorialBadge: 'Best for Gifting',
    seoTitle: 'Luna Hoop Earrings — 925 Sterling Silver | Argyros',
    seoDescription: 'Seamless high-polish hoop earrings in 925 sterling silver. Made to order across 3 diameters.',
    images: [
      { id: 'img-lhe-1', url: '/images/products/luna-hoop-earrings-1-hero.svg', alt: 'Luna Hoop Earrings in solid 925 silver shown in primary atelier view', position: 1 },
      { id: 'img-lhe-2', url: '/images/products/luna-hoop-earrings-2-on-body.svg', alt: 'Luna Hoop Earrings scale view shown worn on ear lobe', position: 2 },
      { id: 'img-lhe-3', url: '/images/products/luna-hoop-earrings-3-detail.svg', alt: 'Luna Hoop Earrings macro craftsmanship showing precision click-top clasp', position: 3 },
      { id: 'img-lhe-4', url: '/images/products/luna-hoop-earrings-4-profile.svg', alt: 'Luna Hoop Earrings profile view showing tubular curvature', position: 4 },
      { id: 'img-lhe-5', url: '/images/products/luna-hoop-earrings-5-packaging.svg', alt: 'Argyros luxury earrings presentation box and velvet pouch', position: 5 },
      { id: 'img-lhe-6', url: '/images/products/luna-hoop-earrings-6-hallmark.svg', alt: 'Post-stamped solid 925 authentication hallmark', position: 6 },
    ],
    variants: [
      { id: 'var-lhe-s', sku: 'ARG-LHE-S', title: 'Small — 20mm Diameter', size: '20mm', weightGrams: 4.6, priceCents: 249000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-lhe-m', sku: 'ARG-LHE-M', title: 'Medium — 30mm Diameter', size: '30mm', weightGrams: 5.8, priceCents: 269000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-lhe-l', sku: 'ARG-LHE-L', title: 'Large — 40mm Diameter', size: '40mm', weightGrams: 7.2, priceCents: 289000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-daily', slug: 'daily-luxe', name: 'Daily Luxe' },
      { id: 'col-gifts', slug: 'gifts-under-3000', name: 'Gifts Under ₹3,000' },
    ],
    relatedSlugs: {
      pairsWellWith: ['nova-halo-ring', 'solace-pendant'],
      completeTheStack: ['aura-stud-earrings', 'kumaon-drop-earrings'],
      fromSameEdit: ['vesta-solitaire-band', 'celestine-choker'],
      giftWithThisPiece: ['solace-pendant'],
    },
  },

  // 6. Aura Stud Earrings
  {
    id: 'prod-06',
    slug: 'aura-stud-earrings',
    name: 'Aura Stud Earrings',
    description: 'Minimalist dome stud earrings in solid 925 sterling silver with mirror finish. Includes custom double-notch posts and sterling silver butterfly friction scroll backs.',
    category: 'Earrings',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Aura Stud Earrings — 925 Sterling Silver | Argyros',
    seoDescription: 'Minimalist dome silver stud earrings in 925 sterling silver. Handcrafted by Siddhi Jewellers karigars.',
    images: [
      { id: 'img-ase-1', url: '/images/collections-hero.jpg', alt: 'Aura Stud Earrings in solid 925 sterling silver', position: 1 },
    ],
    variants: [
      { id: 'var-ase-4', sku: 'ARG-ASE-4', title: '4mm Dome Diameter', size: '4mm', weightGrams: 2.8, priceCents: 189000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-ase-6', sku: 'ARG-ASE-6', title: '6mm Dome Diameter', size: '6mm', weightGrams: 3.6, priceCents: 209000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-ase-8', sku: 'ARG-ASE-8', title: '8mm Dome Diameter', size: '8mm', weightGrams: 4.4, priceCents: 229000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-daily', slug: 'daily-luxe', name: 'Daily Luxe' },
      { id: 'col-gifts', slug: 'gifts-under-3000', name: 'Gifts Under ₹3,000' },
    ],
  },

  // 7. Kumaon Drop Earrings
  {
    id: 'prod-07',
    slug: 'kumaon-drop-earrings',
    name: 'Kumaon Drop Earrings',
    description: 'Evocative articulated drop earrings inspired by traditional Pahadi silver filigree motifs, reinterpreted with minimalist contemporary geometry in solid 925 silver.',
    category: 'Earrings',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Kumaon Drop Earrings — Pahadi Heritage Silver | Argyros',
    seoDescription: 'Contemporary Pahadi drop earrings in solid 925 sterling silver. Handcrafted in Uttarakhand.',
    images: [
      { id: 'img-kde-1', url: '/images/jewellery-hero.jpg', alt: 'Kumaon Drop Earrings in artisanal sterling silver', position: 1 },
    ],
    variants: [
      { id: 'var-kde-1', sku: 'ARG-KDE-01', title: 'One Size (38mm Drop)', size: '38mm', weightGrams: 5.8, priceCents: 369000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-pahadi', slug: 'pahadi-edit', name: 'Pahadi Edit' },
    ],
  },

  // 8. Solace Pendant
  {
    id: 'prod-08',
    slug: 'solace-pendant',
    name: 'Solace Pendant',
    description: 'A sculptural teardrop talisman cast in solid 925 sterling silver with fluid contour lines. Suspended on a sturdy sterling silver diamond-cut cable chain.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Solace Pendant Necklace — 925 Sterling Silver | Argyros',
    seoDescription: 'Solid teardrop talisman in 925 sterling silver on diamond-cut chain. Handcrafted to order.',
    images: [
      { id: 'img-sp-1', url: '/images/collections-hero.jpg', alt: 'Solace Teardrop Pendant in 925 silver', position: 1 },
    ],
    variants: [
      { id: 'var-sp-16', sku: 'ARG-SP-16', title: '16-Inch Chain', size: '16"', weightGrams: 5.2, priceCents: 329000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-sp-18', sku: 'ARG-SP-18', title: '18-Inch Chain', size: '18"', weightGrams: 5.6, priceCents: 349000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-sp-20', sku: 'ARG-SP-20', title: '20-Inch Chain', size: '20"', weightGrams: 6.0, priceCents: 369000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-daily', slug: 'daily-luxe', name: 'Daily Luxe' },
    ],
  },

  // 9. Celestine Choker
  {
    id: 'prod-09',
    slug: 'celestine-choker',
    name: 'Celestine Choker',
    description: 'A heavyweight 1.8mm square box chain necklace in solid 925 sterling silver. Sits flush at the collarbone with an artisanal lobster lock and 2-inch extension chain.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    editorialBadge: 'Daily Luxe Edit',
    seoTitle: 'Celestine Box Choker — 925 Sterling Silver | Argyros',
    seoDescription: 'Square box chain choker in solid 925 sterling silver. Made to order in Haldwani atelier.',
    images: [
      { id: 'img-cc-1', url: '/images/products/celestine-choker-1-hero.svg', alt: 'Celestine Square Box Choker in solid 925 silver primary atelier elevation', position: 1 },
      { id: 'img-cc-2', url: '/images/products/celestine-choker-2-on-body.svg', alt: 'Celestine Square Box Choker shown draped flush along collarbone', position: 2 },
      { id: 'img-cc-3', url: '/images/products/celestine-choker-3-detail.svg', alt: 'Celestine Choker macro craftsmanship showing custom swivel lobster lock', position: 3 },
      { id: 'img-cc-4', url: '/images/products/celestine-choker-4-profile.svg', alt: 'Celestine Choker link articulation showing interlocking geometric box links', position: 4 },
      { id: 'img-cc-5', url: '/images/products/celestine-choker-5-packaging.svg', alt: 'Argyros rigid necklace presentation case and care cloth', position: 5 },
      { id: 'img-cc-6', url: '/images/products/celestine-choker-6-hallmark.svg', alt: 'Solid 925 sterling silver tag authentication stamp', position: 6 },
    ],
    variants: [
      { id: 'var-cc-14', sku: 'ARG-CC-14', title: '14" Length (+ 2" Extender)', size: '14"', weightGrams: 8.4, priceCents: 489000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-cc-16', sku: 'ARG-CC-16', title: '16" Length (+ 2" Extender)', size: '16"', weightGrams: 9.4, priceCents: 509000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-prem', slug: 'premium-reserve', name: 'Premium Reserve' },
    ],
    relatedSlugs: {
      pairsWellWith: ['nova-halo-ring', 'luna-hoop-earrings'],
      completeTheStack: ['solace-pendant', 'aethel-snake-chain'],
      fromSameEdit: ['hansli-minimal-collar', 'trishul-peak-medallion'],
      giftWithThisPiece: ['luna-hoop-earrings'],
    },
  },

  // 10. Trishul Peak Medallion
  {
    id: 'prod-10',
    slug: 'trishul-peak-medallion',
    name: 'Trishul Peak Medallion',
    description: 'An architectural silver medallion engraved with the topographic contour lines of Mount Trishul in Uttarakhand. Solid 925 sterling silver with subtle oxidised contrast.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Trishul Peak Medallion — Uttarakhand Silver | Argyros',
    seoDescription: 'Himalayan topographic medallion in solid 925 sterling silver. Made to order by master karigars.',
    images: [
      { id: 'img-tpm-1', url: '/images/collections-hero.jpg', alt: 'Trishul Peak Medallion with mountain topography', position: 1 },
    ],
    variants: [
      { id: 'var-tpm-18', sku: 'ARG-TPM-18', title: '18" Wheat Chain', size: '18"', weightGrams: 7.1, priceCents: 429000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-tpm-20', sku: 'ARG-TPM-20', title: '20" Wheat Chain', size: '20"', weightGrams: 7.8, priceCents: 449000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-pahadi', slug: 'pahadi-edit', name: 'Pahadi Edit' },
      { id: 'col-prem', slug: 'premium-reserve', name: 'Premium Reserve' },
    ],
  },

  // 11. Hansli Minimal Collar
  {
    id: 'prod-11',
    slug: 'hansli-minimal-collar',
    name: 'Hansli Minimal Collar',
    description: 'A modern tribute to the ancestral Kumaoni Hansli neck collar. Hand-forged from solid 925 sterling silver with tapered terminal ends and flexible memory contouring.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Hansli Minimal Torque Collar — Solid Silver | Argyros',
    seoDescription: 'Ancestral Pahadi Hansli reinterpreted in sculptural 925 sterling silver. Handcrafted in Haldwani.',
    images: [
      { id: 'img-hmc-1', url: '/images/jewellery-hero.jpg', alt: 'Hansli Minimal Torque Collar in hand-forged silver', position: 1 },
    ],
    variants: [
      { id: 'var-hmc-1', sku: 'ARG-HMC-01', title: 'Standard Flexible Fit (15" Inner Arc)', size: '15"', weightGrams: 18.5, priceCents: 789000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-prem', slug: 'premium-reserve', name: 'Premium Reserve' },
      { id: 'col-pahadi', slug: 'pahadi-edit', name: 'Pahadi Edit' },
    ],
  },

  // 12. Atlas Chain Bracelet
  {
    id: 'prod-12',
    slug: 'atlas-chain-bracelet',
    name: 'Atlas Chain Bracelet',
    description: 'A substantial interlocking curb chain bracelet in solid 925 sterling silver. Finished with a heavy hand-tooled bar-and-ring toggle clasp.',
    category: 'Bracelets',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Atlas Chain Bracelet — Heavy 925 Silver | Argyros',
    seoDescription: 'Interlocking curb chain bracelet in 925 sterling silver with custom toggle clasp. Made to order.',
    images: [
      { id: 'img-acb-1', url: '/images/collections-hero.jpg', alt: 'Atlas Chain Bracelet in heavy solid silver', position: 1 },
    ],
    variants: [
      { id: 'var-acb-65', sku: 'ARG-ACB-65', title: '6.5" Wrist Fit', size: '6.5"', weightGrams: 9.6, priceCents: 419000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-acb-70', sku: 'ARG-ACB-70', title: '7.0" Wrist Fit', size: '7.0"', weightGrams: 10.4, priceCents: 439000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-acb-75', sku: 'ARG-ACB-75', title: '7.5" Wrist Fit', size: '7.5"', weightGrams: 11.2, priceCents: 459000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-prem', slug: 'premium-reserve', name: 'Premium Reserve' },
    ],
  },

  // 13. Meridian Cuff
  {
    id: 'prod-13',
    slug: 'meridian-cuff',
    name: 'Meridian Cuff',
    description: 'A heavy gauge open torque cuff hand-hammered at the silversmith bench. Cast from 14.8 grams of solid 925 sterling silver with rounded interior edges.',
    category: 'Bracelets',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Meridian Hammered Cuff — Solid 925 Silver | Argyros',
    seoDescription: 'Hand-hammered open cuff bracelet in solid 925 sterling silver. Made to order by master karigars.',
    images: [
      { id: 'img-mc-1', url: '/images/jewellery-hero.jpg', alt: 'Meridian Hammered Cuff in solid 925 sterling silver', position: 1 },
    ],
    variants: [
      { id: 'var-mc-xs', sku: 'ARG-MC-XS', title: 'XS (52mm Inner Diameter)', size: 'XS', weightGrams: 13.5, priceCents: 549000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-mc-s',  sku: 'ARG-MC-S',  title: 'S (56mm Inner Diameter)',  size: 'S',  weightGrams: 14.2, priceCents: 549000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-mc-m',  sku: 'ARG-MC-M',  title: 'M (60mm Inner Diameter)',  size: 'M',  weightGrams: 14.8, priceCents: 549000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-mc-l',  sku: 'ARG-MC-L',  title: 'L (64mm Inner Diameter)',  size: 'L',  weightGrams: 15.6, priceCents: 549000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-prem', slug: 'premium-reserve', name: 'Premium Reserve' },
    ],
  },

  // 14. Siddhi Heirloom Kada
  {
    id: 'prod-14',
    slug: 'siddhi-heirloom-kada',
    name: 'Siddhi Heirloom Kada',
    description: 'The pinnacle expression of the House of Siddhi Jewellers in silver. Over 24 grams of solid 925 sterling silver with architectural fluting and a concealed spring hinge.',
    category: 'Bracelets',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    editorialBadge: 'Master Karigar Heritage',
    seoTitle: 'Siddhi Heirloom Kada — 24g Solid 925 Silver | Argyros',
    seoDescription: 'Ancestral fluted kada in 24g solid 925 sterling silver with concealed hinge. Handcrafted in Haldwani.',
    images: [
      { id: 'img-shk-1', url: '/images/products/siddhi-heirloom-kada-1-hero.svg', alt: 'Siddhi Heirloom Kada in solid 925 silver with architectural fluting', position: 1 },
      { id: 'img-shk-2', url: '/images/products/siddhi-heirloom-kada-2-on-body.svg', alt: 'Siddhi Heirloom Kada wrist presence showing 24g sculptural heft', position: 2 },
      { id: 'img-shk-3', url: '/images/products/siddhi-heirloom-kada-3-detail.svg', alt: 'Siddhi Heirloom Kada macro craftsmanship showing hand-filed fluted contours', position: 3 },
      { id: 'img-shk-4', url: '/images/products/siddhi-heirloom-kada-4-profile.svg', alt: 'Siddhi Heirloom Kada profile view showing concealed spring hinge mechanism', position: 4 },
      { id: 'img-shk-5', url: '/images/products/siddhi-heirloom-kada-5-packaging.svg', alt: 'Argyros master heirloom velvet presentation box and warranty deed', position: 5 },
      { id: 'img-shk-6', url: '/images/products/siddhi-heirloom-kada-6-hallmark.svg', alt: 'Concealed hinge solid 925 authenticity hallmark seal', position: 6 },
    ],
    variants: [
      { id: 'var-shk-24', sku: 'ARG-SHK-24', title: 'Size 2.4 (57.2mm Diameter)', size: '2.4', weightGrams: 23.5, priceCents: 849000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-shk-26', sku: 'ARG-SHK-26', title: 'Size 2.6 (60.3mm Diameter)', size: '2.6', weightGrams: 24.2, priceCents: 849000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-shk-28', sku: 'ARG-SHK-28', title: 'Size 2.8 (63.5mm Diameter)', size: '2.8', weightGrams: 25.1, priceCents: 849000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-prem', slug: 'premium-reserve', name: 'Premium Reserve' },
      { id: 'col-pahadi', slug: 'pahadi-edit', name: 'Pahadi Edit' },
    ],
    relatedSlugs: {
      completeTheStack: ['meridian-cuff', 'atlas-chain-bracelet'],
      pairsWellWith: ['equinox-statement-ring', 'meridian-signet-ring'],
      fromSameEdit: ['hansli-minimal-collar', 'trishul-peak-medallion'],
      giftWithThisPiece: ['equinox-statement-ring'],
    },
  },

  // 15. Aethel Snake Chain
  {
    id: 'prod-15',
    slug: 'aethel-snake-chain',
    name: 'Aethel Snake Chain',
    description: 'A silky, fluid round snake chain in solid 925 sterling silver. Diamond-cut facets catch light with subtle metallic shimmer. Features reinforced end caps and lobster clasp.',
    category: 'Necklaces',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros-atelier',
    seoTitle: 'Aethel Snake Chain — 925 Sterling Silver | Argyros',
    seoDescription: 'Fluid round snake chain in solid 925 sterling silver with diamond-cut facets. Made to order.',
    images: [
      { id: 'img-asc-1', url: '/images/jewellery-hero.jpg', alt: 'Aethel Snake Chain in polished 925 silver', position: 1 },
    ],
    variants: [
      { id: 'var-asc-18', sku: 'ARG-ASC-18', title: '18" Length (6.9g)', size: '18"', weightGrams: 6.9, priceCents: 389000, compareAtCents: null, stock: 999, inStock: true },
      { id: 'var-asc-20', sku: 'ARG-ASC-20', title: '20" Length (7.6g)', size: '20"', weightGrams: 7.6, priceCents: 419000, compareAtCents: null, stock: 999, inStock: true },
    ],
    collections: [
      { id: 'col-first', slug: 'the-first-edition', name: 'The First Edition' },
      { id: 'col-daily', slug: 'daily-luxe', name: 'Daily Luxe' },
    ],
  },
];

export const FOUNDATION_COLLECTIONS: CollectionData[] = [
  {
    id: 'col-first',
    slug: 'the-first-edition',
    name: 'The First Edition',
    description: 'Our debut collection: 15 sculptural foundation pieces cast in solid 925 sterling silver, crafted to order by master karigars.',
    type: 'EVERGREEN',
    kind: 'editorial',
    isFeatured: true,
    isPublished: true,
    showComingSoon: false,
    displayOrder: 0,
    productCount: 15,
    imageUrl: '/images/jewellery-hero.jpg',
  },
  {
    id: 'col-prem',
    slug: 'premium-reserve',
    name: 'Premium Reserve',
    description: 'Our most substantial pieces (cuffs, signets, torque collars, and heavy chains) crafted with exceptional silver weight.',
    type: 'EVERGREEN',
    kind: 'rule',
    isFeatured: true,
    isPublished: true,
    showComingSoon: false,
    displayOrder: 1,
    productCount: 8,
    imageUrl: '/images/collections-hero.jpg',
  },
  {
    id: 'col-daily',
    slug: 'daily-luxe',
    name: 'Daily Luxe',
    description: 'Lightweight, tactile essentials engineered for daily wear and modern stacking.',
    type: 'EVERGREEN',
    kind: 'rule',
    isFeatured: true,
    isPublished: true,
    showComingSoon: false,
    displayOrder: 2,
    productCount: 6,
    imageUrl: '/images/jewellery-hero.jpg',
  },
  {
    id: 'col-gifts',
    slug: 'gifts-under-3000',
    name: 'Gifts Under ₹3,000',
    description: 'Thoughtful fine jewellery gifts in solid 925 sterling silver that never compromise on craftsmanship.',
    type: 'CURATED',
    kind: 'rule',
    isFeatured: false,
    isPublished: true,
    showComingSoon: false,
    displayOrder: 3,
    productCount: 3,
    imageUrl: '/images/collections-hero.jpg',
  },
  {
    id: 'col-pahadi',
    slug: 'pahadi-edit',
    name: 'Pahadi Edit',
    description: 'Silver inspired by the mountain heritage, ridge contours, and ancestral ornaments of Uttarakhand.',
    type: 'EVERGREEN',
    kind: 'editorial',
    isFeatured: true,
    isPublished: true,
    showComingSoon: false,
    displayOrder: 4,
    productCount: 4,
    imageUrl: '/images/uttarakhand-sunrise.jpg',
  },
  {
    id: 'col-oxidised',
    slug: 'oxidised',
    name: 'Oxidised Collection',
    description: 'The artisanal beauty of darkened patina contrasted against mirror-polished silver relief.',
    type: 'EVERGREEN',
    kind: 'editorial',
    isFeatured: false,
    isPublished: false,
    showComingSoon: true,
    displayOrder: 5,
    productCount: 0,
    imageUrl: '/images/collections-hero.jpg',
  },
];

export function getProductSummary(p: ProductDetailData): ProductSummary {
  const prices = p.variants.map((v) => v.priceCents);
  const sizes = p.variants.map((v) => v.size).filter((s): s is string => Boolean(s));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    metalPurity: p.metalPurity,
    weightGrams: p.variants[0]?.weightGrams ?? null,
    primaryImage: p.images[0] ? { url: p.images[0].url, alt: p.images[0].alt } : null,
    secondaryImage: p.images[1] ? { url: p.images[1].url, alt: p.images[1].alt } : null,
    editorialBadge: p.editorialBadge ?? null,
    availableSizes: sizes.length > 0 ? Array.from(new Set(sizes)) : undefined,
    minPriceCents: prices.length > 0 ? Math.min(...prices) : 0,
    maxPriceCents: prices.length > 0 ? Math.max(...prices) : 0,
    compareAtCents: null,
    inStock: true,
  };
}
