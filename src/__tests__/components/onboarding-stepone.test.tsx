import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import StepOne from "~/app/onboarding/stepone";
import { toast } from "sonner";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("@clerk/nextjs", () => ({ useUser: () => ({ user: {
  id: "new-user", firstName: "Test", lastName: "User", emailAddresses: [{ emailAddress: "test@example.com" }],
} }) }));
jest.mock("~/hooks/use-user-details", () => ({ getUserDetails: jest.fn(async () => ({ created: false })) }));
jest.mock("sonner", () => ({ toast: jest.fn() }));
jest.mock("~/lib/logger", () => ({ logError: jest.fn() }));

it("does not advance onboarding when backend user creation fails", async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
  try {
    render(<StepOne />);
    fireEvent.change(screen.getByRole("textbox", { name: /What do you wish to be known as/ }), { target: { value: "Test" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(toast).toHaveBeenCalledWith("Error", expect.objectContaining({
      description: "Failed to complete first step of onboarding: Failed to create account",
    })));
    expect(mockPush).not.toHaveBeenCalled();
  } finally {
    global.fetch = originalFetch;
  }
});
