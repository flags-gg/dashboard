const MAX_MESSAGE = 2_000;
const MAX_STACK = 6_000;
let lastReport = "";
let lastReportAt = 0;

export function reportBrowserError(message: string, error?: unknown, source = "browser") {
  if (typeof window === "undefined" || typeof fetch !== "function") return;

  const detail = error instanceof Error ? error : undefined;
  const body = JSON.stringify({
    message: (detail?.message ?? (error === undefined ? message : `${message}: ${String(error)}`)).slice(0, MAX_MESSAGE),
    stack: detail?.stack?.slice(0, MAX_STACK),
    source,
    path: window.location.pathname.slice(0, 500),
  });

  // A single exception can surface through both a window event and an error boundary.
  const fingerprint = `${detail?.message ?? message}\n${detail?.stack ?? ""}\n${window.location.pathname}`;
  if (fingerprint === lastReport && Date.now() - lastReportAt < 5_000) return;
  lastReport = fingerprint;
  lastReportAt = Date.now();

  // The server owns the Bugfixes credentials. Reporting must never block the UI.
  void fetch("/api/bugfixes/browser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    keepalive: true,
    body,
  }).catch(() => {});
}
