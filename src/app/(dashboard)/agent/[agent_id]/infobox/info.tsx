"use client"

import {agentAtom} from "~/lib/statemanager";
import { useAtom } from "jotai";
import { type FlagAgent } from "~/lib/statemanager";
import {useEffect} from "react";

export default function AgentInfo({agentInfo}: {agentInfo: FlagAgent}) {
  const [, setSelectedAgent] = useAtom(agentAtom);
  useEffect(() => {
    setSelectedAgent(agentInfo);
  }, [agentInfo, setSelectedAgent]);

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Agent ID</span>
          <span>{agentInfo.agent_id}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Environment Limit</span>
          <span>{agentInfo.environment_limit}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Environments Used</span>
          <span>{agentInfo.environments ? agentInfo.environments.length : 0}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Request Limit</span>
          <span>{agentInfo.request_limit.toLocaleString()}</span>
        </li>
      </ul>
    </div>
  );
}
