import { create } from "zustand";
import {
  signIn,
  SignInInput,
  SignInOutput,
  confirmSignIn,
  ConfirmSignInInput,
  signOut,
  fetchAuthSession,
} from "aws-amplify/auth";

type SignInRes = {
  isSuccess: boolean;
  isSignedIn: boolean;
  step: SignInOutput | undefined;
};

type SignInState = {
  isSignedIn: boolean;
  jwt: string;
  step: SignInOutput | undefined;
};

type Action = {
  fetchSession: () => void;
  signIn: (user: string, password: string) => void;
  confirmSignIn: ({ challengeResponse, options }: ConfirmSignInInput) => void;
  signOut: () => void;
};

export type JwtPayload = {
  token: string;
  sub: string;
  role: string;
  exp: number;
};

async function fetchJwt(): Promise<string | undefined> {
  try {
    const session = await fetchAuthSession();
    if (session.userSub && session.tokens?.accessToken) {
      const jwtPayload: JwtPayload = {
        token: session.tokens.accessToken.toString(),
        sub: session.userSub,
        role: "user",
        exp: Math.floor(Date.now() / 1000) + 60 * 5,
      };
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jwtPayload),
      });
      if (response.ok) {
        const token = await response.json<{ jwt: string }>();
        return token.jwt;
      } else {
        console.log(response.status, response.statusText);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleSignIn({
  username,
  password,
}: SignInInput): Promise<SignInRes> {
  try {
    const response = await signIn({ username, password });
    console.log(response);
    return { isSuccess: true, isSignedIn: response.isSignedIn, step: response };
  } catch (error) {
    console.log("error signing in", error);
    return {
      isSuccess: false,
      isSignedIn: false,
      step: undefined,
    };
  }
}

async function handleConfirmSignIn({
  challengeResponse,
  options,
}: ConfirmSignInInput): Promise<SignInRes> {
  try {
    const response = await confirmSignIn({ challengeResponse, options });
    const session = await fetchAuthSession();
    return { isSuccess: true, isSignedIn: response.isSignedIn, step: response };
  } catch (error) {
    console.log("error confirm signin", error);
    return { isSuccess: false, isSignedIn: false, step: undefined };
  }
}

async function handleSignOut() {
  try {
    signOut();
  } catch (error) {
    console.log("error signing out", error);
  }
}

export const useAuth = create<SignInState & Action>((set) => ({
  step: undefined,
  isSignedIn: false,
  jwt: "",
  fetchSession: async () => {
    const session = await fetchAuthSession();
    const new_jwt = await fetchJwt();
    if (session.userSub) {
      set({
        isSignedIn: true,
        jwt: new_jwt,
      });
    }
  },
  signIn: async (username, password) => {
    const response = await handleSignIn({ username, password });
    const jwt = await fetchJwt();
    set({
      isSignedIn: response.isSignedIn,
      jwt: jwt,
      step: response.step,
    });
  },
  confirmSignIn: async ({ challengeResponse, options }: ConfirmSignInInput) => {
    const response = await handleConfirmSignIn({ challengeResponse, options });
    const jwt = await fetchJwt();
    set({
      isSignedIn: response.isSignedIn,
      jwt: jwt,
      step: response.step,
    });
  },
  signOut: async () => {
    await handleSignOut();
    set({
      isSignedIn: false,
      jwt: "",
    });
  },
}));
