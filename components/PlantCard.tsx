'use client';

import Link from 'next/link';
import type { Plant } from '@/lib/types';
import { dueToday } from '@/lib/schedule';
import { useI18n } from '@/components/I18nProvider';

export default function PlantCard({ plant }: { plant: Plant }) {
  const { t } = useI18n();
  const dueCount = dueToday([plant]).length;
  return (
    <Link
      href={`/plants/${plant.id}`}
      className="flex items-center gap-3 rounded-2xl border border-leaf-200 bg-white p-3 shadow-sm transition hover:border-leaf-400"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={plant.imageDataUrl}
        alt={plant.commonName}
        className="h-16 w-16 rounded-xl object-cover"
      />
      <div className="flex-1">
        <p className="font-semibold text-leaf-800">
          {plant.nickname || plant.commonName}
        </p>
        <p className="text-xs italic text-leaf-600">{plant.scientificName}</p>
      </div>
      {dueCount > 0 && (
        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-600">
          {t('plant_due', { n: dueCount })}
        </span>
      )}
    </Link>
  );
}
