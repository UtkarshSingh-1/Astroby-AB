import nodemailer from 'nodemailer';

export const getMailer = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return { mailer: null, emailFrom: null };
  }

  const mailer = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const emailFrom = process.env.EMAIL_FROM || `AstrobyAB <${user}>`;
  return { mailer, emailFrom };
};
