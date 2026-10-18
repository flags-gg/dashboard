import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Maker from "~/app/(dashboard)/secretmenu/maker";

jest.mock("sonner", () => ({ toast: jest.fn() }));

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
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(createCalls()).toHaveLength(1));
    expect(JSON.parse(createCalls()[0][1].body as string).environmentId).toBe("env-b");
  });

  it("refuses to create without an environment", async () => {
    render(<Maker menuId={""} />);
    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText(/No environment selected/)).toBeTruthy();
    expect(createCalls()).toHaveLength(0);
  });
});
