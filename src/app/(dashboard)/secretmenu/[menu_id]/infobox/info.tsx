"use client"

import {
  secretMenuAtom
} from "~/lib/statemanager";
import {useAtom} from "jotai";
import {useEffect} from "react";
import {MenuSwitch} from "../switch";
import { SecretMenu } from "~/lib/interfaces";

export default function Info({secretMenuInfo}: {secretMenuInfo: SecretMenu}) {
  const [, setSelectedSecretMenu] = useAtom(secretMenuAtom)
  useEffect(() => {
    setSelectedSecretMenu(secretMenuInfo)
  }, [secretMenuInfo, setSelectedSecretMenu])

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Enabled</span>
          <span><MenuSwitch menu_id={secretMenuInfo.menu_id} /></span>
        </li>
      </ul>
    </div>
  );
}
