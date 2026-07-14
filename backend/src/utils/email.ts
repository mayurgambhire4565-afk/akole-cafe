import nodemailer from 'nodemailer';
import { env } from '../config/env';
import path from 'path';
import fs from 'fs';

// Helper to find the logo path in various environments (dev, build, docker)
const getLogoPath = (): string | null => {
  const fileNames = ['logo.jpg', 'gold-logo.png'];
  const baseDirectories = [
    path.join(process.cwd(), 'src/assets'),
    path.join(process.cwd(), 'dist/assets'),
    path.join(__dirname, '../assets'),
    path.join(__dirname, '../../src/assets'),
  ];

  for (const dir of baseDirectories) {
    for (const name of fileNames) {
      const fullPath = path.join(dir, name);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
  }
  return null;
};

// Create transporter — falls back to Ethereal (test) if no credentials provided
const createTransporter = () => {
  if (env.EMAIL_USER && env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_PORT === 465,
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    });
  }
  // Log-only mode for development
  return null;
};

const transporter = createTransporter();

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const isDummyConfig = !env.EMAIL_USER || env.EMAIL_USER.includes('your_email') || !env.EMAIL_PASS || env.EMAIL_PASS.includes('your_app_password');

  if (!transporter || isDummyConfig) {
    console.log(`\n========================================`);
    console.log(`[EMAIL - DEV MODE]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html.replace(/<[^>]*>/g, '').trim()}`);
    console.log(`========================================\n`);
    return;
  }

  try {
    const logoPath = getLogoPath();
    const attachments = logoPath ? [{
      filename: path.basename(logoPath),
      path: logoPath,
      cid: 'logo'
    }] : [];

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      attachments,
    });
  } catch (error) {
    console.error(`\n[EMAIL ERROR] Failed to send email to ${to}:`, error);
    console.log(`[EMAIL - FALLBACK DEV MODE (SMTP FAILED)]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html.replace(/<[^>]*>/g, '').trim()}`);
    console.log(`========================================\n`);
  }
};

// ================================
// EMAIL TEMPLATES
// ================================

export const sendWelcomeEmail = async (to: string, name: string): Promise<void> => {
  const refCode = Date.now().toString(36).toUpperCase();
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a0f0a; color: #f5e6d3; padding: 40px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:logo" alt="Akole Cafe Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #D4AF37; margin-bottom: 15px; object-fit: cover;" />
        <h1 style="color: #D4AF37; font-family: 'Playfair Display', 'Georgia', serif; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 1px;">Akole Cafe</h1>
        <p style="color: #8b7355; margin: 8px 0 0;">Brewing Connections, Serving Memories</p>
      </div>
      <h2 style="color: #f5e6d3;">Welcome, ${name}! 🎉</h2>
      <p>Thank you for joining Akole Cafe. Your account has been successfully created.</p>
      <p>Start exploring our premium coffee selection and enjoy exclusive member benefits!</p>

      <a href="${env.FRONTEND_URL}" style="display: inline-block; background: #c8a46e; color: #1a0f0a; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">Explore Coffee</a>
      <p style="color: #8b7355; font-size: 12px; margin-top: 30px;">© 2024 Akole Cafe. All rights reserved.</p>
      <p style="color: #3d251c; font-size: 8px; margin-top: 10px; text-align: center; user-select: none;">Security Hash: ${refCode}</p>
    </div>
  `;
  await sendEmail(to, 'Welcome to Akole Cafe! ☕', html);
};

export const sendOTPEmail = async (to: string, name: string, otp: string): Promise<void> => {
  const refCode = Date.now().toString(36).toUpperCase();
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a0f0a; color: #f5e6d3; padding: 40px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:logo" alt="Akole Cafe Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #D4AF37; margin-bottom: 15px; object-fit: cover;" />
        <h1 style="color: #D4AF37; font-family: 'Playfair Display', 'Georgia', serif; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 1px;">Akole Cafe</h1>
      </div>
      <h2 style="color: #f5e6d3; font-weight: 600; font-size: 20px; border-bottom: 1px solid #3d251c; padding-bottom: 12px; margin-bottom: 20px;">Email Verification</h2>
      <p>Hi ${name}, use the OTP below to verify your email address:</p>
      <div style="background: #23150e; border: 1px solid #c8a46e; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0;">
        <p style="font-size: 42px; font-weight: 800; color: #D4AF37; letter-spacing: 10px; font-family: monospace; margin: 0;">${otp}</p>
      </div>
      <p>This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <p style="color: #8b7355; font-size: 12px; margin-top: 30px;">© 2024 Akole Cafe. All rights reserved.</p>
      <p style="color: #3d251c; font-size: 8px; margin-top: 10px; text-align: center; user-select: none;">Security Hash: ${refCode}</p>
    </div>
  `;
  await sendEmail(to, 'Your Akole Cafe OTP', html);
};

export const sendPasswordResetEmail = async (to: string, name: string, resetUrl: string): Promise<void> => {
  const refCode = Date.now().toString(36).toUpperCase();
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a0f0a; color: #f5e6d3; padding: 40px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:logo" alt="Akole Cafe Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #D4AF37; margin-bottom: 15px; object-fit: cover;" />
        <h1 style="color: #D4AF37; font-family: 'Playfair Display', 'Georgia', serif; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 1px;">Akole Cafe</h1>
      </div>
      <h2 style="color: #f5e6d3; font-weight: 600; font-size: 20px; border-bottom: 1px solid #3d251c; padding-bottom: 12px; margin-bottom: 20px;">Reset Your Password</h2>
      <p>Hi ${name}, click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background: #c8a46e; color: #1a0f0a; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">Reset Password</a>
      <p>This link expires in <strong>1 hour</strong>. If you didn't request this, please ignore this email.</p>
      <p style="color: #8b7355; font-size: 12px; margin-top: 30px;">© 2024 Akole Cafe. All rights reserved.</p>
      <p style="color: #3d251c; font-size: 8px; margin-top: 10px; text-align: center; user-select: none;">Security Hash: ${refCode}</p>
    </div>
  `;
  await sendEmail(to, 'Reset Your Akole Cafe Password', html);
};

export const sendOrderConfirmationEmail = async (
  to: string, name: string, orderNumber: string, total: number, items: Array<{ name: string; qty: number; price: number }>
): Promise<void> => {
  const refCode = Date.now().toString(36).toUpperCase();
  const itemsHtml = items
    .map(i => `<tr><td style="padding: 8px; color: #f5e6d3;">${i.name}</td><td style="padding: 8px; color: #f5e6d3; text-align:center;">${i.qty}</td><td style="padding: 8px; color: #c8a46e; text-align:right;">₹${i.price.toFixed(2)}</td></tr>`)
    .join('');

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a0f0a; color: #f5e6d3; padding: 40px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:logo" alt="Akole Cafe Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #D4AF37; margin-bottom: 15px; object-fit: cover;" />
        <h1 style="color: #D4AF37; font-family: 'Playfair Display', 'Georgia', serif; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 1px;">Akole Cafe</h1>
      </div>
      <h2>Order Confirmed! 🎉</h2>
      <p>Hi ${name}, your order <strong style="color: #c8a46e;">#${orderNumber}</strong> has been confirmed.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead><tr style="background: #2a1a10;"><th style="padding: 8px; text-align:left;">Item</th><th style="padding: 8px;">Qty</th><th style="padding: 8px; text-align:right;">Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot><tr><td colspan="2" style="padding: 8px; text-align:right; color: #c8a46e; font-weight: bold;">Total:</td><td style="padding: 8px; text-align:right; color: #c8a46e; font-weight: bold;">₹${total.toFixed(2)}</td></tr></tfoot>
      </table>
      <a href="${env.FRONTEND_URL}/orders" style="display: inline-block; background: #c8a46e; color: #1a0f0a; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Track Order</a>
      <p style="color: #8b7355; font-size: 12px; margin-top: 30px;">© 2024 Akole Cafe. All rights reserved.</p>
      <p style="color: #3d251c; font-size: 8px; margin-top: 10px; text-align: center; user-select: none;">Security Hash: ${refCode}</p>
    </div>
  `;
  await sendEmail(to, `Order Confirmed - #${orderNumber}`, html);
};

export const sendReservationConfirmationEmail = async (
  to: string,
  name: string,
  date: string,
  time: string,
  guestCount: number,
  specialRequests?: string
): Promise<void> => {
  const refCode = Date.now().toString(36).toUpperCase();
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a0f0a; color: #f5e6d3; padding: 40px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:logo" alt="Akole Cafe Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #D4AF37; margin-bottom: 15px; object-fit: cover;" />
        <h1 style="color: #D4AF37; font-family: 'Playfair Display', 'Georgia', serif; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 1px;">Akole Cafe</h1>
        <p style="color: #8b7355; margin: 8px 0 0;">Brewing Connections, Serving Memories</p>
      </div>
      <h2 style="color: #f5e6d3; text-align: center;">Table Reservation Confirmed! 🎉</h2>
      <p>Hi ${name},</p>
      <p>We are delighted to confirm your table reservation at Akole Cafe. Here are your booking details:</p>
      
      <div style="background: #2a1a10; border: 1px solid #c8a46e/20; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #8b7355; font-weight: bold; width: 40%;">Date:</td>
            <td style="padding: 6px 0; color: #f5e6d3;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #8b7355; font-weight: bold;">Time:</td>
            <td style="padding: 6px 0; color: #f5e6d3;">${time}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #8b7355; font-weight: bold;">Guests:</td>
            <td style="padding: 6px 0; color: #f5e6d3;">${guestCount} ${guestCount === 1 ? 'Person' : 'People'}</td>
          </tr>
          ${specialRequests ? `
          <tr>
            <td style="padding: 6px 0; color: #8b7355; font-weight: bold; vertical-align: top;">Special Notes:</td>
            <td style="padding: 6px 0; color: #f5e6d3; font-style: italic;">"${specialRequests}"</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #c8a46e; text-align: center; margin-top: 25px;">
        Need to change or cancel? Contact us at <a href="https://wa.me/918432387067" style="color: #c8a46e; text-decoration: underline;">+91 8432387067</a>
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${env.FRONTEND_URL}" style="display: inline-block; background: #c8a46e; color: #1a0f0a; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Visit Website</a>
      </div>

      <p style="color: #8b7355; font-size: 12px; margin-top: 30px; text-align: center;">© 2024 Akole Cafe. All rights reserved.</p>
      <p style="color: #3d251c; font-size: 8px; margin-top: 10px; text-align: center; user-select: none;">Security Hash: ${refCode}</p>
    </div>
  `;
  await sendEmail(to, 'Table Reservation Confirmed - Akole Cafe ☕', html);
};

