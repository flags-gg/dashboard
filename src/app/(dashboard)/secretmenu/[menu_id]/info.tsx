"use client"

import {
  agentAtom,
  type BreadCrumb,
  breadCrumbAtom,
  environmentAtom,
  projectAtom,
  type secretMenu,
  secretMenuAtom
} from "~/lib/statemanager";
import {type Session} from "next-auth";
import {useAtom} from "jotai";
import {useEffect} from "react";
import {MenuSwitch} from "./switch";

export default function Info({secretMenuInfo, session}: {secretMenuInfo: secretMenu, session: Session}) {
  const [, setSelectedSecretMenu] = useAtom(secretMenuAtom)
  useEffect(() => {
    setSelectedSecretMenu(secretMenuInfo)
  }, [secretMenuInfo, setSelectedSecretMenu])

  const [, setBreadcrumbs] = useAtom(breadCrumbAtom)
  const [project] = useAtom(projectAtom)
  const [agent] = useAtom(agentAtom)
  const [environmentInfo] = useAtom(environmentAtom)
  useEffect(() => {
    setBreadcrumbs([])
    const breadcrumbs: Array<BreadCrumb> = [
      {title: "Projects", url: "/projects"},
      {title: project?.name, url: `/project/${project?.project_id}`},
      {title: agent?.name, url: `/agent/${agent?.agent_id}`},
      {title: environmentInfo?.name, url: `/environment/${environmentInfo?.environment_id}`},
      {title: "Secret Menu", url: `/secretmenu/${secretMenuInfo?.menu_id}`},
    ]
    setBreadcrumbs(breadcrumbs)
  }, [environmentInfo, project, agent, setBreadcrumbs])

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Enabled</span>
          <span><MenuSwitch session={session} menu_id={secretMenuInfo.menu_id} /></span>
        </li>
      </ul>
    </div>
  );
}
