export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/books?name=""` endpoint
  const name = getRouterParam(event, "name");

  return `Your magic book name is ${name}!`;
});
