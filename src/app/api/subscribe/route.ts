import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if already subscribed
    const existing = await db.collection('subscribers').findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsroom!' },
        { status: 400 }
      );
    }

    // Insert new subscriber
    await db.collection('subscribers').insertOne({
      email: email.toLowerCase(),
      createdAt: new Date(),
    });

    // Send congratulatory email using nodemailer
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"The Reform Times Newsroom" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Welcome to The Reform Times Newsroom!',
        text: `
Dear Reader,

Thank you for subscribing to The Reform Times!

We are absolutely thrilled to welcome you to our newsroom. As a valued subscriber, you will now receive the latest news, exclusive investigative reports, important public updates, and weekly stories directly in your inbox.

Thank you for supporting independent, honest journalism.

Best regards,
The Reform Times Team
        `,
        html: `
          <div style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #b11226; padding-bottom: 20px;">
              <h1 style="color: #0b1f3a; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">The Reform <span style="color: #b11226;">Times</span></h1>
              <p style="color: #64748b; font-size: 12px; text-transform: uppercase; tracking-widest: 1.5px; margin: 5px 0 0 0; font-family: sans-serif; font-weight: 700;">Verified Independent Press</p>
            </div>
            
            <div style="padding: 30px 10px; color: #334155; line-height: 1.6; font-size: 16px;">
              <h2 style="color: #0b1f3a; font-family: sans-serif; font-size: 20px; font-weight: 700; margin-top: 0;">Welcome to our Newsroom!</h2>
              <p>Dear Reader,</p>
              <p>Thank you for subscribing to <strong>The Reform Times</strong>!</p>
              <p>We are absolutely thrilled to welcome you to our growing community. As a subscriber, you are supporting independent, honest, and investigative journalism. You will now receive the latest breaking news, vital public interest updates, and weekly stories directly in your inbox.</p>
              <p style="margin-bottom: 0;">Warm regards,</p>
              <p style="font-weight: bold; color: #b11226; margin-top: 5px;">The Reform Times Editorial Team</p>
            </div>

            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; font-size: 12px; color: #64748b; font-family: sans-serif; border: 1px solid #e2e8f0;">
              <p style="margin: 0;">This email was sent to ${email} because you signed up for The Reform Times newsletter.</p>
              <p style="margin: 5px 0 0 0;">Free subscription. No spam. You can unsubscribe at any time.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      // Log the error but don't break the user's subscription success flow
      console.error('Failed to send confirmation email:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to The Reform Times newsroom!',
    });
  } catch (error: any) {
    console.error('Subscription Error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
