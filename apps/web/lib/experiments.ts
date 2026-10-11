'use client';

/**
 * Argyros Client-Side A/B Experimentation Engine
 * Deterministic variant assignment based on anonymous visitor ID in localStorage.
 */

export type ExperimentKey =
  | 'exp_hero_cta'
  | 'exp_pdp_cta'
  | 'exp_product_proof'
  | 'exp_home_layout'
  | 'exp_gift_finder_placement';

export interface ExperimentConfig {
  key: ExperimentKey;
  description: string;
  variants: {
    control: string;
    variantB: string;
  };
  metrics: string[];
}

export const EXPERIMENTS: Record<ExperimentKey, ExperimentConfig> = {
  exp_hero_cta: {
    key: 'exp_hero_cta',
    description: 'Hero primary action copy',
    variants: {
      control: 'Shop the First Edition',
      variantB: 'Discover Your Piece',
    },
    metrics: ['click_through_rate', 'first_edition_views'],
  },
  exp_pdp_cta: {
    key: 'exp_pdp_cta',
    description: 'Product detail page primary Add action copy',
    variants: {
      control: 'Add to Bag',
      variantB: 'Make It Yours',
    },
    metrics: ['add_to_bag_rate', 'checkout_start_rate'],
  },
  exp_product_proof: {
    key: 'exp_product_proof',
    description: 'Primary purity claim messaging',
    variants: {
      control: '925 Sterling Silver',
      variantB: 'Hallmarked 925 Silver',
    },
    metrics: ['trust_dwell_time', 'add_to_bag_rate'],
  },
  exp_home_layout: {
    key: 'exp_home_layout',
    description: 'Homepage section structure: Three hero products near top vs Collection-first',
    variants: {
      control: 'three_hero_products_top',
      variantB: 'collection_first_grid',
    },
    metrics: ['product_clicks', 'scroll_depth', 'add_to_bag_rate'],
  },
  exp_gift_finder_placement: {
    key: 'exp_gift_finder_placement',
    description: 'Gift Finder entry point',
    variants: {
      control: 'dedicated_gift_section',
      variantB: 'hero_secondary_cta',
    },
    metrics: ['gift_finder_completion_rate', 'gift_finder_aov'],
  },
};

export function getExperimentVariant(experimentKey: ExperimentKey): 'control' | 'variantB' {
  if (typeof window === 'undefined') return 'control';

  try {
    const storageKey = `argyros_exp_${experimentKey}`;
    const stored = localStorage.getItem(storageKey);
    if (stored === 'control' || stored === 'variantB') {
      return stored;
    }

    // Deterministic 50/50 split based on random or visitor hash
    const assigned = Math.random() < 0.5 ? 'control' : 'variantB';
    localStorage.setItem(storageKey, assigned);
    return assigned;
  } catch {
    return 'control';
  }
}
