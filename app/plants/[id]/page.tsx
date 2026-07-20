'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';
import CareCard from '@/components/CareCard';
import ScheduleList from '@/components/ScheduleList';
import ChatBox from '@/components/ChatBox';
import { usePlants } from '@/lib/storage';
import { completeTask } from '@/lib/schedule';

export default function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { plants, ready, updatePlant, removePlant } = usePlants();
  const plant = plants.find((p) => p.id === id);

  if (!ready) {
    return <p className="py-10 text-center text-leaf-600">Loading…</p>;
  }

  if (!plant) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-leaf-700">That plant wasn&apos;t found.</p>
        <Link
          href="/plants"
          className="rounded-xl bg-leaf-500 px-5 py-2.5 font-semibold text-white hover:bg-leaf-600"
        >
          Back to my plants
        </Link>
      </div>
    );
  }

  function markDone(taskId: string) {
    updatePlant(id, (p) => ({
      ...p,
      schedule: p.schedule.map((t) => (t.id === taskId ? completeTask(t) : t)),
    }));
  }

  function handleDelete() {
    if (window.confirm(`Remove ${plant!.nickname || plant!.commonName}?`)) {
      removePlant(id);
      router.push('/plants');
    }
  }

  return (
    <div className="space-y-4 pb-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={plant.imageDataUrl}
        alt={plant.commonName}
        className="h-56 w-full rounded-2xl object-cover shadow"
      />
      <div>
        <h1 className="text-2xl font-bold text-leaf-800">
          {plant.nickname || plant.commonName}
        </h1>
        <p className="italic text-leaf-600">{plant.scientificName}</p>
      </div>

      <CareCard care={plant.care} />

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-leaf-600">
          Care schedule
        </h2>
        <ScheduleList schedule={plant.schedule} onComplete={markDone} />
      </section>

      <ChatBox
        commonName={plant.commonName}
        scientificName={plant.scientificName}
        care={plant.care}
      />

      <button
        onClick={handleDelete}
        className="w-full rounded-xl border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
      >
        Remove plant
      </button>
    </div>
  );
}
