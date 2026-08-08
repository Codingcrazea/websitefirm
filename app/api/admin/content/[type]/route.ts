import { NextRequest, NextResponse } from 'next/server';
import { ContentWriteSchema } from '@/server/validation/schemas';
import { saveContentItem } from '@/server/content/service';
import { verifyAdminSessionToken } from '@/server/auth/service';

export async function POST(req: NextRequest, { params }: { params: { type: string } }) {
  try {
    // 1. Verify Admin Session Cookie
    const token = req.cookies.get('admin_session')?.value;
    if (!token || !verifyAdminSessionToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const contentType = params.type;
    const body = await req.json();

    const validatedData = ContentWriteSchema.parse({
      type: contentType,
      ...body,
    });

    // 2. Save Markdown Content File to /content/[type]/[slug].md
    await saveContentItem(
      validatedData.type,
      validatedData.slug,
      validatedData.frontmatter,
      validatedData.content
    );

    return NextResponse.json({
      success: true,
      message: `Content published successfully to /content/${validatedData.type}/${validatedData.slug}.md`,
      slug: validatedData.slug,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: error.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Failed to save content' }, { status: 500 });
  }
}
