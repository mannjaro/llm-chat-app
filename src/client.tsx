import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { CookieStorage } from "aws-amplify/utils";
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./style.css";

import App from "./App";
import About from "./pages/about";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Home from "./pages/home";

import { config } from "../amplify.configure";

Amplify.configure(config);

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
  </React.StrictMode>,
);
