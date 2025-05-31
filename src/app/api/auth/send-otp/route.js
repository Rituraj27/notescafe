import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs temporarily (in production, use Redis or a database)
const otpStore = new Map();

export async function POST(req) {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials are not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log('Generated OTP for:', email); // Debug log

    // Store OTP with 10 minutes expiry
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Email template
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your Gmail address
      to: email,
      subject: 'Your Verification Code - NotesCafe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #981d12; margin: 0;">NotesCafe</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Verification Code</h2>
            <p style="color: #666; margin-bottom: 20px;">Your verification code is:</p>
            <div style="background-color: #fff; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; color: #981d12; letter-spacing: 5px; margin-bottom: 20px;">
              ${otp}
            </div>
            <p style="color: #666; margin-bottom: 0;">This code will expire in 10 minutes.</p>
          </div>
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>If you didn't request this code, please ignore this email.</p>
            <p>© ${new Date().getFullYear()} NotesCafe. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully to:', email); // Debug log
    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP: ' + error.message },
      { status: 500 }
    );
  }
}

// Export the OTP store for verification
export { otpStore };
