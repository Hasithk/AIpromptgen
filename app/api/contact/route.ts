import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Prepare email HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
          .value { padding: 10px; background: white; border-radius: 5px; border-left: 3px solid #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Contact Form Submission</h1>
            <p>AI Prompt Generator</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="footer">
              <p>Sent from AI Prompt Generator Contact Form</p>
              <p>${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"AI Prompt Gen Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'lookinternationallk@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
      text: `
New Contact Form Submission - AI Prompt Generator

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent: ${new Date().toLocaleString()}
      `
    });

    console.log('Contact form email sent successfully to lookinternationallk@gmail.com');
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully!',
        data: {
          name,
          email,
          subject,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
