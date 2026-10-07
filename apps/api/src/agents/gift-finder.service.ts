import { Injectable, Logger } from '@nestjs/common';
import { AeosService } from '../aeos/aeos.service';
import { PrismaService } from '../database/prisma.service';

export interface GiftFinderInput {
  occasion: string;          // 'birthday' | 'anniversary' | 'wedding' | 'graduation' | 'self-gift' | 'other'
  recipient: string;         // 'her' | 'him' | 'them' | 'self'
  budgetMinRupees: number;
  budgetMaxRupees: number;
  style?: string;            // 'minimalist' | 'statement' | 'traditional' | 'contemporary'
}

export interface GiftRecommendation {
  productSlug: string;
  productName: string;
  reason: string;            // Why this is a good gift for this person/occasion
  priceRupees: number;
  imageUrl: string | null;
}

@Injectable()
export class GiftFinderService {
  private readonly logger = new Logger(GiftFinderService.name);

  constructor(
    private readonly aeos: AeosService,
    private readonly db: PrismaService,
  ) {}

  async findGifts(input: GiftFinderInput, correlationId?: string): Promise<GiftRecommendation[]> {
    // 1. Fetch active products from DB
    const products = await this.db.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        variants: { where: { stock: { gt: 0 } }, orderBy: { priceCents: 'asc' }, take: 1 },
        images: { orderBy: { position: 'asc' }, take: 1 },
      },
    });

    // Filter by budget
    const inBudget = products.filter((p) => {
      const lowestPrice = p.variants[0]?.priceCents ?? Infinity;
      const rupees = lowestPrice / 100;
      return rupees >= input.budgetMinRupees && rupees <= input.budgetMaxRupees;
    });

    if (inBudget.length === 0) {
      return [];
    }

    // 2. Build a catalogue summary for the AI (product names + categories + prices)
    const catalogueSummary = inBudget
      .slice(0, 20) // cap at 20 to keep prompt size reasonable
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        category: p.category,
        priceRupees: Math.round((p.variants[0]?.priceCents ?? 0) / 100),
        description: p.description ?? '',
      }));

    // 3. Invoke AI via AEOS OmniRoute — Argyros NEVER calls OpenAI directly
    const aiInput = { giftRequest: input, catalogue: catalogueSummary };
    
    let aiRecommendations: Array<{ slug: string; reason: string }>;
    
    try {
      const response = await this.aeos.invokeCapability<typeof aiInput, { recommendations: typeof aiRecommendations }>({
        capability: 'gift-recommendation',
        input: aiInput,
        correlationId,
      });
      aiRecommendations = response.output.recommendations ?? [];
    } catch (err) {
      // OmniRoute fallback: if no provider registered, do rule-based recommendations
      this.logger.warn('OmniRoute has no provider for gift-recommendation. Using rule-based fallback.');
      aiRecommendations = catalogueSummary.slice(0, 3).map((p) => ({
        slug: p.slug,
        reason: `A beautiful ${p.category.toLowerCase()} piece, perfect for ${input.occasion}.`,
      }));
    }

    // 4. Hydrate with full product data
    const results: GiftRecommendation[] = [];
    for (const rec of aiRecommendations.slice(0, 5)) {
      const product = inBudget.find((p) => p.slug === rec.slug);
      if (!product) continue;
      results.push({
        productSlug: product.slug,
        productName: product.name,
        reason: rec.reason,
        priceRupees: Math.round((product.variants[0]?.priceCents ?? 0) / 100),
        imageUrl: product.images[0]?.url ?? null,
      });
    }

    return results;
  }
}
