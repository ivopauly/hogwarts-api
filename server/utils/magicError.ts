// Wizarding-world personality for HTTP errors.
//
// Auto-imported by Nitro, so route handlers call `magicError(...)` directly.
//
// The themed line replaces `statusMessage`, which is what a human reads. The
// precise, boring reason is preserved in `data.reason` so the API stays
// debuggable — an error that only says "Peeves has hidden this page" tells a
// developer nothing about which slug they got wrong.

const MAGIC_MESSAGES: Record<number, string> = {
  400: "That incantation was mispronounced. Check your wand movement and try again.",
  401: "The Fat Lady demands the password.",
  403: "Underage Wizardry detected! The Ministry of Magic has been notified.",
  404: "Peeves has hidden this page. Try checking the trophy room.",
  418: "I am currently a transfigured teapot (McGonagall's class went wrong).",
  429: "Too many owls! Our owlery is currently flooded with mail.",
  500: "A rogue Bludger has hit the server. Our house-elves are working on it.",
};

const FALLBACK = "Something went wrong in the Department of Mysteries.";

export type MagicStatusCode = 400 | 401 | 403 | 404 | 418 | 429 | 500;

/**
 * Throw an H3 error carrying a themed `statusMessage` and the real cause.
 *
 * @param statusCode HTTP status to send.
 * @param reason     The literal explanation, surfaced as `data.reason`.
 *
 * Returns `never` — it always throws, so TypeScript narrows correctly after a
 * call and callers do not need to write `throw magicError(...)`.
 */
export function magicError(statusCode: MagicStatusCode, reason?: string): never {
  throw createError({
    statusCode,
    statusMessage: MAGIC_MESSAGES[statusCode] ?? FALLBACK,
    data: reason ? { reason } : undefined,
  });
}

/** The themed line for a status code, without throwing. Used by the docs page. */
export function magicMessage(statusCode: number): string {
  return MAGIC_MESSAGES[statusCode] ?? FALLBACK;
}
