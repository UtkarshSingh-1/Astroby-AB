import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const secure = process.env.SMTP_SECURE === 'true';
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!host || !port || !user || !pass) {
  throw new Error('SMTP env vars are missing. Check SMTP_HOST/PORT/USER/PASS.');
}

export const mailer = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user,
    pass,
  },
});

export const EMAIL_FROM = process.env.EMAIL_FROM || `AstrobyAB <${user}>`;
