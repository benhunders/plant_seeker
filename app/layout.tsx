import type { Metadata, Viewport } from 'next';
import { I18nProvider } from '@/components/I18nProvider';
import AppHeader from '@/components/AppHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plant Seeker',
  description: 'Snap a photo, identify your plant, and learn how to care for it.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#42903b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
            <AppHeader />
            <main className="flex-1 px-4 py-5">{children}</main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
