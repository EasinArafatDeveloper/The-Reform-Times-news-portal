import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { subject, title, content } = await request.json();
    
    if (!subject || !title || !content) {
      return NextResponse.json(
        { error: 'Subject, Title, and HTML Content are all required.' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch all email subscribers
    const subscribers = await db.collection('subscribers').find({}).toArray();
    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers found in the database.' },
        { status: 400 }
      );
    }
    
    const emails = subscribers.map(s => s.email).filter(Boolean);
    
    // Configure NodeMailer using environment SMTP variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    const mailOptions = {
      from: `"The Reform Times Editorial" <${process.env.SMTP_EMAIL}>`,
      bcc: emails.join(','), // Send BCC to hide subscriber emails from each other
      subject: subject,
      text: `
${title}

${content.replace(/<[^>]*>/g, '')}

Warm regards,
The Reform Times Team
      `,
      html: `
        <div style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 650px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);">
          <div style="text-align: center; border-bottom: 2px solid #b11226; padding-bottom: 20px; margin-bottom: 25px;">
            <h1 style="color: #0b1f3a; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: -0.5px;">The Reform <span style="color: #b11226;">Times</span></h1>
            <p style="color: #64748b; font-size: 11px; text-transform: uppercase; tracking-widest: 1.5px; margin: 5px 0 0 0; font-family: sans-serif; font-weight: 700;">Verified Independent Press • Editorial Dispatch</p>
          </div>
          
          <div style="color: #1e293b; line-height: 1.7; font-size: 16px;">
            <h2 style="color: #0b1f3a; font-family: sans-serif; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 18px; line-height: 1.3;">${title}</h2>
            
            <div style="margin-bottom: 30px; font-size: 15px;">
              ${content}
            </div>
            
            <p style="margin-bottom: 0; font-size: 14px; color: #64748b;">Warm regards,</p>
            <p style="font-weight: bold; color: #b11226; margin-top: 5px; font-size: 15px;">The Reform Times Editorial Team</p>
          </div>

          <div style="margin-top: 35px; background-color: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; font-size: 11px; color: #64748b; font-family: sans-serif; border: 1px solid #e2e8f0;">
            <p style="margin: 0; line-height: 1.5;">You received this email because you are a verified subscriber to The Reform Times newsroom.</p>
            <p style="margin: 6px 0 0 0; font-weight: bold; color: #b11226;">Free subscription. No spam. You can unsubscribe at any time.</p>
          </div>
        </div>
      `,
    };
    
    // Broadcast the newsletter email!
    await transporter.sendMail(mailOptions);
    
    // Log dispatch to notification history
    try {
      await db.collection('notifications').insertOne({
        title: subject,
        body: title,
        sentTo: `${subscribers.length} email subscribers`,
        createdAt: new Date(),
        status: 'Sent'
      });
    } catch (dbErr) {
      console.error('Failed to log broadcast entry:', dbErr);
    }
    
    return NextResponse.json({
      success: true,
      message: `Newsletter successfully broadcasted to ${subscribers.length} subscribers!`,
      recipientCount: subscribers.length
    });
  } catch (error: any) {
    console.error('Broadcast POST Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete email broadcast.' },
      { status: 500 }
    );
  }
}
