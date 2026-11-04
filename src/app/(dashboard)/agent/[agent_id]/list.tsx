import {Card} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import Link from "next/link";
import {getEnvironments} from "~/app/api/environment/environment";
import CreateChild from "~/app/(dashboard)/agent/[agent_id]/child/create";
import { logError } from "~/lib/logger";

// Environments in promotion order (dev first); only the last one can get a child.
export default async function EnvironmentsList({ agent_id }: { agent_id: string }) {
  const { data: environments, error } = await getEnvironments(agent_id);

  if (error ?? !environments) {
    logError(error);
    return <Card className={"p-3 lg:col-span-2"}>Error loading environments</Card>
  }

  const sorted = (environments.environments ?? []).slice().sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
  const last = sorted.at(-1);

  return (
    <Card className={"overflow-x-auto p-0 lg:col-span-2"}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Environment</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right"><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((environment, i) => (
            <TableRow key={environment.id}>
              <TableCell className="whitespace-nowrap">
                <Link className="font-medium hover:underline" href={`/environment/${environment.environment_id}`}>
                  <span className="text-muted-foreground tabular-nums">{i + 1}.</span> {environment.name}
                </Link>
                {environment === last && sorted.length > 1 && <Badge variant="secondary" className="ml-2 text-[10px]">prod</Badge>}
              </TableCell>
              <TableCell>
                <code className="text-xs text-muted-foreground select-all">{environment.environment_id}</code>
              </TableCell>
              <TableCell>
                <Badge variant={environment.enabled ? "outline" : "secondary"}>{environment.enabled ? "Enabled" : "Disabled"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {environment === last && <CreateChild envId={environment.environment_id} agentId={agent_id}/>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
