import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, createStore } from "jotai";
import StepTwo from "~/app/onboarding/steptwo";
import SideBar from "~/components/SideBar";
import { toast } from "sonner";

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
const mockUser = { id: "user-123", emailAddresses: [{ emailAddress: "test@example.com" }] };
jest.mock("next/navigation", () => ({ useRouter: () => mockRouter }));
jest.mock("@clerk/nextjs", () => ({ useUser: () => ({ user: mockUser, isLoaded: true }) }));
jest.mock("sonner", () => ({ toast: jest.fn() }));
jest.mock("~/lib/logger", () => ({ logError: jest.fn() }));
jest.mock("~/lib/statemanager", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { atom } = require("jotai");
  return { hasCompletedOnboardingAtom: atom(false), commitHashAtom: atom("") };
});
jest.mock("~/components/SideBar/standard", () => ({ __esModule: true, default: () => <div>Standard navigation</div> }));
jest.mock("~/components/SideBar/onboarding", () => ({ __esModule: true, default: () => <div>Onboarding navigation</div> }));
jest.mock("~/components/SideBar/unknown", () => ({ __esModule: true, default: () => null }));

const accountKey = ["userDetails", "user-123", ""];
let completed = false;
let mutationStatus = 200;
let completesOnMutation = true;

function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  // Reproduce the sidebar's fresh but outdated five-minute cache from before onboarding.
  client.setQueryData(accountKey, { subject: "user-123", created: true, onboarded: false });
  render(<Provider store={createStore()}><QueryClientProvider client={client}><SideBar /><StepTwo /></QueryClientProvider></Provider>);
  return client;
}

function submitCompany() {
  fireEvent.click(screen.getByRole("button", { name: "Company Details" }));
  const input = screen.getByPlaceholderText("Company Name");
  fireEvent.change(input, { target: { value: "Test company" } });
  fireEvent.click(within(input.closest("form")!).getByRole("button", { name: "Continue" }));
}

function submitInvite() {
  fireEvent.click(screen.getByRole("button", { name: "Company Invite Code" }));
  const input = screen.getByPlaceholderText("Company Invite Code");
  fireEvent.change(input, { target: { value: "invite-code" } });
  fireEvent.click(within(input.closest("form")!).getByRole("button", { name: "Continue" }));
}

describe("onboarding completion and sidebar cache", () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    jest.clearAllMocks();
    completed = false;
    mutationStatus = 200;
    completesOnMutation = true;
    global.fetch = jest.fn(async (path, init) => {
      if (path === "/api/user/details") {
        return { ok: true, json: async () => ({ subject: "user-123", created: true, onboarded: completed }) };
      }
      if (init?.method === "POST" || init?.method === "PUT") {
        if (mutationStatus === 200 && completesOnMutation) completed = true;
        return { ok: mutationStatus === 200, status: mutationStatus };
      }
      throw new Error(`Unexpected request: ${String(path)}`);
    }) as jest.Mock;
  });
  afterAll(() => { global.fetch = originalFetch; });

  it.each(["create", "join"])("refreshes the shared account cache after %s, unlocking navigation", async (action) => {
    const client = mount();
    await waitFor(() => expect(client.isFetching()).toBe(0));
    expect(screen.getByText("Onboarding navigation")).toBeInTheDocument();
    if (action === "create") submitCompany(); else submitInvite();

    expect(await screen.findByText("Standard navigation")).toBeInTheDocument();
    expect(client.getQueryData(accountKey)).toMatchObject({ onboarded: true });
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/"));
    expect(mockRouter.refresh).toHaveBeenCalled();
    expect(screen.queryByText("Onboarding navigation")).not.toBeInTheDocument();
  });

  it("repairs the stale sidebar when an already-onboarded user returns to onboarding", async () => {
    completed = true;
    const client = mount();
    expect(await screen.findByText("Standard navigation")).toBeInTheDocument();
    expect(client.getQueryData(accountKey)).toMatchObject({ onboarded: true });
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/"));
  });

  it.each(["create", "join"])("stays on onboarding when %s fails", async (action) => {
    mutationStatus = 500;
    const client = mount();
    await waitFor(() => expect(client.isFetching()).toBe(0));
    if (action === "create") submitCompany(); else submitInvite();

    await waitFor(() => expect(toast).toHaveBeenCalledWith("Error", expect.anything()));
    expect(client.getQueryData(accountKey)).toMatchObject({ onboarded: false });
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(screen.getByText("Onboarding navigation")).toBeInTheDocument();
  });

  it("requires confirmation from the account API before claiming setup is complete", async () => {
    completesOnMutation = false;
    const client = mount();
    await waitFor(() => expect(client.isFetching()).toBe(0));
    submitCompany();
    await waitFor(() => expect(toast).toHaveBeenCalledWith("Error", expect.objectContaining({
      description: expect.stringContaining("Your company setup is not complete yet"),
    })));
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(client.getQueryData(accountKey)).toMatchObject({ onboarded: false });
  });
});
