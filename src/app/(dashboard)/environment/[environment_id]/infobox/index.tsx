import {getEnvironment} from "~/app/api/environment/environment";
import Info from "./info";
import {InfoBoxError} from "~/components/InfoBoxError";
import Delete from "./delete"
import { SettingRow, SettingsSection } from "~/components/settings";
import { logError } from "~/lib/logger";

// The environment settings tab.
export default async function InfoBox({environment_id}: {environment_id: string}) {
  const { data: environmentInfo, error } = await getEnvironment(environment_id)

  if (error ?? !environmentInfo) {
    logError(error)
    return <InfoBoxError name={"environment"} blurb={"Failed to fetch environment"} />
  }

  return (
    <div className={"space-y-6"}>
      <Info environmentId={environmentInfo.environment_id} menuId={environmentInfo.secret_menu.menu_id} />
      <SettingsSection title={"Danger zone"} danger>
        <SettingRow label={"Delete this environment"} description={"Removes it and its flags. Apps using its ID stop receiving flags."}>
          <Delete environment_id={environment_id} agent_id={environmentInfo.agent_id} />
        </SettingRow>
      </SettingsSection>
    </div>
  );
}
