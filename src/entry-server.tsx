import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";
export { seoPages, renderSeoHead, SITE_ORIGIN } from "./lib/seo";

export function render(path: string) {
  return renderToString(<Router ssrPath={path}><App /></Router>);
}
