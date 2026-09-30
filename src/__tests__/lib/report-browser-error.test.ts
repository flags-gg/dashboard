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
});
