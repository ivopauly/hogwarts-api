export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/spells/:name` endpoint
  // :name accepts the spell slug or its full name
  return findInCollection(event, 'spells');
});
