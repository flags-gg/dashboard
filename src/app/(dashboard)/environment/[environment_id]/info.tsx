"use client"

import {
  environmentAtom,
  type IEnvironment,
  type BreadCrumb,
  breadCrumbAtom,
  projectAtom,
  agentAtom
} from "~/lib/statemanager";
import {EnvironmentSwitch} from "~/app/(dashboard)/environment/[environment_id]/switch";
import {type Session} from "next-auth";
import {useAtom} from "jotai";
import {useEffect} from "react";

export default function EnvironmentInfo({environmentInfo, session}: {environmentInfo: IEnvironment, session: Session}) {
  const [, setSelectedEnvironment] = useAtom(environmentAtom)
  useEffect(() => {
    setSelectedEnvironment(environmentInfo)
  }, [environmentInfo, setSelectedEnvironment])

  const [, setBreadcrumbs] = useAtom(breadCrumbAtom)
  const [project] = useAtom(projectAtom)
  const [agent] = useAtom(agentAtom)
  useEffect(() => {
    setBreadcrumbs([])
    const breadcrumbs: Array<BreadCrumb> = [
      {title: "Projects", url: "/projects"},
      {title: project.name, url: `/project/${project.project_id}`},
      {title: agent.name, url: `/agent/${agent.agent_id}`},
      {title: environmentInfo.name, url: `/environment/${environmentInfo.environment_id}`},
    ]
    setBreadcrumbs(breadcrumbs)
  }, [environmentInfo, project, agent, setBreadcrumbs])

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Environment ID</span>
          <span>{environmentInfo.environment_id}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Enabled</span>
          <span><EnvironmentSwitch session={session} environment_id={environmentInfo.environment_id} /></span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Secret Menu</span>
          <span>{environmentInfo.secret_menu.enabled ? "Enabled" : "Disabled"}</span>
        </li>
      </ul>
    </div>
  );
}
