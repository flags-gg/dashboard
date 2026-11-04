import { currentUser } from "@clerk/nextjs/server";
import { SettingRow, SettingsSection } from "~/components/settings";
import ProjectInfo from "./info";
import Delete from "./delete";

// The project settings tab.
export default async function InfoBox({project_id}: {project_id: string}) {
  if (!(await currentUser())) {
    return <></>
  }

  return (
    <div className={"space-y-6"}>
      <ProjectInfo project_id={project_id} />
      <SettingsSection title={"Danger zone"} danger>
        <SettingRow label={"Delete this project"} description={"Removes the project with all its agents, environments and flags."}>
          <Delete project_id={project_id} />
        </SettingRow>
      </SettingsSection>
    </div>
  )
}
