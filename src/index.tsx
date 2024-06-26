import { Hono } from "hono";

import { renderToString } from "react-dom/server";

import { auth } from "./api/auth";
import { chat } from "./api/chat";
import { clock } from "./api/clock";
import { user } from "./api/user";

const app = new Hono();
app.route("/api/clock", clock);
app.route("/api/chat", chat);
app.route("/api/auth", auth);
app.route("/api/user", user);

app.get("*", (c) => {
  return c.html(
    renderToString(
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          {import.meta.env.PROD ? (
            <>
              <link href="/static/assets/style.css" rel="stylesheet" />
              <script type="module" src="/static/client.js" />
            </>
          ) : (
            <>
              <link href="/src/style.css" rel="stylesheet" />
              <script type="module" src="/src/client.tsx" />
            </>
          )}
        </head>
        <body>
          <div id="root" />
        </body>
      </html>,
    ),
  );
});

export default app;
