/** @jest-environment node */
jest.mock("bugfixes", () => ({
  error: jest.fn(), info: jest.fn(),
  loadConfigFromEnv: jest.fn(() => ({ agentKey: "test-key", agentSecret: "test-secret" })),
  setDefaultConfig: jest.fn(),
}));

import { error, loadConfigFromEnv, setDefaultConfig } from "bugfixes";
import { logError } from "~/lib/logger";

it("configures the logger's SDK instance even when instrumentation ran in another bundle", () => {
  const cause = new Error("creation failed");
  logError("Failed to create environment", cause);
  expect(loadConfigFromEnv).toHaveBeenCalled();
  expect(setDefaultConfig).toHaveBeenCalledWith({ agentKey: "test-key", agentSecret: "test-secret" });
  expect(error).toHaveBeenCalledWith("Failed to create environment", cause);
});
