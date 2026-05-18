import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const settings = await db.collection('site_settings').findOne({ type: 'owner_profile' }) as any;

    let valid = false;

    if (!settings) {
      // Default credentials fallback
      if (username === 'admin' && password === 'admin123') {
        valid = true;
      }
    } else {
      if (settings.adminUsername === username) {
        valid = settings.passwordHash
          ? await bcrypt.compare(password, settings.passwordHash)
          : (password === 'admin123');
      }
    }

    if (!valid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    
    // Set a secure HTTP-only cookie for admin session
    response.cookies.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
