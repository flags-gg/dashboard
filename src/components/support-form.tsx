"use client";

import { useEffect, useRef, useState } from "react";
import { SUPPORT_REQUEST_TOKEN, SUPPORT_REQUEST_URL } from "~/lib/support";

export default function SupportForm() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // The embed uses document.currentScript, so execute it on each mount rather than using Next's script cache.
    const script = document.createElement("script");
    script.src = "https://tracklin.es/embed.js";
    script.async = true;
    script.dataset.request = SUPPORT_REQUEST_TOKEN;
    script.dataset.target = "#tracklines-support-form";
    script.onload = () => setStatus("ready");
    script.onerror = () => setStatus("error");
    target.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
      target.replaceChildren();
    };
  }, []);

  return (
    <div className="space-y-4">
      {status === "loading" && <p role="status" className="text-sm text-muted-foreground">Loading support form…</p>}
      {status === "error" && <p role="alert" className="text-sm text-muted-foreground">The support form could not load. Use the link below to send your request.</p>}
      <div className="tracklines-support"><div id="tracklines-support-form" ref={targetRef} /></div>
      <p className="text-sm text-muted-foreground">
        You can also <a href={SUPPORT_REQUEST_URL} target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-4">open the support form in a new tab</a>.
      </p>
    </div>
  );
}
