import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
