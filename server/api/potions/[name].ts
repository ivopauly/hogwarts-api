export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/potions/:name` endpoint
  // :name accepts the potion slug or its full name
  return findInCollection(event, 'potions');
});
