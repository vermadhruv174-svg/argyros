export const siteConfig = {
  brand: {
    name: "Argyros",
    houseLine: "MASTER KARIGAR HERITAGE · HOUSE OF SIDDHI JEWELLERS",
    tagline: "Made to become yours.",
  },
  claims: {
    hallmark: { enabled: true },          // Enabled as requested by Advisory Board audit
    whatsapp: { number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919412078910" },
  },
  fulfilment: {
    model: "made-to-order",
    dispatchBusinessDays: { min: 5, max: 7 },
    transitBusinessDays: { min: 3, max: 5 },
    freeShippingAbove: 2999,
    flatShippingBelow: 99,
    returnWindowDays: 7,
    sizeExchange: { enabled: true, windowDays: 15 },
  },
  returns: {
    reversePickup: true,
    securityTags: true,
  },
  bespoke: {
    quoteWithinBusinessDays: 1,
    modelStageDays: { min: 5, max: 7 },
    productionStageDays: { min: 10, max: 14 },
    totalWeeks: { min: 3, max: 4 },
    revisionRoundsIncluded: 2,
    advancePercentAfterApproval: 50,
  },
  contact: {
    email: "hello@argyros.in",
    hours: "Monday to Saturday, 10:00 to 18:00 IST",
  },
  paymentMethods: [
    "Razorpay (UPI, Credit/Debit Cards, NetBanking, Wallets)"
  ],
  legal: {
    status: "reviewed",
    entityName: "Argyros Fine Jewels LLP (House of Siddhi Jewellers)",
    gstin: "05AAFFA1234F1Z5",
    registeredAddress: "House of Siddhi Jewellers, Bareilly - Nainital Rd, Haldwani, Uttarakhand 263139",
    grievanceOfficer: { name: "Dhruv Verma", email: "grievance@argyros.in", phone: "+91 94120 78910" },
    jurisdictionCity: "Haldwani / Nainital",
    lastUpdated: "October 2026",
  },
  siddhi: {
    sinceYear: "1974",
    storeAddress: "Main Market, Bareilly - Nainital Rd, Haldwani, Uttarakhand 263139",
    storeHours: "Monday to Saturday, 10:30 AM to 8:00 PM IST",
  },
  social: { instagram: "https://instagram.com/argyros925", facebook: "", pinterest: "", youtube: "" },
};

export type SiteConfig = typeof siteConfig;

// Export for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { siteConfig };
}
