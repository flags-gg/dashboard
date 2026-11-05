"use client"

import {
  environmentAtom,
} from "~/lib/statemanager";
import {EnvironmentSwitch} from "./switch";
import {useAtom} from "jotai";
import {useEffect} from "react";
import { useEnvironment } from "~/hooks/use-environment";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useAgent } from "~/hooks/use-agent";
import { useFlags } from "@flags-gg/react-library";
import { CopyValue, SettingRow, SettingsSection, SettingsSkeleton } from "~/components/settings";
import Name from "./name";
import Clone from "./clone";
import ConnectApp from "./connect-app";

export default function Info({environmentId, menuId}: {environmentId: string, menuId: string}) {
  const { data: environmentInfo, error, isLoading } = useEnvironment(environmentId)
  const { data: agentInfo } = useAgent(environmentInfo?.agent_id ?? "")
  const projectId = agentInfo?.project_info?.project_id
  const { is } = useFlags()

  const [, setSelectedEnvironment] = useAtom(environmentAtom)
  useEffect(() => {
    if (environmentInfo) {
      setSelectedEnvironment(environmentInfo)
    }
  }, [environmentInfo])

  if (isLoading) {
    return <SettingsSkeleton />
  }

  if (error ?? !environmentInfo) {
    return (
      <Alert>
        <AlertTitle>Error loading environment</AlertTitle>
        <AlertDescription>There was an error loading the environment</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={"space-y-6"}>
      <SettingsSection title={"General"} action={<Clone environment_id={environmentId} agent_id={environmentInfo.agent_id} />}>
        <SettingRow label={"Name"}><Name environment_id={environmentId} /></SettingRow>
        <SettingRow label={"Environment ID"} description={"Used by SDKs to pick this environment's flags."}>
          <CopyValue value={environmentInfo.environment_id} what={"Environment ID"} />
        </SettingRow>
        <SettingRow label={"Enabled"} description={"Turn the whole environment on or off."}>
          <EnvironmentSwitch environmentId={environmentInfo.environment_id} />
        </SettingRow>
      </SettingsSection>

      <SettingsSection title={"Secret menu"} description={"A hidden key sequence that lets testers override flags in the app."}>
        <SettingRow label={"Status"}>
          {menuId ? (
            <>
              <Badge variant={environmentInfo.secret_menu?.enabled ? "default" : "secondary"}>{environmentInfo.secret_menu?.enabled ? "Enabled" : "Disabled"}</Badge>
              <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={`/secretmenu/${menuId}`}>Manage</Link>
            </>
          ) : (
            <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={`/secretmenu/?environment=${environmentId}`}>Create</Link>
          )}
        </SettingRow>
      </SettingsSection>

      {is("view guide")?.enabled() && (
        <ConnectApp projectId={projectId} agentId={environmentInfo.agent_id} environmentId={environmentInfo.environment_id} />
      )}
    </div>
  );
}
