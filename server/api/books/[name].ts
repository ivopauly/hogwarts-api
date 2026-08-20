export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/books/:name` endpoint
  // :name accepts the book slug or its full name
  return findInCollection(event, 'books');
});
