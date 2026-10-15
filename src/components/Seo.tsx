import { useEffect } from "react";
import { useLocation } from "wouter";
import { renderSeoHead } from "../lib/seo";

export default function Seo() {
  const [location] = useLocation();

  useEffect(() => {
    document.head.querySelectorAll("[data-seo]").forEach((element) => element.remove());
    document.head.insertAdjacentHTML("beforeend", renderSeoHead(location));
  }, [location]);

  return null;
}
