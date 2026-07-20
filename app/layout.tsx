import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
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
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-leaf-200 bg-leaf-50/90 px-4 py-3 backdrop-blur">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-leaf-700">
              <span aria-hidden>🌿</span> Plant Seeker
            </Link>
            <Link
              href="/plants"
              className="text-sm font-medium text-leaf-600 hover:text-leaf-800"
            >
              My plants
            </Link>
          </header>
          <main className="flex-1 px-4 py-5">{children}</main>
        </div>
      </body>
    </html>
  );
}
