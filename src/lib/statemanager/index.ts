"use client"

import {atomWithStorage} from "jotai/utils";

export type CompanyLimits = {
  projects: {
    allowed: number;
    used: number;
  };
  agents: {
    allowed: number;
    used: [
      {
        project_id: string;
        used: number;
      }
    ];
  };
  environments: {
    allowed: number;
    used: number;
  };
};

export interface IProject {
  id: string;
  name: string;
  project_id: string;
  agent_limit: number;
  agents_used?: number;
  logo: string;
  enabled: boolean;
}
export type ProjectsData = {
  projects: IProject[]
}

export type AgentLimits = {
  allowed: number;
  used: number;
}

export const projectAtom = atomWithStorage<IProject>("projectAtom", {
  id: '',
  name: '',
  project_id: '',
  agent_limit: 0,
  agents_used: 0,
  logo: '',
  enabled: false,
})

export interface FlagAgent {
  id: string;
  name: string;
  enabled: boolean;
  agent_id: string;
  request_limit: number;
  environment_limit: number;
  environments: []
  project_info: {
    project_id: string;
    name: string;
  }
}
export const agentAtom = atomWithStorage<FlagAgent>("agentAtom", {
  id: '',
  name: '',
  enabled: false,
  agent_id: '',
  request_limit: 0,
  environment_limit: 0,
  environments: [],
  project_info: {
    project_id: '',
    name: '',
  }
})
export type AgentsData = {
  agents: FlagAgent[]
}

export interface IEnvironment {
  id: string;
  name: string;
  environment_id: string;
  enabled: boolean;
  secret_menu: {
    enabled: boolean;
    menu_id: string;
  },
  flags: [];
  agent_name: string;
  project_name: string;
}
export const environmentAtom = atomWithStorage<IEnvironment>("environmentAtom", {
  id: '',
  name: '',
  environment_id: '',
  enabled: false,
  secret_menu: {
    enabled: false,
    menu_id: '',
  },
  flags: [],
  agent_name: '',
  project_name: '',
})
export type EnvironmentsData = {
  environments: IEnvironment[]
}

export interface secretMenu {
  id: string,
  menu_id: string,
  enabled: boolean,
  code: [],
  style: {
    closeButton: string,
    container: string,
    button: string,
    style_id: string,
  },
  environment_details: {
    name: string,
    id: string,
  }
}
export const secretMenuAtom = atomWithStorage<secretMenu>("secretMenuAtom", {
  id: '',
  menu_id: '',
  enabled: false,
  code: [],
  style: {
    closeButton: '',
    container: '',
    button: '',
    style_id: '',
  },
  environment_details: {
    name: '',
    id: '',
  }
})

export interface Flag {
  enabled: boolean,
  details: {
    name: string,
    id: string,
  }
}

export interface ICompanyInfo {
  company: {
    name: string,
    domain: string,
    invite_code: string,
    id: string,
    logo: string,
  },
  payment_plan: {
    name: string,
    price: number,
    custom: boolean,
    team_members: number,
    projects: number,
    agents: number,
    environments: number,
  }
}
export const companyInfoAtom = atomWithStorage<ICompanyInfo>("companyInfoAtom", {
  company: {
    name: '',
    domain: '',
    invite_code: '',
    id: '',
    logo: '',
  },
  payment_plan: {
    name: '',
    price: 0,
    custom: false,
    team_members: 0,
    projects: 0,
    agents: 0,
    environments: 0,
  }
})

export const hasCompletedOnboardingAtom = atomWithStorage<boolean>("hasCompletedOnboardingAtom", false)

export interface IUserInfo {
  email: string
  domain: string
}
export const userAtom = atomWithStorage("userAtom", {
  email: '',
  domain: '',
})

export const commitHashAtom = atomWithStorage<string>("commitHashAtom", "")
