import { NextRequest, NextResponse } from 'next/server';
import { anthropic, MODEL } from '@/lib/anthropic';
import type { IdentifyResult } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SUPPORTED_MEDIA = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

/** Split a data URL ("data:image/png;base64,....") into media type + base64. */
function parseDataUrl(dataUrl: string): { mediaType: string; data: string } | null {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl);
  if (!match) return null;
  return { mediaType: match[1], data: match[2] };
}

const INSTRUCTION = `You are a friendly, expert houseplant and garden helper. Look at the photo and identify the plant.

Respond with ONLY a single JSON object (no markdown, no code fences, no commentary) with exactly this shape:
{
  "identified": boolean,
  "message": string,            // "" when identified is true; a short kind explanation when false
  "commonName": string,
  "scientificName": string,
  "confidence": "high" | "medium" | "low",
  "care": {
    "light": string,
    "water": string,
    "soil": string,
    "humidity": string,
    "temperature": string,
    "difficulty": "easy" | "moderate" | "hard",
    "summary": string           // one actionable sentence for a first-time owner
  },
  "schedule": [                 // 2-4 recurring care tasks
    { "type": "water" | "fertilize" | "rotate" | "repot" | "mist", "label": string, "intervalDays": number }
  ]
}

If the image clearly shows a plant, set "identified" to true and fill everything in with short, practical, beginner-friendly guidance. Use realistic intervals (e.g. water every 7 days, rotate every 14, fertilize every 30) and keep labels short and encouraging.

If the image does NOT show a plant, or is too blurry/dark to tell, set "identified" to false, put a short kind explanation in "message", set the string fields to "", confidence to "low", difficulty to "easy", and "schedule" to [].`;

/** Extract a JSON object from model text, tolerating stray prose or code fences. */
function extractJson(text: string): string {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in model response.');
  }
  return candidate.slice(start, end + 1);
}

export async function POST(req: NextRequest) {
  let body: { image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body.image) {
    return NextResponse.json({ error: 'Missing "image".' }, { status: 400 });
  }

  const parsed = parseDataUrl(body.image);
  if (!parsed || !SUPPORTED_MEDIA.has(parsed.mediaType)) {
    return NextResponse.json(
      { error: 'Please upload a JPEG, PNG, WEBP, or GIF image.' },
      { status: 400 },
    );
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: parsed.mediaType as
                  | 'image/jpeg'
                  | 'image/png'
                  | 'image/webp'
                  | 'image/gif',
                data: parsed.data,
              },
            },
            { type: 'text', text: INSTRUCTION },
          ],
        },
      ],
    });

    if (response.stop_reason === 'refusal') {
      return NextResponse.json(
        {
          identified: false,
          message:
            "I couldn't process that image. Try a clear, well-lit photo of a single plant.",
        } satisfies Partial<IdentifyResult>,
        { status: 200 },
      );
    }

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text content in model response.');
    }

    const result = JSON.parse(extractJson(textBlock.text)) as IdentifyResult;
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('identify error', err);
    return NextResponse.json(
      { error: 'Something went wrong identifying the plant. Please try again.' },
      { status: 500 },
    );
  }
}
