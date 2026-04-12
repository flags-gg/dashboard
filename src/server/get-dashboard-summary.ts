import { env } from "~/env";
import { CompanyStats, FlagAgent, Flag, IEnvironment, IProject } from "~/lib/interfaces";

export type FlagEntry = {
  flag: Flag;
  environment: IEnvironment;
};

export type EnvironmentCoverage = IEnvironment & {
  totalFlags: number;
  enabledFlags: number;
};

export type DashboardSummary = {
  projects: IProject[];
  agents: FlagAgent[];
  environments: IEnvironment[];
  allFlags: FlagEntry[];
  newestProject?: IProject;
  newestFlag?: FlagEntry;
  recentFlagChanges: FlagEntry[];
  environmentCoverage: EnvironmentCoverage[];
  stats: CompanyStats;
};

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const response = await fetch(`${env.API_SERVER}/stats/dashboard`, {
    headers: {
      "Content-Type": "application/json",
      "x-user-subject": userId,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch /stats/dashboard");
  }

  return response.json() as Promise<DashboardSummary>;
}
