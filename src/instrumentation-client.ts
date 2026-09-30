import { reportBrowserError } from "~/lib/report-browser-error";

window.addEventListener("error", (event) => {
  reportBrowserError(event.message || "Uncaught browser error", event.error, "uncaught");
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  reportBrowserError(
    reason instanceof Error ? reason.message : String(reason),
    reason,
    "unhandled-rejection",
  );
});
