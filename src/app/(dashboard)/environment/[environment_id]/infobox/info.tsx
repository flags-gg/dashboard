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
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useAgent } from "~/hooks/use-agent";
import { useFlags } from "@flags-gg/react-library";
import { CopyValue, SettingRow, SettingsSection, SettingsSkeleton } from "~/components/settings";
import Name from "./name";
import Clone from "./clone";

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

  const snippet = `<FlagsProvider options={{
  projectId: "${projectId ?? ""}",
  agentId: "${environmentInfo.agent_id}",
  environmentId: "${environmentInfo.environment_id}",
}}>`

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
        <SettingsSection title={"Connect your app"} description={"Wrap your React app with this to read the flags of this environment."}
          action={<Button variant={"outline"} size={"sm"} onClick={() => void navigator.clipboard.writeText(snippet).then(() => toast("Configuration copied"))}><Copy className={"size-4"} />Copy</Button>}>
          <pre className={"overflow-x-auto p-4 text-xs"}><code>{snippet}</code></pre>
        </SettingsSection>
      )}
    </div>
  );
}
