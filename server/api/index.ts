export default defineEventHandler(async (event) => {
  // handle GET requests for the `api` endpoint — a directory of what is available
  const base = getRequestURL(event).origin;

  return {
    data: {
      name: 'Hogwarts API',
      documentation: 'https://hogwarts-api.com',
      collections: collectionNames.map(name => ({
        name,
        records: getCollection(name).length,
        list: `${base}/api/${name}`,
        detail: `${base}/api/${name}/{slug}`,
      })),
    },
  };
});
