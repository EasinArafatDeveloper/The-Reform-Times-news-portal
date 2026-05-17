import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// GET /api/admin/settings — fetch the active site owner profile (first journalist marked as owner)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');

    // Get site settings doc
    let settings = await db.collection('site_settings').findOne({ type: 'owner_profile' });

    if (!settings) {
      // return defaults
      return NextResponse.json({
        name: 'Kazi Salman',
        email: '',
        bio: { bn: '', en: '' },
        role: { bn: 'সম্পাদক', en: 'Editor-in-Chief' },
        avatar: '',
        social: { twitter: '', facebook: '', linkedin: '' },
        adminUsername: 'admin',
      });
    }

    // never expose password hash
    const { passwordHash: _pw, ...safe } = settings as any;
    return NextResponse.json(safe);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST /api/admin/settings — upsert settings doc
export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const body = await req.json();

    const {
      name, email, bio, role, avatar, social,
      adminUsername,
      currentPassword, newPassword,
    } = body;

    // fetch existing to validate current password if changing
    const existing = await db.collection('site_settings').findOne({ type: 'owner_profile' }) as any;

    const updateDoc: any = {
      type: 'owner_profile',
      name, email, bio, role, avatar, social,
      adminUsername: adminUsername || 'admin',
      updatedAt: new Date().toISOString(),
    };

    // Handle password change
    if (newPassword) {
      if (!existing) {
        // No existing — just set it
        updateDoc.passwordHash = await bcrypt.hash(newPassword, 10);
      } else {
        // Verify current password
        const existingHash = existing.passwordHash;
        if (existingHash) {
          const ok = await bcrypt.compare(currentPassword || '', existingHash);
          if (!ok) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
          }
        }
        updateDoc.passwordHash = await bcrypt.hash(newPassword, 10);
      }
    } else if (existing?.passwordHash) {
      // Preserve existing hash
      updateDoc.passwordHash = existing.passwordHash;
    }

    await db.collection('site_settings').updateOne(
      { type: 'owner_profile' },
      { $set: updateDoc },
      { upsert: true }
    );

    // Also update the journalist record if it exists (for public profile sync)
    if (name) {
      await db.collection('journalists').updateOne(
        { isOwner: true },
        {
          $set: {
            name,
            email,
            bio,
            role,
            avatar,
            social,
            isOwner: true,
            updatedAt: new Date().toISOString(),
          }
        },
        { upsert: true }
      );

      // Sync the updated owner profile to all existing articles
      await db.collection('articles').updateMany(
        {},
        {
          $set: {
            author: {
              name: name,
              avatar: avatar,
              role: role?.en || "Editor",
              bio: bio?.en || ""
            }
          }
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
  }
}

// POST /api/admin/settings/verify-password — used during login check
export async function PUT(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const { username, password } = await req.json();

    const settings = await db.collection('site_settings').findOne({ type: 'owner_profile' }) as any;

    if (!settings) {
      // Default credentials fallback
      if (username === 'admin' && password === 'admin123') {
        return NextResponse.json({ valid: true });
      }
      return NextResponse.json({ valid: false });
    }

    if (settings.adminUsername !== username) {
      return NextResponse.json({ valid: false });
    }

    const valid = settings.passwordHash
      ? await bcrypt.compare(password, settings.passwordHash)
      : (password === 'admin123'); // default before any password is set

    return NextResponse.json({ valid });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
