export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/characters/:name` endpoint
  // :name accepts the character slug or its full name
  return findInCollection(event, 'characters');
});
