import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "~/app/global-error";

describe("GlobalError", () => {
  it("renders error message", () => {
    const error = new Error("Something broke");
    const reset = jest.fn();

    render(<GlobalError error={error} reset={reset} />);

    expect(screen.getByText("Something went wrong")).toBeTruthy();
    expect(screen.getByText("Something broke")).toBeTruthy();
  });

  it("renders try again button", () => {
    const error = new Error("Test error");
    const reset = jest.fn();

    render(<GlobalError error={error} reset={reset} />);

    expect(screen.getByText("Try again")).toBeTruthy();
  });

  it("calls reset when try again is clicked", () => {
    const error = new Error("Test error");
    const reset = jest.fn();

    render(<GlobalError error={error} reset={reset} />);

    fireEvent.click(screen.getByText("Try again"));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
