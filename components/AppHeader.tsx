'use client';

import Link from 'next/link';
import { useI18n } from '@/components/I18nProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AppHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-leaf-200 bg-leaf-50/90 px-4 py-3 backdrop-blur">
      <Link href="/" className="flex items-center gap-2 text-lg font-bold text-leaf-700">
        <span aria-hidden>🌿</span> Plant Seeker
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/plants"
          className="text-sm font-medium text-leaf-600 hover:text-leaf-800"
        >
          {t('nav_myPlants')}
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
