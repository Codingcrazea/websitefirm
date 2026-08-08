import { NextRequest, NextResponse } from 'next/server';
import { ContactFormSchema } from '@/server/validation/schemas';
import { checkRateLimit } from '@/server/security/rateLimiter';
import { sendContactEmail } from '@/server/email/service';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validatedData = ContactFormSchema.parse(body);

    const emailResult = await sendContactEmail(validatedData);

    if (emailResult.success) {
      return NextResponse.json({ success: true, messageId: emailResult.messageId });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
