import { fireEvent, render, screen } from "@testing-library/react";
import SupportForm from "~/components/support-form";
import { SUPPORT_REQUEST_TOKEN, SUPPORT_REQUEST_URL } from "~/lib/support";

const embedScript = () => document.querySelector<HTMLScriptElement>('script[src="https://tracklin.es/embed.js"]')!;

describe("TrackLines support form", () => {
  it("loads the supplied request form and retains a direct support link", () => {
    render(<SupportForm />);
    expect(embedScript()).toHaveAttribute("data-request", SUPPORT_REQUEST_TOKEN);
    expect(embedScript()).toHaveAttribute("data-target", "#tracklines-support-form");
    expect(screen.getByRole("status")).toHaveTextContent("Loading support form");
    expect(screen.getByRole("link", { name: /open the support form/ })).toHaveAttribute("href", SUPPORT_REQUEST_URL);

    fireEvent.load(embedScript());
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open the support form/ })).toBeInTheDocument();
  });

  it("offers the hosted form if the embed is blocked or unavailable", () => {
    render(<SupportForm />);
    fireEvent.error(embedScript());
    expect(screen.getByRole("alert")).toHaveTextContent("The support form could not load");
    expect(screen.getByRole("link", { name: /open the support form/ })).toHaveAttribute("href", SUPPORT_REQUEST_URL);
  });

  it("cleans up and executes the embed again when returning to support", () => {
    const first = render(<SupportForm />);
    const script = embedScript();
    first.unmount();
    expect(document.querySelector("#tracklines-support-form")).not.toBeInTheDocument();
    expect(script.onload).toBeNull();
    expect(script.onerror).toBeNull();

    render(<SupportForm />);
    expect(embedScript()).not.toBe(script);
    expect(document.querySelectorAll('script[src="https://tracklin.es/embed.js"]')).toHaveLength(1);
  });
});
