import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kindora — Build Your Impact Portfolio" },
      { name: "description", content: "Kindora connects organizations with volunteers and helps young people build a verified impact portfolio recognized by universities, scholarships and employers." },
      { property: "og:title", content: "Kindora — Build Your Impact Portfolio" },
      { property: "og:description", content: "Verified volunteering, tracked hours, and portfolio-ready certificates for the next generation of changemakers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/site/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#fff", color: "#111827", fontFamily: "Inter, system-ui, sans-serif" }}>
      <a href="/site/index.html" style={{ color: "#4F46E5", fontWeight: 600 }}>
        Opening Kindora…
      </a>
    </div>
  );
}
