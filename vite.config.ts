import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: ["./src/client.tsx", "./src/style.css"],
          output: {
            entryFileNames: "static/client.js",
            assetFileNames: "static/assets/[name].[ext]",
          },
        },
      },
    };
  }
  return {
    ssr: {
      external: [
        "react",
        "react-dom",
        "openai",
        "aws-jwt-verify",
        "drizzle-orm",
        "aws-amplify",
        "zustand",
      ],
    },
    plugins: [
      pages(),
      devServer({
        entry: "src/index.tsx",
      }),
    ],
  };
});
