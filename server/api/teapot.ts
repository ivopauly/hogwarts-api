export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/teapot` endpoint
  //
  // The only reachable 418 in the API. Every other themed status code exists in
  // server/utils/magicError.ts but has no natural trigger on a public, read-only,
  // unthrottled API, so this route gives one of them somewhere to live.
  magicError(418, "This endpoint is a teapot and cannot brew coffee. Try Honeydukes.");
});
