import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RulesEditor } from "~/app/(dashboard)/agent/[agent_id]/rules-editor";
import { StateCell } from "~/app/(dashboard)/agent/[agent_id]/state-cell";

jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn() }) }));
jest.mock("sonner", () => ({ toast: jest.fn() }));

describe("RulesEditor", () => {
  it("adds, validates, reorders and saves rules as lists", async () => {
    const onSave = jest.fn().mockResolvedValue(null);
    render(<RulesEditor open onOpenChange={jest.fn()} title="checkout in dev"
      rules={[{ attribute: "groups", operator: "in", values: ["beta"], serve: true }]} onSave={onSave} />);

    fireEvent.click(screen.getByRole("button", { name: "Add rule" }));
    fireEvent.click(screen.getByRole("button", { name: "Save rules" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Rule 2 needs an attribute and at least one value.");
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole("textbox", { name: "Rule 2 values" }), { target: { value: " @acme.com , @acme.io ," } });
    fireEvent.click(screen.getByRole("button", { name: "Move rule 2 up" }));
    fireEvent.click(screen.getByRole("button", { name: "Save rules" }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith([
      { attribute: "email", operator: "ends_with", values: ["@acme.com", "@acme.io"], serve: true },
      { attribute: "groups", operator: "in", values: ["beta"], serve: true },
    ]));
  });

  it("shows the API's reason when saving fails", async () => {
    render(<RulesEditor open onOpenChange={jest.fn()} title="x" rules={[{ attribute: "a", operator: "in", values: ["b"], serve: true }]}
      onSave={jest.fn().mockResolvedValue("rule 1: unknown operator")} />);
    fireEvent.click(screen.getByRole("button", { name: "Save rules" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("rule 1: unknown operator");
  });
});

describe("StateCell targeting indicator", () => {
  it("announces rules on an enabled flag", () => {
    render(<StateCell name="checkout" env="dev" state={{ environment_id: "dev", flag_id: "1", enabled: true, rollout: 100,
      rules: [{ attribute: "groups", operator: "in", values: ["beta"], serve: true }] }} />);
    expect(screen.getByRole("button", { name: "checkout in dev: On, 1 targeting rule. Edit" })).toBeInTheDocument();
  });
});

describe("StateCell rules workflow", () => {
  const originalResizeObserver = global.ResizeObserver;
  const originalFetch = global.fetch;

  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterAll(() => {
    global.ResizeObserver = originalResizeObserver;
    global.fetch = originalFetch;
  });

  it("keeps the flag controls and draft rollout after saving rules, then saves rollout and enables", async () => {
    render(<StateCell name="checkout" env="dev" state={{ environment_id: "dev", flag_id: "1", enabled: false, rollout: 100 }} />);
    fireEvent.click(screen.getByRole("button", { name: "checkout in dev: Off. Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "25%" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit rules" }));

    const editor = screen.getByRole("dialog", { name: "Targeting rules · checkout in dev" });
    fireEvent.click(within(editor).getByRole("button", { name: "Add rule" }));
    fireEvent.change(within(editor).getByRole("textbox", { name: "Rule 1 values" }), { target: { value: "@acme.com" } });
    fireEvent.click(within(editor).getByRole("button", { name: "Save rules" }));

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Targeting rules · checkout in dev" })).not.toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith("/api/flag/rules", expect.objectContaining({ method: "PUT", body: JSON.stringify({
      flag_id: "1", rules: [{ attribute: "email", operator: "ends_with", values: ["@acme.com"], serve: true }],
    }) }));
    expect(screen.getByText("1 rule, checked before the rollout")).toBeVisible();
    expect(screen.getByText("25% of visitors")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Save rollout" }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/flag/rollout", expect.objectContaining({
      method: "PATCH", body: JSON.stringify({ flag_id: "1", rollout: 25 }),
    })));
    await waitFor(() => expect(screen.getByRole("switch", { name: "Enabled" })).toBeEnabled());
    fireEvent.click(screen.getByRole("switch", { name: "Enabled" }));
    expect(await screen.findByRole("button", { name: "checkout in dev: 25%, 1 targeting rule. Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit rules" })).toBeVisible();
  });

  it.each(["Cancel", "Escape"])("returns to the flag controls after dismissing the rules editor with %s", async (dismiss) => {
    render(<StateCell name="checkout" env="dev" state={{ environment_id: "dev", flag_id: "1", enabled: true, rollout: 50 }} />);
    fireEvent.click(screen.getByRole("button", { name: "checkout in dev: 50%. Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit rules" }));
    if (dismiss === "Cancel") {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    } else {
      fireEvent.keyDown(screen.getByRole("dialog", { name: "Targeting rules · checkout in dev" }), { key: "Escape" });
    }

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Targeting rules · checkout in dev" })).not.toBeInTheDocument());
    expect(screen.getByText("50% of visitors")).toBeVisible();
    expect(screen.getByRole("switch", { name: "Enabled" })).toBeChecked();
    expect(global.fetch).not.toHaveBeenCalled();

    fireEvent.keyDown(screen.getByRole("button", { name: "Edit rules" }), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("button", { name: "Edit rules" })).not.toBeInTheDocument());
  });
});
