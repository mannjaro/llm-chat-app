import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { env } from "hono/adapter";

import OpenAI from "openai";
import { Message } from "../components/ChatWindow";
import { jwt } from "hono/jwt";

const chat = new Hono();

chat.use("/*", (c, next) => {
  var secret = "";
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
  var apiKey = "";
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
      model: "gpt-3.5-turbo",
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
