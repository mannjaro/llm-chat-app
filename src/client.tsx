import { createRoot } from "react-dom/client";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { CookieStorage } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";

import App from "./App";
import Home from "./pages/home";
import About from "./pages/about";
import Chat from "./pages/chat";
import Auth from "./pages/auth";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_fPBigic0T",
      userPoolClientId: "75iopd465ji4csl15opqlfdn4e",
    },
  },
});

cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
    ],
  },
]);

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
