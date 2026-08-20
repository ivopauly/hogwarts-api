export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/potions` endpoint
  // supports ?search=, ?page= and ?page_size= (max 100)
  return listCollection(event, 'potions');
});
