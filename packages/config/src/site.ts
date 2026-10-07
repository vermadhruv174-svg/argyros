export const siteConfig = {
  brand: {
    name: "Argyros",
    houseLine: "MASTER KARIGAR HERITAGE · HOUSE OF SIDDHI JEWELLERS",
    tagline: "Made to become yours.",
  },
  claims: {
    hallmark: { enabled: false },          // flip to true only after BIS registration
    whatsapp: { number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "" },
  },
  fulfilment: {                            // ASSUMPTIONS: owner to confirm (Section 16)
    model: "made-to-order",
    dispatchBusinessDays: { min: 7, max: 10 },
    transitBusinessDays: { min: 3, max: 7 },
    freeShippingAbove: 2999,
    flatShippingBelow: 99,
    returnWindowDays: 7,
    sizeExchange: { enabled: true, windowDays: 7 },
  },
  bespoke: {                               // ASSUMPTIONS: owner to confirm
    quoteWithinBusinessDays: 1,
    modelStageDays: { min: 5, max: 7 },
    productionStageDays: { min: 10, max: 14 },
    totalWeeks: { min: 3, max: 4 },
    revisionRoundsIncluded: 2,
    advancePercentAfterApproval: 50,
  },
  contact: {
    email: "hello@argyros.in",             // owner to confirm domain/mailbox
    hours: "Monday to Saturday, 10:00 to 18:00 IST",
  },
  legal: {                                 // all must be filled before launch
    entityName: "[LEGAL ENTITY NAME]",
    gstin: "[GSTIN]",
    registeredAddress: "[REGISTERED ADDRESS]",
    grievanceOfficer: { name: "[NAME]", email: "[EMAIL]", phone: "[PHONE]" },
    jurisdictionCity: "[CITY]",
    lastUpdated: "[DATE]",
  },
  siddhi: {
    sinceYear: "[YEAR]",
    storeAddress: "[STORE ADDRESS, HALDWANI]",
    storeHours: "[STORE HOURS]",
  },
  social: { instagram: "", facebook: "", pinterest: "", youtube: "" }, // render icon only if non-empty
};

export type SiteConfig = typeof siteConfig;

// Export for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { siteConfig };
}
