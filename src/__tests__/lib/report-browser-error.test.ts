import { reportBrowserError } from "~/lib/report-browser-error";

describe("browser Bugfixes relay", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("sends errors only to the same-origin server route", () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    reportBrowserError("failed", new Error("render crashed"), "uncaught");
    expect(global.fetch).toHaveBeenCalledWith("/api/bugfixes/browser", expect.objectContaining({
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      body: expect.stringContaining("render crashed"),
    }));
  });

  it("does not report the same exception twice in quick succession", () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    const error = new Error("duplicate browser exception");
    reportBrowserError("failed", error, "uncaught");
    reportBrowserError("failed", error, "handled");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("ignores aborted requests", () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    reportBrowserError("error in getUserDetails", new DOMException("signal is aborted without reason", "AbortError"), "handled");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each(["Failed to fetch", "network error", "NetworkError when attempting to fetch resource.", "Load failed"])("ignores the connection failure %s", (message) => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    reportBrowserError("Failed to fetch environment:", new TypeError(message), "handled");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("still reports other TypeErrors", () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    reportBrowserError("failed", new TypeError("x is not a function"), "handled");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
