import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { createElement, type ReactNode } from "react";

jest.mock("~/lib/statemanager", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { atom } = require("jotai");
  return { commitHashAtom: atom("") };
});

import { useCompanyDetails } from "~/hooks/use-company-details";

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

describe("useCompanyDetails", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("fetches company details successfully", async () => {
    const mockCompany = {
      company: {
        name: "Acme",
        domain: "acme.com",
        invite_code: "abc123",
        id: "company-1",
        logo: "",
      },
      payment_plan: {
        name: "Pro",
        price: 29,
        custom: false,
        team_members: 5,
        projects: 10,
        agents: 20,
        environments: 50,
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCompany),
    });

    const { result } = renderHook(() => useCompanyDetails(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.company.name).toBe("Acme");
    expect(result.current.data?.payment_plan.name).toBe("Pro");
  });

  it("calls fetch with correct endpoint", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        company: { name: "Test", domain: "", invite_code: "", id: "", logo: "" },
        payment_plan: { name: "", price: 0, custom: false, team_members: 0, projects: 0, agents: 0, environments: 0 },
      }),
    });

    renderHook(() => useCompanyDetails(), { wrapper: createWrapper() });

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/company/info",
      expect.objectContaining({ method: "GET" })
    );
  });
});
