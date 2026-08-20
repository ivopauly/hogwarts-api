export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/creatures` endpoint
  // supports ?search=, ?page= and ?page_size= (max 100)
  return listCollection(event, 'creatures');
});
