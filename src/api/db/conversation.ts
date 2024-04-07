import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import * as schema from "../../schema";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const conv = new Hono<{ Bindings: Bindings }>();

conv.use("/*", (c, next) => {
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

conv.get("/:id", async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB, { schema });
  const result = await db.query.conversation.findFirst({
    where: (conv, { eq }) => eq(conv.id, id),
  });
  return c.json(result);
});

conv.post("/", async (c) => {
  const req = await c.req.json<typeof schema.conversation.$inferInsert>();
  const db = drizzle(c.env.DB, { schema });
  const result = await db.insert(schema.conversation).values(req);
  return c.json(result);
});

conv.put("/:id", async (c) => {
  const id = c.req.param("id");
  const req = await c.req.json<typeof schema.conversation.$inferInsert.body>();
  const db = drizzle(c.env.DB, { schema });
  const result = await db
    .update(schema.conversation)
    .set({ id: id, body: req });
  return c.json(result);
});

conv.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB, { schema });
  const result = await db
    .delete(schema.conversation)
    .where(eq(schema.conversation.id, id));
  return c.json(result);
});

export { conv };
