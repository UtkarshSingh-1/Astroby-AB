# AstrobyAB

AstrobyAB is a Next.js 15 app for an astrology consultation platform with admin tools, Razorpay payments, NextAuth auth, and OTP email verification.

## Tech Stack
- Next.js (App Router)
- Prisma + PostgreSQL
- NextAuth (Google + Credentials)
- Razorpay
- Nodemailer (SMTP OTP)
- Tailwind CSS

## Getting Started
```bash
npm install
npm run dev
```

## Environment Variables
Create `app/.env` with:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

DATABASE_URL=postgresql://...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM=AstrobyAB <you@example.com>

RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

NEXT_PUBLIC_APP_NAME=AstrobyAB
NEXT_PUBLIC_RAZORPAY_KEY_ID=... 
```

## Prisma
```bash
npx prisma db push
npx prisma generate
npm run prisma:seed
```

## Admin
Admin routes are under `/admin`. Access is restricted to users with role `ADMIN`.

## Payments (Razorpay)
Webhook endpoint:
```
/api/razorpay/webhook
```
Set the same `RAZORPAY_WEBHOOK_SECRET` in Razorpay dashboard and in `.env`.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:seed`
- `npm run prisma:clear-services`
- `npm run prisma:clear-consultations`
- `npm run prisma:normalize-slugs`
