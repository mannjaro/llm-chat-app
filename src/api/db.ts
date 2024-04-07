import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
};

const db = new Hono<{ Bindings: Bindings }>();

export { db };
