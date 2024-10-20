import {Card} from "~/components/ui/card";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "~/components/ui/table";
import Link from "next/link";
import {type AgentsData} from "~/lib/statemanager";
import {getAgents} from "~/app/api/agent/agent";

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

  return (
    <div className={"gap-3 col-span-2 min-w-[50rem]"}>
      <Card className={"mb-3"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Agent ID</TableCell>
              <TableCell>Environments Allowed</TableCell>
              <TableCell>Environments Used</TableCell>
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
                  <Link href={`/agent/${agent.agent_id}`}>{agent.environments.length}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
