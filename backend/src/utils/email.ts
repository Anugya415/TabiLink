"use strict";

import nodemailer from 'nodemailer';

type SendEmailOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

// Create a reusable transporter using SMTP settings from env vars.
// This keeps the transport setup in one place and allows swapping providers easily.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: (process.env.EMAIL_SECURE || 'false').toLowerCase() === 'true',
  auth: process.env.EMAIL_USER
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    : undefined,
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: SendEmailOptions): Promise<void> {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    // Skip sending if email is not configured
    console.warn('Email not sent: EMAIL_HOST/EMAIL_USER not configured');
    return;
  }

  await transporter.sendMail({
    from: from || process.env.EMAIL_FROM || '"TabiLink" <no-reply@tabilink.com>',
    to,
    subject,
    text,
    html,
  });
}









