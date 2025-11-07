"use client"

import {atomWithStorage} from "jotai/utils";
import { FlagAgent, ICompanyInfo, IEnvironment, IProject, SecretMenu } from "~/lib/interfaces";

export const projectAtom = atomWithStorage<IProject>("projectAtom", {
  id: '',
  name: '',
  project_id: '',
  agent_limit: 0,
  agents_used: 0,
  logo: '',
  enabled: false,
})

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


export const environmentAtom = atomWithStorage<IEnvironment>("environmentAtom", {
  id: '',
  name: '',
  environment_id: '',
  enabled: false,
  level: 0,
  canPromote: false,
  secret_menu: {
    enabled: false,
    menu_id: '',
  },
  flags: [],
  agent_id: '',
  agent_name: '',
  project_name: '',
})


export const secretMenuAtom = atomWithStorage<SecretMenu>("secretMenuAtom", {
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

export const userAtom = atomWithStorage("userAtom", {
  email: '',
  domain: '',
})

export const commitHashAtom = atomWithStorage<string>("commitHashAtom", "")
