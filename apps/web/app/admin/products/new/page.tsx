'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/lib/admin-api';

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: '',
    description: '',
    metalPurity: '925 Sterling Silver',
    seoTitle: '',
    seoDescription: '',
  });

  const [variants, setVariants] = useState([{
    sku: '',
    title: 'Default',
    size: '',
    weightGrams: 0,
    priceCents: 0,
    compareAtCents: 0,
    stock: 0
  }]);

  const handleSlugGen = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm(prev => ({ ...prev, name, slug: handleSlugGen(name) }));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, {
      sku: '', title: '', size: '', weightGrams: 0, priceCents: 0, compareAtCents: 0, stock: 0
    }]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        variants: variants.map(v => ({
          ...v,
          weightGrams: Number(v.weightGrams),
          priceCents: Number(v.priceCents) * 100, // convert input back if needed, assuming user inputs ₹
          compareAtCents: v.compareAtCents ? Number(v.compareAtCents) * 100 : undefined,
          stock: Number(v.stock),
        }))
      };
      
      await createProduct(payload);
      router.push('/admin/products');
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
      setSubmitting(false);
    }
  };

  const inputClass = "w-full border border-line bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl mb-8">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-white border border-line p-6 rounded-lg space-y-4">
          <h2 className="font-display text-2xl border-b border-line pb-2">Basic Info</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-1">Product Name</label>
              <input required type="text" value={form.name} onChange={handleNameChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-1">Slug</label>
              <input required type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-1">Category</label>
              <input required type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-1">Metal Purity</label>
              <input type="text" value={form.metalPurity} onChange={e => setForm({...form, metalPurity: e.target.value})} className={inputClass} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-1">Description</label>
            <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass}></textarea>
          </div>
        </div>

        <div className="bg-white border border-line p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-2">
            <h2 className="font-display text-2xl">Variants</h2>
            <button type="button" onClick={addVariant} className="text-gold text-sm font-bold uppercase tracking-wider hover:underline">+ Add Variant</button>
          </div>
          
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-line bg-gray-50 rounded">
              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">SKU</label>
                <input required type="text" value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Title</label>
                <input required type="text" value={v.title} onChange={e => updateVariant(i, 'title', e.target.value)} className={inputClass} placeholder="e.g. Size 6" />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Size (optional)</label>
                <input type="text" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Weight (g)</label>
                <input required type="number" step="0.01" value={v.weightGrams} onChange={e => updateVariant(i, 'weightGrams', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Price (₹)</label>
                <input required type="number" min="0" value={v.priceCents} onChange={e => updateVariant(i, 'priceCents', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Compare-at (₹)</label>
                <input type="number" min="0" value={v.compareAtCents} onChange={e => updateVariant(i, 'compareAtCents', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Initial Stock</label>
                <input required type="number" min="0" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className={inputClass} />
              </div>
              {variants.length > 1 && (
                <div className="flex items-end">
                  <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="text-red-500 text-sm hover:underline mb-2">Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-line hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="bg-ink text-white px-8 py-2 font-bold uppercase tracking-wider hover:bg-gold transition-colors disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
