import { Hono } from "hono";
import { renderToString } from "react-dom/server";

import { clock } from "./api/clock";
import { chat } from "./api/chat";
import { auth } from "./api/auth";
import { db } from "./api/db";

const app = new Hono();
app.route("/api/clock", clock);
app.route("/api/chat", chat);
app.route("/api/auth", auth);
app.route("/api/db", db);

app.get("*", (c) => {
  return c.html(
    renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link
            rel="stylesheet"
            href="https://cdn.simplecss.org/simple.min.css"
          />
          {import.meta.env.PROD ? (
            <>
              <script type="module" src="/static/client.js"></script>
            </>
          ) : (
            <>
              <script type="module" src="/src/client.tsx"></script>
            </>
          )}
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    )
  );
});

export default app;
