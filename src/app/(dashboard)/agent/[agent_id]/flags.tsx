import { getAgentFlags } from "~/app/api/agent/flags";
import CreateFlag from "~/app/(dashboard)/environment/[environment_id]/flags/create";
import { FlagTable } from "./flag-table";
import { logError } from "~/lib/logger";

// Flags are rows, environments are columns (lowest first); a flag starts off in the first
// environment and is promoted towards production, optionally to a percentage of visitors.
export default async function FlagMatrix({ agent_id }: { agent_id: string }) {
  try {
    const data = await getAgentFlags(agent_id);
    const first = data.environments[0];
    return (
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Flags</h1>
            <p className="text-sm text-muted-foreground">
              New flags start off in {first?.name ?? "the first environment"}. Click a state to toggle it or roll it out to a percentage of visitors.
            </p>
          </div>
          {first && <CreateFlag environment_id={first.environment_id} agent_id={agent_id} />}
        </div>
        <FlagTable data={data} agentId={agent_id} />
      </section>
    );
  } catch (e) {
    logError("agent flags", e);
    return <p className="rounded-lg border p-4 text-sm">Error loading flags.</p>;
  }
}
