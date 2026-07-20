'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Plant } from './types';

const KEY = 'plant-seeker:plants';

function readAll(): Plant[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Plant[]) : [];
  } catch {
    return [];
  }
}

function writeAll(plants: Plant[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(plants));
}

/**
 * React hook wrapping the plant collection in localStorage. Loads on mount
 * (avoids SSR hydration mismatch), keeps an in-memory copy, and persists on
 * every mutation. `ready` flips true once the initial load has happened.
 */
export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlants(readAll());
    setReady(true);
  }, []);

  const persist = useCallback((next: Plant[]) => {
    setPlants(next);
    writeAll(next);
  }, []);

  const addPlant = useCallback(
    (plant: Plant) => {
      persist([plant, ...readAll()]);
    },
    [persist],
  );

  const updatePlant = useCallback(
    (id: string, updater: (p: Plant) => Plant) => {
      persist(readAll().map((p) => (p.id === id ? updater(p) : p)));
    },
    [persist],
  );

  const removePlant = useCallback(
    (id: string) => {
      persist(readAll().filter((p) => p.id !== id));
    },
    [persist],
  );

  return { plants, ready, addPlant, updatePlant, removePlant };
}

export function getPlant(id: string): Plant | undefined {
  return readAll().find((p) => p.id === id);
}
