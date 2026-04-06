import { createMockRequest, mockUser, mockFetchSuccess } from "./_helpers";

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

jest.mock("~/env", () => ({
  env: { API_SERVER: "https://api.test.com/v1" },
}));

import { currentUser } from "@clerk/nextjs/server";
import { POST, PUT } from "~/app/api/secretmenu/style/route";

const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;

describe("Secret Menu Style API Routes", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("POST /api/secretmenu/style", () => {
    it("returns 401 when not authenticated", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const req = createMockRequest("/api/secretmenu/style", {
        method: "POST",
        body: { menuId: "menu-1" },
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("returns style data on success", async () => {
      const styleData = { style_id: "style-1", styles: [] };
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchSuccess(styleData);

      const req = createMockRequest("/api/secretmenu/style", {
        method: "POST",
        body: { menuId: "menu-1" },
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/secretmenu/style", () => {
    const validStyle = JSON.stringify({
      resetButton: "btn-reset",
      closeButton: "btn-close",
      container: "container",
      flag: "flag",
      buttonEnabled: "btn-on",
      buttonDisabled: "btn-off",
      header: "header",
    });

    it("returns 401 when not authenticated", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const req = createMockRequest("/api/secretmenu/style", {
        method: "PUT",
        body: { menuId: "menu-1", style: validStyle },
      });

      const res = await PUT(req);
      expect(res.status).toBe(401);
    });

    it("updates style successfully", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/secretmenu/style", {
        method: "PUT",
        body: { menuId: "menu-1", style: validStyle },
      });

      const res = await PUT(req);
      expect(res.status).toBe(200);
    });

    it("returns 400 for invalid JSON style", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);

      const req = createMockRequest("/api/secretmenu/style", {
        method: "PUT",
        body: { menuId: "menu-1", style: "not-valid-json{" },
      });

      const res = await PUT(req);
      expect(res.status).toBe(400);
    });

    it("includes styleId when provided", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/secretmenu/style", {
        method: "PUT",
        body: { menuId: "menu-1", styleId: "style-1", style: validStyle },
      });

      await PUT(req);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.custom_style.style_id).toBe("style-1");
    });
  });
});
