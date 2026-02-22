import '../index.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AstrobyAB',
  description: 'Vedic astrology services and consultations',
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-stone-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
