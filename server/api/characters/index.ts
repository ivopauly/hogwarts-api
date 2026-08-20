export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/characters` endpoint
  // supports ?search=, ?page= and ?page_size= (max 100)
  return listCollection(event, 'characters');
});
