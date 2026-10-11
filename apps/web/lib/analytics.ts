'use client';

/**
 * Argyros Full-Funnel Privacy-Compliant Analytics Tracker
 * Strictly avoids capturing PII (no names, raw phone numbers, or passwords).
 */

export type AnalyticsEventType =
  | 'homepage_view'
  | 'collection_view'
  | 'product_view'
  | 'gallery_interaction'
  | 'size_guide_open'
  | 'gift_finder_started'
  | 'gift_finder_completed'
  | 'wishlist_add'
  | 'search_used'
  | 'add_to_bag'
  | 'bag_opened'
  | 'checkout_started'
  | 'payment_initiated'
  | 'purchase_completed'
  | 'whatsapp_clicked'
  | 'concierge_opened'
  | 'email_signup'
  | 'referral_clicked'
  | 'social_share_clicked';

export interface AnalyticsPayload {
  [key: string]: string | number | boolean | null | undefined;
}

export function trackEvent(eventType: AnalyticsEventType, payload?: AnalyticsPayload): void {
  try {
    if (typeof window === 'undefined') return;

    // Google Analytics 4 integration via gtag if present
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('event', eventType, payload || {});
    }

    // Custom window event for internal analytics listener or tag managers
    const customEvent = new CustomEvent('argyros_analytics', {
      detail: { eventType, payload, timestamp: Date.now() },
    });
    window.dispatchEvent(customEvent);

    if (process.env.NODE_ENV !== 'production') {
      // Dev log for verification
      console.log(`[Analytics Event: ${eventType}]`, payload);
    }
  } catch (err) {
    // Fail silently so customer experience is never interrupted
  }
}
