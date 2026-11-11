import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CompanyWebhooks } from "~/components/webhooks/company-webhooks";
import { StaffPanel } from "~/components/staff/panel";
jest.mock("@clerk/nextjs", () => ({ useAuth: () => ({ userId: "user_a" }) }));
jest.mock("sonner", () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
const originalFetch = global.fetch;
afterAll(() => { global.fetch = originalFetch; });
function mount(component: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(<QueryClientProvider client={client}>{component}</QueryClientProvider>);
}
it("shows the staff frame and searchable company data", async () => {
  global.fetch = jest.fn().mockResolvedValue(Response.json({ total: 1, items: [{ company_id: "company-a", name: "Acme", domain: "acme.example", plan: "Free", users: 2, projects: 3, created_at: "2026-11-01T00:00:00Z" }] }));
  mount(<StaffPanel tab="companies" />);
  expect(screen.getByRole("heading", { name: "Admin panel" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Companies" })).toHaveAttribute("aria-current", "page");
  expect(await screen.findByText("Acme")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Search companies" }), { target: { value: "acme" } });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  await waitFor(() => expect(global.fetch).toHaveBeenLastCalledWith("/api/staff/companies?q=acme&page=1", expect.anything()));
});
it("creates selected subscriptions and clears the once-only secret", async () => {
  const calls = jest.fn(async (url: string, init?: RequestInit) => {
    if (init?.method === "POST") return Response.json({ id: "endpoint-a", secret: "whsec_private" }, { status: 201 });
    return Response.json(url.includes("deliveries") ? { deliveries: [] } : { endpoints: [] });
  });
  global.fetch = calls as typeof fetch;
  mount(<CompanyWebhooks />);
  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), { target: { value: "TrackLines" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Endpoint URL" }), { target: { value: "https://hooks.example.com/flags" } });
  fireEvent.click(screen.getByRole("checkbox", { name: "flag.archived" }));
  fireEvent.click(screen.getByRole("button", { name: "Create endpoint" }));
  expect(await screen.findByRole("textbox", { name: "Signing secret" })).toHaveValue("whsec_private");
  expect(calls).toHaveBeenCalledWith("/api/company/webhooks", expect.objectContaining({ method: "POST", body: JSON.stringify({ name: "TrackLines", url: "https://hooks.example.com/flags", event_types: ["flag.created", "flag.state_changed"] }) }));
  fireEvent.click(screen.getByRole("button", { name: "I’ve saved it" }));
  expect(screen.queryByRole("textbox", { name: "Signing secret" })).not.toBeInTheDocument();
});
it("shows failed deliveries and queues a retry", async () => {
  const calls = jest.fn(async (url: string, init?: RequestInit) => {
    if (init?.method === "POST") return new Response(null, { status: 204 });
    return Response.json(url.includes("deliveries") ? { deliveries: [{ id: "42", event_id: "event-a", endpoint_name: "TrackLines", event_type: "flag.state_changed", status: "failed", attempts: 8, response_status: 503, last_error: "Endpoint returned HTTP 503", created_at: "2026-11-01T00:00:00Z", next_attempt_at: "2026-11-02T00:00:00Z", payload: { enabled: true } }] } : { endpoints: [] });
  });
  global.fetch = calls as typeof fetch;
  mount(<CompanyWebhooks />);
  expect(await screen.findByText("failed")).toBeInTheDocument();
  expect(screen.getByText("HTTP 503")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await waitFor(() => expect(calls).toHaveBeenCalledWith("/api/company/webhooks/deliveries/42/retry", expect.objectContaining({ method: "POST" })));
});
