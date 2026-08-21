// Adds the house-elf flourishes to every API response.
//
// Scoped to the /api surface on purpose: these headers are a nod to API consumers,
// and stamping them onto every HTML document and asset request would be noise.
// Nuxt's own internal endpoints (/api/_content, /api/_mdc) are skipped for the
// same reason — they are framework plumbing, not our public API.

const HOUSES = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"] as const;

export default defineEventHandler((event) => {
  const { pathname } = getRequestURL(event);

  if (pathname !== "/api" && !pathname.startsWith("/api/")) return;
  if (pathname.startsWith("/api/_")) return;

  // Re-sorted on every request, which is the joke. It also means responses are
  // not byte-identical between calls — harmless here, but worth knowing if a
  // cache is ever keyed on the full response.
  const house = HOUSES[Math.floor(Math.random() * HOUSES.length)]!;

  setResponseHeader(event, "X-Sorting-Hat", house);
  setResponseHeader(event, "X-Wizard-Status", "Certified Wizard");
  setResponseHeader(event, "X-Deployment-Location", "The Room of Requirement");
});
