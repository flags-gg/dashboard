import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { tableFrame } from "~/components/page-intro";
import type { AgentsData } from "~/lib/interfaces";
import { getAgents } from "~/app/api/agent/agent";
import { getEnvironments } from "~/app/api/environment/environment";
import { logError } from "~/lib/logger";

export default async function AgentsList({ project_id }: { project_id: string }) {
  let agents: AgentsData;
  try {
    agents = await getAgents(project_id);
  } catch (e) {
    logError(e);
    return <p className="rounded-lg border p-4 text-sm">Failed to load agents.</p>;
  }

  const rows = await Promise.all((agents?.agents ?? []).map(async agent => {
    const { data } = await getEnvironments(agent.agent_id);
    const envs = (data?.environments ?? []).slice().sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
    return { agent, envs };
  }));

  return (
    <div className={tableFrame}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-1/3">Agent</TableHead>
            <TableHead>Environments</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">No agents yet. An agent is an app that reads flags.</TableCell>
            </TableRow>
          )}
          {rows.map(({ agent, envs }) => (
            <TableRow key={agent.id} className="relative">
              <TableCell>
                <Link href={`/agent/${agent.agent_id}`} className="font-medium after:absolute after:inset-0">{agent.name}</Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {envs.length ? envs.map(e => e.name).join(" → ") : "None yet"}
                <span className="ml-2 tabular-nums">({envs.length}/{agent.environment_limit})</span>
              </TableCell>
              <TableCell><code className="text-xs text-muted-foreground">{agent.agent_id}</code></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
