import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AgentMetricsView } from "~/app/(dashboard)/agent/[agent_id]/metrics";
import { StateCell } from "~/app/(dashboard)/agent/[agent_id]/state-cell";
import type { AgentMetrics } from "~/lib/interfaces";

jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn() }) }));
jest.mock("sonner", () => ({ toast: jest.fn() }));

// jsdom has no layout; recharts' ResponsiveContainer needs this to mount
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
// Radix Select scrolls the chosen option into view and captures the pointer; jsdom implements neither
Element.prototype.scrollIntoView = jest.fn();
Element.prototype.hasPointerCapture = jest.fn(() => false);
Element.prototype.releasePointerCapture = jest.fn();

const metrics: AgentMetrics = {
  days: ["2026-11-03", "2026-11-04"],
  environments: [
    { environment_id: "dev", name: "dev", level: 0, users: [1, 2], requests: [5, 9], p50_ms: 10, p95_ms: 25 },
    { environment_id: "prod", name: "prod", level: 1, users: [100, 120], requests: [400, 500], p50_ms: 5, p95_ms: 1001 },
  ],
  flags: [
    { name: "checkout", environment_id: "prod", served_on: [25, 35], served_off: [75, 85], rule_hits: [2, 3] },
    { name: "teams", environment_id: "dev", served_on: [1, 2], served_off: [0, 0], rule_hits: [0, 0] },
  ],
};

const renderView = () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => metrics });
  render(<QueryClientProvider client={new QueryClient()}><AgentMetricsView agentId="a1" /></QueryClientProvider>);
};

describe("AgentMetricsView", () => {
  it("defaults to production and shows tiles and per-flag usage", async () => {
    renderView();
    expect(await screen.findByText("Users today")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();           // users today in prod
    expect(screen.getByText("900")).toBeInTheDocument();           // requests over the range
    expect(screen.getByText(">1s")).toBeInTheDocument();           // p95 overflow bucket
    expect(global.fetch).toHaveBeenCalledWith("/api/agent/metrics?agent_id=a1&days=14", expect.anything());

    const row = within(screen.getByText("checkout").closest("tr")!);
    expect(row.getByText("27%")).toBeInTheDocument();              // 60 of 220
    expect(row.getByText("60")).toBeInTheDocument();
    expect(row.getByText("160")).toBeInTheDocument();
    expect(row.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("teams")).not.toBeInTheDocument();   // dev flag
  });

  it("switches environment", async () => {
    renderView();
    fireEvent.click(await screen.findByRole("combobox", { name: "Environment" }));
    fireEvent.click(await screen.findByRole("option", { name: "dev" }));
    expect(await screen.findByText("teams")).toBeInTheDocument();
    expect(within(screen.getByText("teams").closest("tr")!).getByText("100%")).toBeInTheDocument();
  });
});

describe("StateCell usage line", () => {
  it("shows the share of users served on in the last 7 days", () => {
    render(<StateCell name="checkout" env="prod" state={{ environment_id: "prod", flag_id: "1", enabled: true, rollout: 25, served_on: 302, served_off: 902 }} />);
    expect(screen.getByTitle("Served on to 302 of 1,204 users in the last 7 days")).toHaveTextContent("25% of 1.2K");
  });
});
