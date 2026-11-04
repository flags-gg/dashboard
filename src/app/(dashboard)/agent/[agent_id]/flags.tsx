import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { getAgentFlags } from "~/app/api/agent/flags";
import { FlagSwitch } from "~/app/(dashboard)/environment/[environment_id]/flags/switch";
import CreateFlag from "~/app/(dashboard)/environment/[environment_id]/flags/create";
import { PromoteButton, RemoveFlag } from "./flag-actions";
import type { AgentFlags } from "~/lib/interfaces";
import { logError } from "~/lib/logger";

// One row per flag, one column per environment (lowest level first): a flag starts in the first
// environment and is promoted rightwards towards production.
export default async function FlagMatrix({ agent_id }: { agent_id: string }) {
  let data: AgentFlags;
  try {
    data = await getAgentFlags(agent_id);
  } catch (e) {
    logError("agent flags", e);
    return <Card className={"col-span-2 p-3"}>Error loading flags</Card>;
  }

  const envs = data.environments;
  const first = envs[0];

  return (
    <div className={"col-span-2 min-w-[40rem]"}>
      <div className={"mb-3 flex items-center justify-between"}>
        <p className={"text-sm text-muted-foreground"}>
          New flags start off in {first?.name ?? "the first environment"}, then are promoted towards production.
        </p>
        {first && <CreateFlag environment_id={first.environment_id} agent_id={agent_id} />}
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flag</TableHead>
              {envs.map(env => (
                <TableHead key={env.environment_id}>
                  {env.name}{env.production && <Badge variant={"secondary"} className={"ml-2"}>production</Badge>}
                </TableHead>
              ))}
              <TableHead className={"w-0"}><span className={"sr-only"}>Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.flags.length === 0 && (
              <TableRow>
                <TableCell colSpan={envs.length + 2} className={"text-center text-muted-foreground"}>
                  {first ? "No flags yet" : "Create an environment before adding flags"}
                </TableCell>
              </TableRow>
            )}
            {data.flags.map(flag => {
              const byEnv = new Map(flag.states.map(s => [s.environment_id, s]));
              // the promote button sits in the first environment after the deepest one the flag has reached
              const deepest = envs.reduce((d, env, i) => (byEnv.has(env.environment_id) ? i : d), -1);
              return (
                <TableRow key={flag.name}>
                  <TableCell>
                    <div className={"font-medium"}>{flag.name}</div>
                    {flag.ticket && <Badge variant={"outline"} className={"mt-1 font-mono"}>{flag.ticket}</Badge>}
                  </TableCell>
                  {envs.map((env, i) => {
                    const state = byEnv.get(env.environment_id);
                    const from = deepest >= 0 ? byEnv.get(envs[deepest]!.environment_id) : undefined;
                    return (
                      <TableCell key={env.environment_id}>
                        {state ? (
                          <FlagSwitch flag={{ enabled: state.enabled, details: { id: state.flag_id, name: flag.name, lastChanged: "", promoted: false } }} />
                        ) : i === deepest + 1 && from ? (
                          <PromoteButton flagId={from.flag_id} to={env.name} />
                        ) : (
                          <span className={"text-muted-foreground"} title={"Not promoted yet"}>—</span>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <RemoveFlag agentId={agent_id} name={flag.name} ticket={flag.ticket} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
