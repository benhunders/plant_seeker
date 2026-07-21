'use client';

import { useRef, useState } from 'react';
import { useI18n } from '@/components/I18nProvider';

const TASK_ICON = '📷';

/**
 * Reads a File into a compressed JPEG data URL. Downscaling keeps localStorage
 * small and the identify request under body limits, while staying sharp enough
 * for the model.
 */
function fileToDataUrl(file: File, maxEdge = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported.'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Could not read the image.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });
}

export default function CameraCapture({
  onCapture,
  disabled,
}: {
  onCapture: (dataUrl: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      onCapture(dataUrl);
    } catch {
      setError(t('capture_readError'));
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf-500 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-leaf-600 disabled:opacity-50"
      >
        <span aria-hidden>{TASK_ICON}</span>
        {t('capture_identify')}
      </button>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
