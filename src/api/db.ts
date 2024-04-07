import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const db = new Hono<{ Bindings: Bindings }>();

export { db };
