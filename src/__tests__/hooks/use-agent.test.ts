import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { createElement, type ReactNode } from "react";

// Mock jotai atoms
jest.mock("~/lib/statemanager", () => {
  const { atom } = require("jotai");
  return { commitHashAtom: atom("") };
});

import { useAgent } from "~/hooks/use-agent";

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

describe("useAgent", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("fetches agent data successfully", async () => {
    const mockAgent = {
      id: "1",
      name: "Test Agent",
      agent_id: "agent-1",
      enabled: true,
      request_limit: 100,
      environment_limit: 5,
      environments: [],
      project_info: { project_id: "proj-1", name: "Project" },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAgent),
    });

    const { result } = renderHook(() => useAgent("agent-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe("Test Agent");
  });

  it("does not fetch when agentId is empty", () => {
    const { result } = renderHook(() => useAgent(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("calls fetch with correct URL", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "1", name: "Agent", agent_id: "agent-1" }),
    });

    renderHook(() => useAgent("agent-1"), { wrapper: createWrapper() });

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/agent?agentId=agent-1",
      expect.objectContaining({ method: "GET" })
    );
  });
});
