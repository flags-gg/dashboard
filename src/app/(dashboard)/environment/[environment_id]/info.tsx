"use client"

import {environmentAtom, type IEnvironment} from "~/lib/statemanager";
import {EnvironmentSwitch} from "~/app/(dashboard)/environment/[environment_id]/switch";
import {type Session} from "next-auth";
import {useAtom} from "jotai";
import {useEffect} from "react";

export default function EnvironmentInfo({environmentInfo, session}: {environmentInfo: IEnvironment, session: Session}) {
  const [, setSelectedEnvironment] = useAtom(environmentAtom)
  useEffect(() => {
    setSelectedEnvironment(environmentInfo)
  }, [environmentInfo, setSelectedEnvironment])

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
