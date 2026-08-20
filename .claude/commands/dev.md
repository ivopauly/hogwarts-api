---
description: Start the Nuxt dev server and smoke-test the API endpoints
allowed-tools: Bash(npm run dev:*), Bash(curl:*), Bash(lsof:*), Bash(jq:*)
---

Start the Hogwarts API dev server and confirm it is actually serving.

1. Check nothing is already on port 3000: `lsof -i :3000 | head`.
   If something is, report it and stop — do not kill the user's process.
2. Start the server in the background: `npm run dev`.
3. Wait for it to report `Local: http://localhost:3000`.
4. Smoke-test the routes and show me the results:
   ```bash
   curl -s -o /dev/null -w 'GET /              %{http_code}\n' http://localhost:3000/
   curl -s -o /dev/null -w 'GET /api/movies    %{http_code}\n' http://localhost:3000/api/movies
   curl -s -o /dev/null -w 'GET /api/books     %{http_code}\n' http://localhost:3000/api/books
   curl -s -o /dev/null -w 'GET /api/books/hp1 %{http_code}\n' http://localhost:3000/api/books/hp1
   ```
5. Report the URL, the status codes, and any warnings from the Nuxt startup output.
   Leave the server running.

$ARGUMENTS
