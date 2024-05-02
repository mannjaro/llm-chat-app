import { Hono } from "hono";
import { env } from "hono/adapter";
import { streamText } from "hono/streaming";

import { jwt } from "hono/jwt";
import OpenAI from "openai";
import type { Message } from "../components/ChatWindow";

const chat = new Hono();

chat.use("/*", (c, next) => {
  let secret = "";
  if (import.meta.env.DEV) {
    secret = import.meta.env.VITE_APP_JWT_SECRET;
  } else {
    const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
    secret = JWT_SECRET;
  }
  const jwtMiddleware = jwt({
    secret: secret,
  });
  return jwtMiddleware(c, next);
});

chat.post("/", async (c) => {
  let apiKey = "";
  if (import.meta.env.DEV) {
    apiKey = import.meta.env.VITE_APP_OPENAI_API_KEY;
  } else {
    const { OPENAI_API_KEY } = env<{ OPENAI_API_KEY: string }>(c);
    apiKey = OPENAI_API_KEY;
  }
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  const body = await c.req.json<{ message: string; messages: Message[] }>();
  return streamText(c, async (stream) => {
    const chatStream = openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo-0125",
      messages: [...body.messages, { role: "user", content: body.message }],
      stream: true,
    });
    for await (const message of chatStream) {
      stream.write(message.choices[0].delta.content || "");
    }

    stream.close();
  });
});

export { chat };
