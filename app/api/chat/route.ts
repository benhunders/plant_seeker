import { NextRequest, NextResponse } from 'next/server';
import { anthropic, MODEL } from '@/lib/anthropic';
import type { CareInfo, ChatMessage } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

type ChatBody = {
  commonName?: string;
  scientificName?: string;
  care?: CareInfo;
  messages?: ChatMessage[];
};

export async function POST(req: NextRequest) {
  let body: ChatBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
  }

  const careContext = body.care
    ? `Known care profile:
- Light: ${body.care.light}
- Water: ${body.care.water}
- Soil: ${body.care.soil}
- Humidity: ${body.care.humidity}
- Temperature: ${body.care.temperature}
- Difficulty: ${body.care.difficulty}
- Summary: ${body.care.summary}`
    : 'No stored care profile is available.';

  const system = `You are a warm, practical plant-care assistant helping someone look after their ${
    body.commonName || 'plant'
  }${body.scientificName ? ` (${body.scientificName})` : ''}.

${careContext}

Answer the owner's questions with short, concrete, encouraging guidance. Prefer plain language over jargon. If a question is outside plant care, gently steer back. Keep answers to a few sentences unless more detail is clearly needed.`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const reply =
      textBlock && textBlock.type === 'text'
        ? textBlock.text
        : "Sorry, I couldn't come up with an answer just now.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error('chat error', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
