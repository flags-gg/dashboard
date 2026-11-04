import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Maker from "~/app/(dashboard)/secretmenu/maker";

jest.mock("sonner", () => ({ toast: jest.fn() }));
const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ menu_id: "m1", enabled: false, sequence: [] }) });
  global.fetch = fetchMock;
  // a stale environment from another tab must not be used
  localStorage.setItem("environmentAtom", JSON.stringify({ environment_id: "env-from-other-tab" }));
});

const createCalls = () =>
  fetchMock.mock.calls.filter(([url, init]) => url === "/api/secretmenu/sequence" && init?.method === "POST");

describe("secret menu Maker", () => {
  it("creates the menu for the environment it was given", async () => {
    render(<Maker menuId={""} environmentId={"env-b"} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled(); // nothing to save yet
    fireEvent.click(screen.getByRole("button", { name: "Add ArrowUp" }));
    fireEvent.click(screen.getByRole("button", { name: "Add a" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(createCalls()).toHaveLength(1));
    const body = JSON.parse(createCalls()[0][1].body as string);
    expect(body.environmentId).toBe("env-b");
    expect(body.sequence).toEqual(["ArrowUp", "a"]);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/secretmenu/m1"));
  });

  it("refuses to create without an environment", async () => {
    render(<Maker menuId={""} />);
    fireEvent.click(screen.getByRole("button", { name: "Add a" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText(/No environment selected/)).toBeTruthy();
    expect(createCalls()).toHaveLength(0);
  });

  it("removes a key from the sequence", () => {
    render(<Maker menuId={""} environmentId={"env-b"} />);
    fireEvent.click(screen.getByRole("button", { name: "Add a" }));
    fireEvent.click(screen.getByRole("button", { name: "Add b" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove A (position 1)" }));
    expect(screen.queryByRole("button", { name: /Remove A/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Remove B (position 1)" })).toBeTruthy();
  });
});
