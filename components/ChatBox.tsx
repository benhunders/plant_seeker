'use client';

import { useRef, useState } from 'react';
import type { CareInfo, ChatMessage } from '@/lib/types';

export default function ChatBox({
  commonName,
  scientificName,
  care,
}: {
  commonName: string;
  scientificName: string;
  care: CareInfo;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commonName, scientificName, care, messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed.');
      setMessages([...next, { role: 'assistant', content: data.reply }]);
      requestAnimationFrame(() =>
        listEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-leaf-600">
        Ask about this plant
      </h2>

      {messages.length > 0 && (
        <div className="mb-3 max-h-72 space-y-2 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'ml-auto bg-leaf-500 text-white'
                  : 'bg-leaf-50 text-leaf-800'
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="max-w-[85%] rounded-2xl bg-leaf-50 px-3 py-2 text-sm text-leaf-600">
              Thinking…
            </div>
          )}
          <div ref={listEndRef} />
        </div>
      )}

      {error && <p className="mb-2 text-sm text-rose-600">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Why are the leaves yellow?"
          className="flex-1 rounded-xl border border-leaf-200 px-3 py-2 text-sm outline-none focus:border-leaf-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600 disabled:opacity-50"
        >
          Ask
        </button>
      </form>
    </section>
  );
}
