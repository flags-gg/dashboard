import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { createElement, type ReactNode } from "react";

jest.mock("~/lib/statemanager", () => {
  const { atom } = require("jotai");
  return { commitHashAtom: atom("") };
});

import { useProject } from "~/hooks/use-project";

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

describe("useProject", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("fetches project data successfully", async () => {
    const mockProject = {
      id: "1",
      name: "Test Project",
      project_id: "proj-1",
      agent_limit: 5,
      logo: "",
      enabled: true,
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProject),
    });

    const { result } = renderHook(() => useProject("proj-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe("Test Project");
  });

  it("does not fetch when projectId is empty", () => {
    const { result } = renderHook(() => useProject(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("calls fetch with correct URL", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "1", name: "Project", project_id: "proj-1" }),
    });

    renderHook(() => useProject("proj-1"), { wrapper: createWrapper() });

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/project?projectId=proj-1",
      expect.objectContaining({ method: "GET" })
    );
  });
});
