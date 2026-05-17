import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import { sendArticlePushNotification } from '@/lib/push-helper';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    
    // Auto-clean any seeded placeholder mock views (both numbers and strings) to 0!
    await db.collection('articles').updateMany(
      { views: { $in: [310, 450, 620, 980, 1250, '310', '450', '620', '980', '1250'] } },
      { $set: { views: 0 } }
    );
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const lang = searchParams.get('lang');
    const q = searchParams.get('q');
    const type = searchParams.get('type');

    let query: any = {};
    if (category && category !== 'All') query.category = category;
    if (type && type !== 'All') query.type = type;
    if (status && status !== 'All') {
      query.status = status;
    }
    // Note: For public site view (no status query provided or non-admin calls), show only Published articles
    if (!status) {
      query.$or = [
        { status: 'Published' },
        { status: 'published' }
      ];
    }

    if (q) {
      query.$or = [
        { 'title.bn': { $regex: q, $options: 'i' } },
        { 'title.en': { $regex: q, $options: 'i' } },
        { 'excerpt.bn': { $regex: q, $options: 'i' } },
        { 'excerpt.en': { $regex: q, $options: 'i' } },
        { 'content.bn': { $regex: q, $options: 'i' } },
        { 'content.en': { $regex: q, $options: 'i' } }
      ];
    }

    const articles = await db.collection('articles')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const body = await req.json();

    // Fetch active owner profile to attach to new articles
    const settings = await db.collection('site_settings').findOne({ type: 'owner_profile' });
    const authorProfile = settings ? {
      name: settings.name,
      avatar: settings.avatar || '',
      role: settings.role?.en || 'Editor',
      bio: settings.bio?.en || ''
    } : {
      name: 'Kazi Salman',
      avatar: '',
      role: 'Editor',
      bio: ''
    };

    const newArticle = {
      ...body,
      author: body.author || authorProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      featured: body.featured || false,
      breaking: body.breaking || false,
      trending: body.trending || false,
      // Support frontend provided bilingual slug object
      slug: body.slug || {
        bn: body.title?.bn ? body.title.bn.toLowerCase().replace(/[^\w\u0980-\u09FF ]+/g, '').replace(/ +/g, '-') : '',
        en: body.title?.en ? body.title.en.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : ''
      }
    };

    const result = await db.collection('articles').insertOne(newArticle);

    // If published and sendPush checkmark is checked, trigger web push notifications
    if ((newArticle.status === 'Published' || newArticle.status === 'published') && body.sendPush) {
      try {
        await sendArticlePushNotification({ ...newArticle, id: result.insertedId.toString() });
      } catch (pushErr) {
        console.error('Failed to trigger web push notification:', pushErr);
      }
    }

    // If published, automatically broadcast to all subscribers
    if (newArticle.status === 'Published' || newArticle.status === 'published') {
      try {
        const subscribers = await db.collection('subscribers').find({}).toArray();
        const emails = subscribers.map(s => s.email).filter(Boolean);

        if (emails.length > 0) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.SMTP_EMAIL,
              pass: process.env.SMTP_PASSWORD,
            },
          });

          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          const articleUrlBn = `${baseUrl}/bn/news/${newArticle.slug?.bn || ''}`;
          const articleUrlEn = `${baseUrl}/en/news/${newArticle.slug?.en || ''}`;

          const mailOptions = {
            from: `"The Reform Times Newsroom" <${process.env.SMTP_EMAIL}>`,
            bcc: emails, // Performant and private!
            subject: `[New Article] ${newArticle.title?.en || newArticle.title?.bn}`,
            text: `
A new article has been published in The Reform Times Newsroom!

English: ${newArticle.title?.en || ''}
Read more: ${articleUrlEn}

Bangla: ${newArticle.title?.bn || ''}
পড়ুন: ${articleUrlBn}
            `,
            html: `
              <div style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; border-bottom: 2px solid #b11226; padding-bottom: 20px;">
                  <h1 style="color: #0b1f3a; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">The Reform <span style="color: #b11226;">Times</span></h1>
                  <p style="color: #64748b; font-size: 12px; text-transform: uppercase; tracking-widest: 1.5px; margin: 5px 0 0 0; font-family: sans-serif; font-weight: 700;">Verified Independent Press</p>
                </div>
                
                <div style="padding: 30px 10px; color: #334155; line-height: 1.6; font-size: 16px;">
                  <span style="display: inline-block; background-color: #b11226; color: #ffffff; font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 20px;">New Publication</span>
                  
                  <!-- EN Content -->
                  <h2 style="color: #0b1f3a; font-family: 'Georgia', serif; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 10px; line-height: 1.3;">
                    ${newArticle.title?.en || ''}
                  </h2>
                  <p style="color: #64748b; font-size: 13px; margin-top: 0; margin-bottom: 20px;">
                    Category: ${newArticle.category || 'General'}
                  </p>
                  
                  <div style="text-align: left; margin-bottom: 30px;">
                    <a href="${articleUrlEn}" style="display: inline-block; background-color: #b11226; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; font-family: sans-serif;">Read English Article &rarr;</a>
                  </div>

                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

                  <!-- BN Content -->
                  <h2 style="color: #0b1f3a; font-family: 'Georgia', serif; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 10px; line-height: 1.3;">
                    ${newArticle.title?.bn || ''}
                  </h2>
                  <p style="color: #64748b; font-size: 13px; margin-top: 0; margin-bottom: 20px;">
                    বিভাগ: ${newArticle.category || 'সাধারণ'}
                  </p>
                  
                  <div style="text-align: left; margin-bottom: 20px;">
                    <a href="${articleUrlBn}" style="display: inline-block; background-color: #0b1f3a; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; font-family: sans-serif;">বাংলা সংস্করণ পড়ুন &rarr;</a>
                  </div>
                </div>

                <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; font-size: 11px; color: #64748b; font-family: sans-serif; border: 1px solid #e2e8f0; margin-top: 20px;">
                  <p style="margin: 0;">You received this because you subscribed to The Reform Times newsroom notifications.</p>
                  <p style="margin: 5px 0 0 0;">Free subscription. No spam. You can unsubscribe at any time.</p>
                </div>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
        }
      } catch (broadcastErr) {
        console.error('Newsletter broadcast failed:', broadcastErr);
      }
    }

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.error('Error creating article:', error);
    const isMongoErr = errMsg.includes('Mongo') || errMsg.includes('SSL') || errMsg.includes('connect') || errMsg.includes('topology');
    return NextResponse.json({ 
      error: isMongoErr ? 'Database Connection Refused: Please whitelist your IP in MongoDB Atlas.' : 'Failed to create article', 
      details: errMsg 
    }, { status: 500 });
  }
}
