import { Hono } from "hono";

const clock = new Hono();
clock.get("/", (c) => {
  return c.json({
    time: new Date().toLocaleTimeString(),
  });
});

export { clock };
