import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EnvFlagTable } from "~/app/(dashboard)/environment/[environment_id]/flags/env-flags";

jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn() }) }));
jest.mock("sonner", () => ({ toast: jest.fn() }));

const state = (id: string, enabled: boolean, rollout = 100) => ({ environment_id: "dev", flag_id: id, enabled, rollout });

describe("EnvFlagTable", () => {
  it("shows state, and promote only where the next environment lacks the flag", () => {
    render(<EnvFlagTable env="dev" next="staging" agentId="a" flags={[
      { name: "checkout", ticket: "TL-1", state: state("1", true, 25), inNext: false },
      { name: "teams", state: state("2", false), inNext: true },
    ]} />);

    const checkout = within(screen.getByText("checkout").closest("tr")!);
    expect(checkout.getByRole("button", { name: /checkout in dev: 25%/ })).toBeInTheDocument();
    expect(checkout.getByRole("button", { name: "Promote to staging" })).toBeInTheDocument();

    const teams = within(screen.getByText("teams").closest("tr")!);
    expect(teams.getByRole("button", { name: /teams in dev: Off/ })).toBeInTheDocument();
    expect(teams.getByText("Promoted")).toBeInTheDocument();
  });

  it("has no promote column in the last environment", () => {
    render(<EnvFlagTable env="prod" agentId="a" flags={[{ name: "x", state: state("1", true), inNext: false }]} />);
    expect(screen.queryByRole("button", { name: /Promote/ })).not.toBeInTheDocument();
  });
});
