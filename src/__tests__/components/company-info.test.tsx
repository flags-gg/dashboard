import { render, screen } from "@testing-library/react";
import Info from "~/app/(dashboard)/company/info";

jest.mock("sonner", () => ({ toast: jest.fn() }));
jest.mock("~/lib/utils/uploadthing", () => ({ UploadButton: () => null }));
jest.mock("~/app/(dashboard)/company/info/delete", () => ({ __esModule: true, default: () => null }));

const state: { current: { data?: unknown; isLoading: boolean } } = { current: { isLoading: true } };
jest.mock("~/hooks/use-company-details", () => ({ useCompanyDetails: () => state.current }));

describe("company Info", () => {
  it("renders after loading finishes (same hooks on every render)", () => {
    state.current = { isLoading: true };
    const { rerender } = render(<Info />);

    state.current = {
      isLoading: false,
      data: { company: { id: "c1", name: "Acme", domain: "acme.com", invite_code: "abcdefghijklmnop", logo: "" } },
    };
    rerender(<Info />);

    expect(screen.getByText("acme.com")).toBeTruthy();
  });
});
