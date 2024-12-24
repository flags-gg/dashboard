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
export type EnvironmentsData = {
  environments: IEnvironment[]
}

export interface SecretMenu {
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

export interface IUserInfo {
  email: string
  domain: string
}
