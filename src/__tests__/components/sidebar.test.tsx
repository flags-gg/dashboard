import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import SideBar from "~/components/SideBar";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";

const mockRefetch = jest.fn();
const mockState: { user: { id: string } | null; data?: { onboarded: boolean }; error: Error | null; isFetching: boolean } = {
  user: { id: "user-1" }, error: null, isFetching: false,
};

jest.mock("@clerk/nextjs", () => ({ useUser: () => ({ user: mockState.user }) }));
jest.mock("~/hooks/use-user-details", () => ({ useUserDetails: () => ({ ...mockState, refetch: mockRefetch }) }));
jest.mock("~/lib/statemanager", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { atom } = require("jotai");
  return { hasCompletedOnboardingAtom: atom(false) };
});
jest.mock("~/components/SideBar/standard", () => ({ __esModule: true, default: () => <div>Standard navigation</div> }));
jest.mock("~/components/SideBar/onboarding", () => ({ __esModule: true, default: () => <div>Onboarding navigation</div> }));
jest.mock("~/components/SideBar/unknown", () => ({ __esModule: true, default: () => <div>Signed-out navigation</div> }));
jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
jest.mock("~/components/ui/sidebar", () => {
  const Container = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return { Sidebar: Container, SidebarHeader: Container, SidebarContent: Container, SidebarGroup: Container };
});

describe("Sidebar account loading", () => {
  beforeEach(() => {
    mockState.user = { id: "user-1" };
    mockState.data = undefined;
    mockState.error = null;
    mockState.isFetching = false;
    mockRefetch.mockReset();
  });

  it("shows a stable error and retries only when requested", () => {
    mockState.error = new Error("Failed to fetch user details: 401");
    const { rerender } = render(<SideBar />);
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load your account");
    expect(mockRefetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(mockRefetch).toHaveBeenCalledTimes(1);

    mockState.isFetching = true;
    rerender(<SideBar />);
    expect(screen.getByRole("button", { name: "Try again" })).toBeDisabled();
    expect(mockRefetch).toHaveBeenCalledTimes(1);

    mockState.isFetching = false;
    mockState.error = null;
    mockState.data = { onboarded: true };
    rerender(<SideBar />);
    expect(screen.getByText("Standard navigation")).toBeInTheDocument();
  });

  it("waits for this user's account instead of trusting persisted onboarding", () => {
    const store = createStore();
    store.set(hasCompletedOnboardingAtom, true);
    const { rerender } = render(<Provider store={store}><SideBar /></Provider>);
    expect(screen.getByRole("status")).toHaveTextContent("Loading your account");
    expect(screen.queryByText("Standard navigation")).not.toBeInTheDocument();

    mockState.data = { onboarded: false };
    rerender(<Provider store={store}><SideBar /></Provider>);
    expect(screen.getByText("Onboarding navigation")).toBeInTheDocument();
    expect(store.get(hasCompletedOnboardingAtom)).toBe(false);
  });

  it("clears the onboarding flag after sign-out", () => {
    mockState.user = null;
    const store = createStore();
    store.set(hasCompletedOnboardingAtom, true);
    render(<Provider store={store}><SideBar /></Provider>);
    expect(screen.getByText("Signed-out navigation")).toBeInTheDocument();
    expect(store.get(hasCompletedOnboardingAtom)).toBe(false);
  });
});
