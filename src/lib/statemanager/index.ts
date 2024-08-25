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
export const projectAtom = atomWithStorage<IProject>("project", {
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
  environment_limit: number;
  environments: []
  project_info: {
    project_id: string;
    name: string;
  }
}
export const agentAtom = atomWithStorage<FlagAgent>("agent", {
  id: '',
  name: '',
  agent_id: '',
  environment_limit: 0,
  environments: [],
  project_info: {
    project_id: '',
    name: '',
  }
})

export interface IEnvironment {
  id: string;
  name: string;
  environment_id: string;
  flags: [];
  secret_menu: {
    enabled: boolean;
    id: string;
  }
}
export const environmentAtom = atomWithStorage<IEnvironment>("environment", {
  id: '',
  name: '',
  environment_id: '',
  flags: [],
  secret_menu: {
    enabled: false,
    id: '',
  }
})

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
  }
}
export const menuAtom = atomWithStorage<secretMenu>("secretMenu", {
  id: '',
  menu_id: '',
  enabled: false,
  code: [],
  style: {
    closeButton: '',
    container: '',
    button: '',
    style_id: '',
  }
})
