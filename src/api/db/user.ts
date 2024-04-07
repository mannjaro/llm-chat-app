import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { decode } from "hono/jwt";
import * as schema from "../../schema";

import { eq } from "drizzle-orm";
import { type JwtPayload, useAuth } from "../../hooks/cognito";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const user = new Hono<{ Bindings: Bindings }>();

user.use("/*", (c, next) => {
  let secret = "";
  if (import.meta.env.DEV) {
    secret = import.meta.env.VITE_APP_JWT_SECRET;
  } else {
    const JWT_SECRET = c.env.JWT_SECRET;
    secret = JWT_SECRET;
  }
  const jwtMiddleware = jwt({
    secret: secret,
  });
  return jwtMiddleware(c, next);
});

user.get("/:id", async (c) => {
  const { jwt } = useAuth();
  const token: { payload: JwtPayload } = decode(jwt);
  const id = token.payload.sub;
  if (id !== c.req.param("id")) {
    c.status(401);
    return c.text("Request ID is invalid", 401);
  }
  const db = drizzle(c.env.DB, { schema });
  const result = await db.query.user.findMany({
    with: {
      conversations: {
        columns: {
          id: true,
        },
      },
    },
    where: (user, { eq }) => eq(user.id, id),
  });
  return c.json(result);
});

user.post("/", async (c) => {
  const req = await c.req.json<typeof schema.user.$inferInsert>();
  const db = drizzle(c.env.DB);
  const result = await db.insert(schema.user).values(req);
  return c.json(result);
});

user.put("/:id", async (c) => {
  const id = c.req.param("id");
  const req = await c.req.json<typeof schema.user.$inferInsert>();
  const db = drizzle(c.env.DB);
  const result = await db
    .update(schema.user)
    .set({ id: id, email: req.email, name: req.name });
  return c.json(result);
});

user.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const result = await db.delete(schema.user).where(eq(schema.user.id, id));
  return c.json(result);
});

export { user };
