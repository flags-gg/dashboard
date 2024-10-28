"use client"

import {agentAtom} from "~/lib/statemanager";
import { useAtom } from "jotai";
import {useEffect} from "react";
import { AgentSwitch } from "./switch";
import { useAgent } from "~/hooks/use-agent";
import { Skeleton } from "~/components/ui/skeleton";

export default function AgentInfo({agent_id}: {agent_id: string}) {
  const [, setSelectedAgent] = useAtom(agentAtom);
  const {data: agentInfo, isLoading} = useAgent(agent_id);

  useEffect(() => {
    if (agentInfo) {
      setSelectedAgent(agentInfo);
    }
  }, [agentInfo, setSelectedAgent]);

  if (isLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Agent ID</span>
          <span>{agentInfo?.agent_id}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Environment Limit</span>
          <span>{agentInfo?.environment_limit}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Environments Used</span>
          <span>{agentInfo?.environments ? agentInfo?.environments?.length : 0}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Request Limit</span>
          <span>{agentInfo?.request_limit.toLocaleString()}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Enabled</span>
          <span><AgentSwitch agent_id={agent_id} /></span>
        </li>
      </ul>
    </div>
  );
}
