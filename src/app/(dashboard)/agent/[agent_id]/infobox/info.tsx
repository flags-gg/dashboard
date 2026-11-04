"use client"

import {agentAtom} from "~/lib/statemanager";
import { useAtom } from "jotai";
import {useEffect} from "react";
import { AgentSwitch } from "./switch";
import { useAgent } from "~/hooks/use-agent";
import { CopyValue, SettingRow, SettingsSection, SettingsSkeleton } from "~/components/settings";
import Name from "./name";

export default function AgentInfo({agent_id}: {agent_id: string}) {
  const [, setSelectedAgent] = useAtom(agentAtom);
  const {data: agentInfo, isLoading} = useAgent(agent_id);


  useEffect(() => {
    if (agentInfo) {
      setSelectedAgent(agentInfo);
    }
  }, [agentInfo]);

  if (isLoading) {
    return <SettingsSkeleton />
  }

  return (
    <SettingsSection title={"General"}>
      <SettingRow label={"Name"}><Name agent_id={agent_id} /></SettingRow>
      <SettingRow label={"Agent ID"} description={"Used by SDKs to identify this app."}>
        <CopyValue value={agent_id} what={"Agent ID"} />
      </SettingRow>
      <SettingRow label={"Enabled"} description={"A disabled agent serves no flags in any environment."}>
        <AgentSwitch agent_id={agent_id} />
      </SettingRow>
      <SettingRow label={"Environments"}>
        <span className={"text-sm tabular-nums"}>{agentInfo?.environments?.length ?? 0} of {agentInfo?.environment_limit}</span>
      </SettingRow>
      <SettingRow label={"Request limit"}>
        <span className={"text-sm tabular-nums"}>{agentInfo?.request_limit.toLocaleString()}</span>
      </SettingRow>
    </SettingsSection>
  );
}
