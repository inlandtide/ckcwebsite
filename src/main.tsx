import { createRoot, hydrateRoot } from "react-dom/client";
import { initBotId } from "botid/client/core";
import App from "./App";
import "./index.css";

// Vercel serves the challenge proxies. Plain Vite development has no proxy.
if (import.meta.env.PROD) {
  initBotId({
    protect: [{ path: "/api/contact", method: "POST", advancedOptions: { checkLevel: "basic" } }],
  });
}

const root = document.getElementById("root")!;
if (root.hasChildNodes()) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
