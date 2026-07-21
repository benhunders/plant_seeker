'use client';

import { useI18n } from '@/components/I18nProvider';
import { LOCALES, isLocale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="flex items-center">
      <span className="sr-only">{t('lang_aria')}</span>
      <select
        aria-label={t('lang_aria')}
        value={locale}
        onChange={(e) => {
          const next = e.target.value;
          if (isLocale(next)) setLocale(next);
        }}
        className="rounded-lg border border-leaf-300 bg-white px-2 py-1 text-sm font-medium text-leaf-700 outline-none focus:border-leaf-500"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
