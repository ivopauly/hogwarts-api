export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/creatures/:name` endpoint
  // :name accepts the creature slug or its full name
  return findInCollection(event, 'creatures');
});
