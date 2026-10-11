import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory rate limiting: 5 requests per hour per IP
const ipRateLimit = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const now = Date.now();

    // Clean up expired rate limit entries
    const userLimit = ipRateLimit.get(ip);
    if (userLimit && userLimit.resetAt > now) {
      if (userLimit.count >= 5) {
        return NextResponse.json(
          { error: 'Too many bespoke requests from this connection. Please try again in an hour.' },
          { status: 429 }
        );
      }
      userLimit.count += 1;
    } else {
      ipRateLimit.set(ip, { count: 1, resetAt: now + 3600000 });
    }

    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      description,
      category,
      finish,
      budgetTier,
      size,
      targetDate,
      consent,
      honeypot,
      images,
    } = body;

    // Honeypot check for bots
    if (honeypot && String(honeypot).trim().length > 0) {
      // Silently accept without logging or saving
      return NextResponse.json({
        success: true,
        reference: 'ARG-BSP-000000',
        message: 'Inquiry received',
      });
    }

    // Required fields validation
    if (!fullName || !email || !phone || !description) {
      return NextResponse.json(
        { error: 'Full name, email, phone number, and design description are required.' },
        { status: 400 }
      );
    }

    if (typeof description !== 'string' || description.trim().length < 20) {
      return NextResponse.json(
        { error: 'Design description must be at least 20 characters.' },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: 'You must consent to be contacted and agree to our privacy policy.' },
        { status: 400 }
      );
    }

    // Server-side SVG rejection on uploaded images / data URLs
    if (Array.isArray(images)) {
      for (const img of images) {
        if (typeof img === 'string') {
          if (
            img.includes('image/svg+xml') ||
            img.toLowerCase().includes('<svg') ||
            img.toLowerCase().endsWith('.svg')
          ) {
            return NextResponse.json(
              { error: 'SVG files are not permitted for security reasons. Please use JPG, PNG, or WEBP.' },
              { status: 400 }
            );
          }
        }
      }
    }

    // Generate authenticated Bespoke Inquiry reference
    const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
    const reference = `ARG-BSP-${randomSixDigit}`;

    console.log(`[Bespoke] New Inquiry received: ${reference} from ${email} (${fullName}) for ${category}`);

    return NextResponse.json({
      success: true,
      reference,
      message: `Your bespoke commission inquiry has been received. Our master karigar will review it within 1 business day.`,
      details: {
        reference,
        category,
        finish,
        budgetTier,
      },
    });
  } catch (error) {
    console.error('[Bespoke API Error]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while submitting your inquiry.' },
      { status: 500 }
    );
  }
}
