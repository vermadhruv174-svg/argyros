'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';
import {
  Sparkles,
  CircleDot,
  Layers,
  Clock,
  ShieldCheck,
  ChevronDown,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CANVASES = [
  { id: 'Ring', label: 'Rings', desc: 'Sculptural bands, signets, or solitaire settings' },
  { id: 'Pendant', label: 'Pendants & Chains', desc: 'Custom medallions, hansli collars, or talismans' },
  { id: 'Cuff', label: 'Cuffs & Bangles', desc: 'Substantial silver cuffs or engraved kadas' },
  { id: 'Earrings', label: 'Earrings', desc: 'Statement hoops, drops, or minimalist studs' },
  { id: 'Heirloom', label: 'Heirloom Remodel', desc: 'Recreating or restoring an ancestral silver piece' },
  { id: 'Other', label: 'Something Else', desc: 'Unique commissions, sculptural objects or custom sets' },
];

const FINISHES = [
  { id: 'High Polish 925', label: 'High-Polish Sterling', desc: 'Brilliant, reflective surface capturing natural light' },
  { id: 'Oxidised Antiqued', label: 'Oxidised Finish', desc: 'Artisanal dark patina with hand-polished raised motifs' },
  { id: '18K Gold Vermeil', label: '18K Gold Vermeil, 2.5 micron', desc: 'Standard 2.5-micron gold layer over pure 925 sterling silver' },
  { id: 'Satin Matte', label: 'Satin Matte Brushed', desc: 'Subtle, non-reflective velvety metallic texture' },
];

const BUDGET_TIERS = [
  { id: '₹3,000 – ₹6,000', label: '₹3,000 – ₹6,000', hint: 'Minimalist bands, light pendants, or delicate studs' },
  { id: '₹6,000 – ₹12,000', label: '₹6,000 – ₹12,000', hint: 'Sculptural signets, stone-set pendants, or statement hoops' },
  { id: '₹12,000+', label: '₹12,000 & Above', hint: 'Heavyweight solid cuffs (> 30g), intricate collar sets' },
  { id: 'Advise Me', label: 'Not sure, advise me', hint: 'Let the master karigar estimate based on silver weight' },
];

export default function BespokePage() {
  const [category, setCategory] = useState('Ring');
  const [finish, setFinish] = useState('High Polish 925');
  const [budgetTier, setBudgetTier] = useState('₹6,000 – ₹12,000');
  const [size, setSize] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Form load timestamp for time-to-submit verification
  const [mountTime] = useState<number>(() => Date.now());

  // Client details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // File preview
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Accordion states
  const [heirloomOpen, setHeirloomOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const maxFiles = Math.min(files.length, 3);

    for (let i = 0; i < maxFiles; i++) {
      const file = files[i];
      // Disallow SVG explicitly
      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        setError('SVG files are not permitted for security reasons. Please upload JPG, PNG, or WEBP.');
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError('Please upload images under 8MB each.');
        continue;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const timeToSubmitMs = Date.now() - mountTime;

    if (honeypot) {
      // Bot detected silently
      setSubmittedRef('ARG-BSP-000000');
      return;
    }

    if (!fullName || !email || !phone || !description) {
      setError('Please fill in your name, contact information, and design description.');
      return;
    }

    if (description.length < 20) {
      setError('Please provide at least 20 characters in your design description.');
      return;
    }

    if (!consent) {
      setError('Please agree to be contacted and accept the Privacy Policy.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/bespoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          category,
          finish,
          budgetTier,
          estimatedSize: size.trim() || undefined,
          targetDate: targetDate || undefined,
          description: description.trim(),
          imageUrls: previewImages.slice(0, 3),
          website_secondary: honeypot || undefined,
          timeToSubmitMs,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to submit inquiry. Please try again.');
      }

      const data = await res.json();
      setSubmittedRef(data.referenceNumber || 'ARG-BSP-' + Math.floor(100000 + Math.random() * 900000));
    } catch (err: any) {
      setError(err.message || 'An error occurred while transmitting your request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* 7.1 Hero Section */}
        <section className="shell py-14 md:py-24 border-b border-line">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-3.5 py-1 text-[9px] font-bold tracking-[.22em] text-[#8F682F] uppercase shadow-sm mb-6">
              <span>✦</span> BESPOKE ATELIER
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-none text-ink tracking-tight">
              Commission a piece that is <i className="font-serif italic font-normal text-gold">only</i> yours.
            </h1>
            <p className="mt-6 text-sm md:text-base leading-relaxed text-neutral-600 font-light max-w-2xl">
              Bring a sketch, a reference or an heirloom. Our master karigars turn it into sterling silver, with your approval at every stage.
            </p>
          </div>
        </section>

        {/* 7.1 What We Make (Line Icon Cards, No Emoji) */}
        <section className="shell py-12 md:py-16 border-b border-line">
          <p className="eyebrow text-gold text-center mb-8">Canvases of Expression</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CANVASES.map((c) => {
              const isSelected = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`p-4 text-left rounded-[2px] transition-all duration-200 border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-ink text-white border-ink shadow-md'
                      : 'bg-white border-line text-ink hover:border-gold'
                  }`}
                >
                  <Sparkles size={18} className={`mb-3 ${isSelected ? 'text-gold' : 'text-neutral-400'}`} />
                  <div>
                    <p className="text-xs font-bold tracking-tight">{c.label}</p>
                    <p className={`text-[9px] mt-1 line-clamp-2 ${isSelected ? 'text-white/70' : 'text-neutral-500'}`}>
                      {c.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 7.2 The Craft Timeline (4 stages with durations from config) */}
        <section className="bg-[#0a1628] py-14 md:py-20 text-white" aria-label="Bespoke Process">
          <div className="shell">
            <p className="eyebrow text-gold text-center mb-4">✦ The Craft Journey</p>
            <h2 className="font-display text-3xl md:text-4xl text-center text-white mb-12">
              Four steps from imagination to permanence.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-white/10 p-6 rounded-[2px] bg-white/5 space-y-3">
                <span className="font-display text-3xl text-gold">01</span>
                <h3 className="font-display text-xl text-white">Brief & Quote</h3>
                <p className="text-[10px] text-gold uppercase tracking-wider">
                  Within {siteConfig.bespoke.quoteWithinBusinessDays} business day
                </p>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Share your idea and budget. We reply by email with a design direction and a quote.
                </p>
              </div>

              <div className="border border-white/10 p-6 rounded-[2px] bg-white/5 space-y-3">
                <span className="font-display text-3xl text-gold">02</span>
                <h3 className="font-display text-xl text-white">Wax/Model Approval</h3>
                <p className="text-[10px] text-gold uppercase tracking-wider">
                  {siteConfig.bespoke.modelStageDays.min}–{siteConfig.bespoke.modelStageDays.max} days
                </p>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  We create a hand-finished model you can review. {siteConfig.bespoke.revisionRoundsIncluded} revision rounds are included. No payment is taken until you approve the model.
                </p>
              </div>

              <div className="border border-white/10 p-6 rounded-[2px] bg-white/5 space-y-3">
                <span className="font-display text-3xl text-gold">03</span>
                <h3 className="font-display text-xl text-white">Casting & Craft</h3>
                <p className="text-[10px] text-gold uppercase tracking-wider">
                  {siteConfig.bespoke.productionStageDays.min}–{siteConfig.bespoke.productionStageDays.max} days
                </p>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Your approved design is lost-wax cast in 925 sterling silver, then set, finished and polished by hand in the Argyros atelier.
                </p>
              </div>

              <div className="border border-white/10 p-6 rounded-[2px] bg-white/5 space-y-3">
                <span className="font-display text-3xl text-gold">04</span>
                <h3 className="font-display text-xl text-white">Final Finish & Delivery</h3>
                <p className="text-[10px] text-gold uppercase tracking-wider">
                  Insured dispatch
                </p>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Final inspection, gift-ready packaging, and insured dispatch to your door across India.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center text-xs text-white/70 border-t border-white/10 pt-6">
              ✦ Typical total: {siteConfig.bespoke.totalWeeks.min}–{siteConfig.bespoke.totalWeeks.max} weeks from model approval.
            </div>
          </div>
        </section>

        {/* 7.3 Pricing and Payment Panel */}
        <section className="shell py-12 md:py-16 border-b border-line">
          <div className="grid md:grid-cols-3 gap-8 p-8 border border-line bg-[#fdfcf9] rounded-[2px]">
            <div>
              <h3 className="font-display text-xl text-ink">How We Price</h3>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Your quote reflects silver weight at the day’s rate, making charges, any stones, finish, and applicable GST. You see the complete breakdown before you commit.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-ink">Payment Schedule</h3>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Nothing is charged until you approve the model. After approval, {siteConfig.bespoke.advancePercentAfterApproval}% secures production and the balance is due before dispatch.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-ink">Custom Commission Terms</h3>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Bespoke and engraved pieces are made for you alone, so they cannot be returned. Quoted dimensions and design are confirmed with you at the model stage.
              </p>
            </div>
          </div>
        </section>

        {/* 7.4 Heirloom Remodel Disclosure Panel */}
        <section className="shell py-8">
          <div className="border border-line rounded-[2px] bg-white">
            <button
              type="button"
              onClick={() => setHeirloomOpen(!heirloomOpen)}
              className="w-full flex items-center justify-between p-6 text-left hover:text-gold transition-colors"
              aria-expanded={heirloomOpen}
            >
              <div className="flex items-center gap-3">
                <Layers size={20} className="text-gold" />
                <h3 className="font-display text-2xl text-ink">
                  How Heirloom Remodel Works
                </h3>
              </div>
              <ChevronDown size={18} className={`transition-transform ${heirloomOpen ? 'rotate-180' : ''}`} />
            </button>
            {heirloomOpen && (
              <div className="px-6 pb-6 text-xs text-neutral-600 leading-relaxed space-y-3 border-t border-line/60 pt-4">
                <p>1. <strong>Feasibility:</strong> You describe the piece and share photographs. We confirm feasibility and design direction.</p>
                <p>2. <strong>Insured Transit:</strong> We arrange insured pickup or you send via insured courier. We never ask clients to send valuables by ordinary post.</p>
                <p>3. <strong>Verified Weight:</strong> The piece is weighed on receipt and the weight is recorded and shared with you with photographs.</p>
                <p>4. <strong>Melt & Loss Transparency:</strong> An estimated melt loss is quoted upfront and confirmed against the weighed result. You can choose a silver-credit option for unused metal.</p>
                <p>5. <strong>Written Authorization:</strong> Nothing is melted without your written approval of the plan.</p>
              </div>
            )}
          </div>
        </section>

        {/* 7.5 Bespoke Commission Form */}
        <section className="shell py-12 md:py-20">
          {submittedRef ? (
            <div className="max-w-2xl mx-auto liquid-glass-dark rounded-[2px] p-8 md:p-14 text-center text-white border border-gold/30 shadow-2xl">
              <CheckCircle2 size={48} className="text-gold mx-auto mb-4 stroke-[1.5]" />
              <p className="eyebrow text-gold">Commission In Motion</p>
              <h2 className="font-display text-3xl md:text-4xl text-white mt-2">
                Your Inquiry Has Been Received
              </h2>
              <div className="my-6 p-4 bg-white/10 border border-gold/40 inline-block rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-white/70 block">Commission Reference</span>
                <span className="font-mono text-lg font-bold text-gold tracking-wider">{submittedRef}</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed max-w-md mx-auto">
                Thank you, {fullName}. Our master karigar is reviewing your specifications. We will send an initial design direction and transparent quote to <strong>{email}</strong> within {siteConfig.bespoke.quoteWithinBusinessDays} business day.
              </p>
              <div className="mt-8">
                <Link href="/shop" className="button bg-gold text-[#0a1628] hover:bg-[#d4b05a]">
                  Explore Debut Edition →
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="border-b border-line pb-6 mb-10">
                <h2 className="font-display text-3xl md:text-4xl text-ink">Commission Details</h2>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Configure your specifications below. Zero 3D software required.</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded flex items-center gap-2" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Honeypot for spam bots: off-screen absolute positioning */}
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                  <label htmlFor="website_secondary">Do not fill this field</label>
                  <input
                    type="text"
                    id="website_secondary"
                    name="website_secondary"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Silver Finish */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-3">
                    Desired Finish *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FINISHES.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFinish(f.id)}
                        className={`p-4 text-left rounded-[2px] transition-all border ${
                          finish === f.id
                            ? 'bg-ink text-white border-ink'
                            : 'bg-white border-line text-ink hover:border-gold'
                        }`}
                      >
                        <p className="text-xs font-bold">{f.label}</p>
                        <p className={`text-[10px] mt-1 ${finish === f.id ? 'text-white/70' : 'text-neutral-500'}`}>{f.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Section: Max 3 files, NO SVG */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-2">
                    Inspiration / Reference Photos (Optional)
                  </label>
                  <p className="text-xs text-neutral-500 mb-3 font-light">
                    Upload up to 3 images (JPG, PNG, WEBP — Max 8MB each).
                  </p>
                  <div className="border border-dashed border-line hover:border-gold p-6 rounded text-center bg-[#fdfcf9]">
                    <input
                      type="file"
                      id="bespoke-upload"
                      multiple
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    <label htmlFor="bespoke-upload" className="cursor-pointer block">
                      <Upload size={24} className="text-gold mx-auto mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider text-ink block hover:text-gold">
                        Choose Images
                      </span>
                    </label>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="mt-4 flex gap-3">
                      {previewImages.map((src, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded border border-line overflow-hidden">
                          <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-black/70 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vision Description (min 20 chars) */}
                <div>
                  <label htmlFor="description" className="block text-xs font-bold uppercase tracking-widest text-ink mb-2">
                    Describe Your Vision (Min 20 characters) *
                  </label>
                  <textarea
                    id="description"
                    required
                    minLength={20}
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe desired motifs, stones, silhouette, or the inspiration behind this commission..."
                    className="w-full border border-line bg-white p-3 text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                {/* Specifications Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="size" className="block text-xs font-bold uppercase tracking-widest text-ink mb-1">
                      Estimated Size
                    </label>
                    <input
                      id="size"
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="e.g. Ring size 8 or 60mm wrist"
                      className="w-full border border-line bg-white p-3 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-1">
                      Target Budget
                    </label>
                    <select
                      value={budgetTier}
                      onChange={(e) => setBudgetTier(e.target.value)}
                      className="w-full border border-line bg-white p-3 text-xs focus:border-gold focus:outline-none"
                    >
                      {BUDGET_TIERS.map((b) => (
                        <option key={b.id} value={b.id}>{b.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="targetDate" className="block text-xs font-bold uppercase tracking-widest text-ink mb-1">
                      Target Date (Optional)
                    </label>
                    <input
                      id="targetDate"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full border border-line bg-white p-3 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t border-line pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">Contact Information</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="fullName" className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">Full Name *</label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className="w-full border border-line bg-white p-3 text-xs focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">Indian 10-digit Phone *</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98200 12345"
                        className="w-full border border-line bg-white p-3 text-xs focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full border border-line bg-white p-3 text-xs focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="consent" className="text-xs text-neutral-600 leading-snug">
                    I agree to be contacted about this commission and accept the{' '}
                    <Link href="/privacy" className="underline hover:text-gold">Privacy Policy</Link>.
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="button w-full sm:w-auto min-w-[260px]"
                  >
                    {submitting ? 'Transmitting Commission...' : 'Submit Bespoke Inquiry →'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* 7.6 Bespoke FAQ (Accordion) */}
        <section className="shell pb-24 border-t border-line pt-14">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl text-ink text-center mb-8">Bespoke Atelier FAQ</h2>
            <div className="space-y-3">
              <div className="border border-line rounded">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === 'faq1' ? null : 'faq1')}
                  className="w-full flex justify-between p-4 text-xs font-bold uppercase tracking-wider text-left"
                >
                  <span>How long does a commission take?</span>
                  <ChevronDown size={14} className={`transition-transform ${openFaq === 'faq1' ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 'faq1' && (
                  <p className="p-4 pt-0 text-xs text-neutral-600 leading-relaxed">
                    Typically {siteConfig.bespoke.totalWeeks.min}–{siteConfig.bespoke.totalWeeks.max} weeks from model approval, depending on complexity.
                  </p>
                )}
              </div>

              <div className="border border-line rounded">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === 'faq2' ? null : 'faq2')}
                  className="w-full flex justify-between p-4 text-xs font-bold uppercase tracking-wider text-left"
                >
                  <span>Can you copy a design I saw elsewhere?</span>
                  <ChevronDown size={14} className={`transition-transform ${openFaq === 'faq2' ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 'faq2' && (
                  <p className="p-4 pt-0 text-xs text-neutral-600 leading-relaxed">
                    We make original interpretations. We cannot reproduce another brand’s protected designs. Share your inspiration and we will design something that is yours.
                  </p>
                )}
              </div>

              <div className="border border-line rounded">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === 'faq3' ? null : 'faq3')}
                  className="w-full flex justify-between p-4 text-xs font-bold uppercase tracking-wider text-left"
                >
                  <span>Who owns the design?</span>
                  <ChevronDown size={14} className={`transition-transform ${openFaq === 'faq3' ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 'faq3' && (
                  <p className="p-4 pt-0 text-xs text-neutral-600 leading-relaxed">
                    A design created for you for a one-off commission is made for you. We won’t produce it for others without your consent.
                  </p>
                )}
              </div>

              <div className="border border-line rounded">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === 'faq4' ? null : 'faq4')}
                  className="w-full flex justify-between p-4 text-xs font-bold uppercase tracking-wider text-left"
                >
                  <span>Can I resize it later?</span>
                  <ChevronDown size={14} className={`transition-transform ${openFaq === 'faq4' ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 'faq4' && (
                  <p className="p-4 pt-0 text-xs text-neutral-600 leading-relaxed">
                    Rings can usually be resized once within 30 days.
                  </p>
                )}
              </div>

              <div className="border border-line rounded">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === 'faq5' ? null : 'faq5')}
                  className="w-full flex justify-between p-4 text-xs font-bold uppercase tracking-wider text-left"
                >
                  <span>Do you ship outside India?</span>
                  <ChevronDown size={14} className={`transition-transform ${openFaq === 'faq5' ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 'faq5' && (
                  <p className="p-4 pt-0 text-xs text-neutral-600 leading-relaxed">
                    Not yet. Delivering across India only.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
