import { NextRequest, NextResponse } from 'next/server';
import { AdminLoginSchema } from '@/server/validation/schemas';
import { verifyAdminCredentials, generateAdminSessionToken } from '@/server/auth/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = AdminLoginSchema.parse(body);

    const isValid = await verifyAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = generateAdminSessionToken();

    const response = NextResponse.json({ success: true, redirectUrl: '/admin/dashboard' });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Invalid authentication request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, redirectUrl: '/admin/login' });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
