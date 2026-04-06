import {
  projectAtom,
  agentAtom,
  environmentAtom,
  secretMenuAtom,
  companyInfoAtom,
  hasCompletedOnboardingAtom,
  userAtom,
  commitHashAtom,
} from "~/lib/statemanager";
import { createStore } from "jotai";

describe("statemanager atoms", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe("projectAtom", () => {
    it("has correct default values", () => {
      const project = store.get(projectAtom);
      expect(project.id).toBe("");
      expect(project.name).toBe("");
      expect(project.project_id).toBe("");
      expect(project.agent_limit).toBe(0);
      expect(project.logo).toBe("");
      expect(project.enabled).toBe(false);
    });

    it("can be updated", () => {
      store.set(projectAtom, {
        id: "123",
        name: "Test Project",
        project_id: "proj-1",
        agent_limit: 5,
        logo: "logo.png",
        enabled: true,
      });
      const project = store.get(projectAtom);
      expect(project.name).toBe("Test Project");
      expect(project.enabled).toBe(true);
    });
  });

  describe("agentAtom", () => {
    it("has correct default values", () => {
      const agent = store.get(agentAtom);
      expect(agent.id).toBe("");
      expect(agent.name).toBe("");
      expect(agent.enabled).toBe(false);
      expect(agent.agent_id).toBe("");
      expect(agent.request_limit).toBe(0);
      expect(agent.environment_limit).toBe(0);
      expect(agent.environments).toEqual([]);
      expect(agent.project_info).toEqual({ project_id: "", name: "" });
    });
  });

  describe("environmentAtom", () => {
    it("has correct default values", () => {
      const env = store.get(environmentAtom);
      expect(env.id).toBe("");
      expect(env.name).toBe("");
      expect(env.environment_id).toBe("");
      expect(env.enabled).toBe(false);
      expect(env.level).toBe(0);
      expect(env.canPromote).toBe(false);
      expect(env.secret_menu).toEqual({ enabled: false, menu_id: "" });
      expect(env.flags).toEqual([]);
    });
  });

  describe("secretMenuAtom", () => {
    it("has correct default values", () => {
      const menu = store.get(secretMenuAtom);
      expect(menu.id).toBe("");
      expect(menu.menu_id).toBe("");
      expect(menu.enabled).toBe(false);
      expect(menu.code).toEqual([]);
      expect(menu.style).toEqual({
        closeButton: "",
        container: "",
        button: "",
        style_id: "",
      });
    });
  });

  describe("companyInfoAtom", () => {
    it("has correct default values", () => {
      const company = store.get(companyInfoAtom);
      expect(company.company.name).toBe("");
      expect(company.company.domain).toBe("");
      expect(company.company.invite_code).toBe("");
      expect(company.payment_plan.name).toBe("");
      expect(company.payment_plan.price).toBe(0);
      expect(company.payment_plan.custom).toBe(false);
    });
  });

  describe("hasCompletedOnboardingAtom", () => {
    it("defaults to false", () => {
      expect(store.get(hasCompletedOnboardingAtom)).toBe(false);
    });

    it("can be set to true", () => {
      store.set(hasCompletedOnboardingAtom, true);
      expect(store.get(hasCompletedOnboardingAtom)).toBe(true);
    });
  });

  describe("userAtom", () => {
    it("has correct default values", () => {
      const user = store.get(userAtom);
      expect(user.email).toBe("");
      expect(user.domain).toBe("");
    });
  });

  describe("commitHashAtom", () => {
    it("defaults to empty string", () => {
      expect(store.get(commitHashAtom)).toBe("");
    });

    it("can be updated", () => {
      store.set(commitHashAtom, "abc123");
      expect(store.get(commitHashAtom)).toBe("abc123");
    });
  });
});
