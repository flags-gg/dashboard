import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { createElement, type ReactNode } from "react";

jest.mock("~/lib/statemanager", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { atom } = require("jotai");
  return { commitHashAtom: atom("") };
});

import { useUserDetails, getUserDetails } from "~/hooks/use-user-details";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      JotaiProvider,
      null,
      createElement(QueryClientProvider, { client: queryClient }, children)
    );
  };
}

describe("getUserDetails", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetches user details successfully", async () => {
    const mockUser = {
      known_as: "Test",
      avatar: "avatar.png",
      first_name: "Test",
      last_name: "User",
      job_title: "Dev",
      location: "US",
      timezone: "UTC",
      group: { id: "g1", name: "Group" },
      onboarded: true,
      created: true,
      subject: "user_123",
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    const result = await getUserDetails();
    expect(result.known_as).toBe("Test");
    expect(result.onboarded).toBe(true);
  });

  it("throws on API error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getUserDetails()).rejects.toThrow("Failed to fetch user details");
  });

  it("throws on empty response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(null),
    });

    await expect(getUserDetails()).rejects.toThrow("No user details returned");
  });
});

describe("useUserDetails", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("does not fetch when userId is empty", () => {
    const { result } = renderHook(() => useUserDetails(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches when userId is provided", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          known_as: "Test",
          avatar: "",
          first_name: "Test",
          last_name: "User",
          job_title: "",
          location: "",
          timezone: "",
          group: { id: "", name: "" },
          onboarded: true,
          created: true,
          subject: "user_123",
        }),
    });

    const { result } = renderHook(() => useUserDetails("user_123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.known_as).toBe("Test");
  });
});
