jest.mock("@clerk/nextjs/server", () => ({ auth: jest.fn(async () => ({ userId: "new-user" })) }));
jest.mock("@clerk/nextjs", () => ({ SignIn: () => null }));
jest.mock("next/navigation", () => ({ redirect: jest.fn((path: string) => { throw new Error(`Redirect: ${path}`); }) }));
jest.mock("~/server/get-user-details", () => ({ getUserDetailsServer: jest.fn() }));
jest.mock("~/server/get-dashboard-summary", () => ({ getDashboardSummary: jest.fn() }));
jest.mock("~/lib/logger", () => ({ logError: jest.fn() }));

import Home from "~/app/page";
import { getUserDetailsServer } from "~/server/get-user-details";
import { getDashboardSummary } from "~/server/get-dashboard-summary";
import { redirect } from "next/navigation";
import { InfoBoxError } from "~/components/InfoBoxError";

describe("first-login onboarding", () => {
  beforeEach(() => jest.clearAllMocks());

  it("sends a provisioned user without a company to onboarding before loading an overview", async () => {
    (getUserDetailsServer as jest.Mock).mockResolvedValue({ subject: "new-user", created: true, onboarded: false });
    await expect(Home()).rejects.toThrow("Redirect: /onboarding");
    expect(redirect).toHaveBeenCalledWith("/onboarding");
    expect(getDashboardSummary).not.toHaveBeenCalled();
  });

  it("does not treat a failed account lookup as a completed account", async () => {
    (getUserDetailsServer as jest.Mock).mockResolvedValue(null);
    const result = await Home();
    expect(result.type).toBe(InfoBoxError);
    expect(getDashboardSummary).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
