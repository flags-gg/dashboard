import {Card} from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { AgentsData, EnvironmentsData } from "~/lib/interfaces";
import {getAgents} from "~/app/api/agent/agent";
import { getEnvironments } from "~/app/api/environment/environment";

export default async function AgentsList({ project_id }: { project_id: string }) {
  let agents: AgentsData;
  try {
    agents = await getAgents(project_id);
  } catch (e) {
    console.error(e);
    return (
      <div className={"gap-3 col-span-2"}>
        <Card className={"mb-3 p-3"}>
          <p>Failed to load agents</p>
        </Card>
      </div>
    )
  }

  if (agents !== undefined && agents.agents.length > 0) {
    for (const agent of agents.agents) {
      let environments: EnvironmentsData
      try {
        const env = await getEnvironments(agent.agent_id)
        environments = env.data as EnvironmentsData;
        agent.environments = environments.environments as []
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <div className={"gap-3 col-span-2 min-w-[40rem]"}>
      <Card className={"mb-3"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Agent ID</TableHead>
              <TableHead>Environments Allowed</TableHead>
              <TableHead>Environments Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents?.agents?.map(agent => (
              <TableRow key={agent.id}>
                <TableCell>
                  <Link href={`/agent/${agent.agent_id}`}>{agent.name}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/agent/${agent.agent_id}`}>{agent.agent_id}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/agent/${agent.agent_id}`}>{agent.environment_limit}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/agent/${agent.agent_id}`}>{agent.environments ? agent.environments.length : 0}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
