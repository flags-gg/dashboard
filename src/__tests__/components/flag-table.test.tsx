import { render, screen, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FlagTable } from "~/app/(dashboard)/agent/[agent_id]/flag-table";
import type { AgentFlags } from "~/lib/interfaces";

jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn() }) }));
jest.mock("sonner", () => ({ toast: jest.fn() }));

const env = (id: string, level: number, production = false) => ({ environment_id: id, name: id, level, production });
const data: AgentFlags = {
  agent_id: "a",
  environments: [env("dev", 0), env("staging", 1), env("live", 2, true)],
  flags: [
    { name: "checkout", ticket: "TL-1", states: [
      { environment_id: "dev", flag_id: "1", enabled: true, rollout: 100 },
      { environment_id: "staging", flag_id: "2", enabled: false, rollout: 100 },
    ] },
    { name: "teams", states: [
      { environment_id: "dev", flag_id: "3", enabled: true, rollout: 100 },
      { environment_id: "staging", flag_id: "4", enabled: true, rollout: 100 },
      { environment_id: "live", flag_id: "5", enabled: true, rollout: 25 },
    ] },
  ],
};

const row = (name: string) => screen.getByText(name).closest("tr")!;

describe("FlagTable", () => {
  it("shows state pills, rollout percentage and promote in the next environment", () => {
    render(<FlagTable data={data} agentId="a" />);

    const checkout = within(row("checkout"));
    expect(checkout.getByRole("button", { name: /checkout in dev: On/ })).toBeInTheDocument();
    expect(checkout.getByRole("button", { name: /checkout in staging: Off/ })).toBeInTheDocument();
    expect(checkout.getByRole("button", { name: "Promote to live" })).toBeInTheDocument();
    expect(checkout.getByText("TL-1")).toBeInTheDocument();

    const teams = within(row("teams"));
    expect(teams.getByRole("button", { name: /teams in live: 25%/ })).toBeInTheDocument();
    expect(teams.queryByRole("button", { name: /Promote/ })).not.toBeInTheDocument();
  });

  it("filters and searches", () => {
    render(<FlagTable data={data} agentId="a" />);

    expect(screen.getByRole("radio", { name: /Rolling out 1/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /Not in production 1/ }));
    expect(screen.getByText("checkout")).toBeInTheDocument();
    expect(screen.queryByText("teams")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /All 2/ }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search flags" }), { target: { value: "tl-1" } });
    expect(screen.getByText("checkout")).toBeInTheDocument();
    expect(screen.queryByText("teams")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search flags" }), { target: { value: "nope" } });
    expect(screen.getByText("No flags match.")).toBeInTheDocument();
  });
});
