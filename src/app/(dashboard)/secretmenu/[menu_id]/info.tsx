"use client"

import {
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
