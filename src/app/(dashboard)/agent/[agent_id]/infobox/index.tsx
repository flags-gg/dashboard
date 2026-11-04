import CreateEnvironment from "~/app/(dashboard)/environment/create";
import { SettingRow, SettingsSection } from "~/components/settings";
import EnvironmentsList from "../list";
import AgentInfo from "./info";
import Delete from "./delete";

// The agent's "Environments & agent" tab.
export default async function InfoBox({agent_id}: {agent_id: string}) {
  return (
    <div className={"space-y-6"}>
      <SettingsSection title={"Environments"} description={"Flags are promoted through these in order; the last one is production."}
        action={<CreateEnvironment agent_id={agent_id} />}>
        <EnvironmentsList agent_id={agent_id} />
      </SettingsSection>
      <AgentInfo agent_id={agent_id} />
      <SettingsSection title={"Danger zone"} danger>
        <SettingRow label={"Delete this agent"} description={"Removes the agent, its environments and flags. Apps using it stop receiving flags."}>
          <Delete agent_id={agent_id} />
        </SettingRow>
      </SettingsSection>
    </div>
  );
}
