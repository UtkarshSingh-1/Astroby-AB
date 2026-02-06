import '../src/index.css';
import Providers from './providers';

export const metadata = {
  title: 'AstrobyAB',
  description: 'Vedic astrology services and consultations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-stone-50" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
