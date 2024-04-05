import { Hono } from "hono";
import { env } from "hono/adapter";
import { sign } from "hono/jwt";
const auth = new Hono();

type Payload = {
  readonly sub: string;
  readonly role: string;
  readonly exp: number;
};

auth.post("/", async (c) => {
  const payload = await c.req.json<Payload>();
  var secret = "";
  if (import.meta.env.DEV) {
    secret = import.meta.env.VITE_APP_JWT_SECRET;
  } else {
    const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
    secret = JWT_SECRET;
  }
  const token = await sign(payload, secret);
  return c.json({ jwt: token });
});

export { auth };
