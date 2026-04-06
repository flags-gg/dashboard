export function createMockRequest(
  url: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
    searchParams?: Record<string, string>;
  } = {}
): Request {
  const { method = "GET", body, searchParams } = options;

  const fullUrl = new URL(url, "http://localhost:3000");
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      fullUrl.searchParams.set(key, value);
    }
  }

  const init: RequestInit = { method };
  if (body) {
    init.body = JSON.stringify(body);
    init.headers = { "Content-Type": "application/json" };
  }

  return new Request(fullUrl.toString(), init);
}

export const mockUser = { id: "user_123", firstName: "Test", lastName: "User" };

export function mockFetchSuccess(data: unknown = {}, status = 200) {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

export function mockFetchFailure(status = 500) {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error: "Server error" }),
  });
}

export function mockFetchThrow(message = "Network error") {
  return jest.fn().mockRejectedValue(new Error(message));
}
