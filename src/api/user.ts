import { drizzle } from "drizzle-orm/d1";
import * as schema from "../schema";
import { Hono } from "hono";
import { jwt } from "hono/jwt";

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

user.get("/", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const result = await db.query.user.findMany();
  return c.json(result);
});

user.get("/:id", async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB, { schema });
  const result = await db.query.user.findMany({
    where: (user, { eq }) => eq(user.id, id),
  });
  return c.json(result);
});

user.post("/", async (c) => {
  const req = await c.req.json<typeof schema.user.$inferInsert>();
  const db = drizzle(c.env.DB);
  const result = await db.insert(schema.user).values(req).execute();
  c.status(200);
  return c.text("");
});

user.put("/:id", async (c) => {
  const req = await c.req.json<typeof schema.user.$inferInsert>();
  const db = drizzle(c.env.DB);
  const result = await db.update(schema.user).set(req).execute();
  c.status(200);
  return c.text("");
});

user.delete("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.delete(schema.user).execute();
  c.status(200);
  return c.text("");
});

export { user };
