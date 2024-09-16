"use client"

import {atomWithStorage} from "jotai/utils";

export type CompanyLimits = {
  projects: {
    allowed: number;
    used: number;
  };
  agents: {
    allowed: number;
    used: number;
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
}
export type ProjectsData = {
  projects: IProject[]
}

export const projectAtom = atomWithStorage<IProject>("projectAtom", {
  id: '',
  name: '',
  project_id: '',
  agent_limit: 0,
  agents_used: 0,
  logo: ''
})

export interface FlagAgent {
  id: string;
  name: string;
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
