import { render, screen } from "@testing-library/react";
import InfoButtons from "~/app/(dashboard)/project/[project_id]/infobox/buttons";

jest.mock("sonner", () => ({ toast: jest.fn() }));
jest.mock("@clerk/nextjs", () => ({ useUser: () => ({ user: { id: "u1" } }) }));
jest.mock("@flags-gg/react-library", () => ({ useFlags: () => ({ is: () => ({ enabled: () => true }) }) }));
jest.mock("~/app/(dashboard)/agent/create", () => ({
  __esModule: true,
  default: ({ project_id }: { project_id: string }) => <div>create agent for {project_id}</div>,
}));
jest.mock("~/hooks/use-company-limits", () => ({
  useCompanyLimits: () => ({ data: { agents: { allowed: 2 } }, isLoading: false, error: null }),
}));

const projectData = { current: { project_id: "proj-b", agents_used: 1 } };
jest.mock("~/hooks/use-project", () => ({
  useProject: () => ({ data: projectData.current, isLoading: false }),
}));

beforeEach(() => {
  // stale project from another tab must be ignored
  localStorage.setItem("projectAtom", JSON.stringify({ project_id: "proj-a", agents_used: 0 }));
});

describe("project InfoButtons", () => {
  it("creates agents in the route's project", () => {
    projectData.current = { project_id: "proj-b", agents_used: 1 };
    render(<InfoButtons project_id={"proj-b"} />);
    expect(screen.getByText("create agent for proj-b")).toBeTruthy();
  });

  it("uses the fetched project's agent count for the limit", () => {
    projectData.current = { project_id: "proj-b", agents_used: 2 };
    render(<InfoButtons project_id={"proj-b"} />);
    expect(screen.queryByText(/create agent for/)).toBeNull();
  });
});
