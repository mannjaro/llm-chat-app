import { Hono } from "hono";
import { env } from "hono/adapter";
import { sign } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

import { CognitoJwtVerifier } from "aws-jwt-verify";

import { config } from "../../amplify.configure";

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: config.Auth?.Cognito.userPoolId || "",
  tokenUse: "access",
  clientId: config.Auth?.Cognito.userPoolClientId || "",
});

const auth = new Hono();

type Payload = {
  readonly token: string;
  readonly sub: string;
  readonly role: string;
  readonly exp: number;
};

auth.post("/", async (c) => {
  const payload = await c.req.json<Payload>();
  var secret = "";
  try {
    const verify = await verifier.verify(payload.token);
  } catch (e) {
    throw new HTTPException(401, {
      message: "Cognito JWT is Invalid",
      cause: e,
    });
  }
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
