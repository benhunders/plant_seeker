import Anthropic from '@anthropic-ai/sdk';

/**
 * Shared server-side Anthropic client. The SDK reads ANTHROPIC_API_KEY from the
 * environment. This module must never be imported into client components — the
 * key stays on the server.
 */
export const anthropic = new Anthropic();

/** Vision-capable model used for identification and chat. */
export const MODEL = 'claude-opus-4-8';
