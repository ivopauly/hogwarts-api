export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/movies/:name` endpoint
  // :name accepts the movie slug or its full name
  return findInCollection(event, 'movies');
});
