"use client"

import {type Session} from "next-auth";
import {Switch} from "~/components/ui/switch";
import { environmentAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";

async function enableDisableMenu(session: Session, menu_id: string) {
  try {
    const response = await fetch('/api/secretmenu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menu_id: menu_id,
      }),
    })
    if (!response.ok) {
      return new Error('Failed to enable/disable menu')
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to enable/disable menu: ${e.message}`)
    } else {
      console.error('Failed to enable/disable menu', e)
    }
  }
}

export function MenuSwitch({session, menu_id}: { session: Session, menu_id: string }) {
  const [selectedEnvironment] = useAtom(environmentAtom)

  return (
    <Switch defaultChecked={selectedEnvironment.secret_menu.enabled} name={"menu"} onCheckedChange={() => {
      enableDisableMenu(session, menu_id).then(r => {
        console.info("Menu updated", r);
      }).catch((e) => {
        console.error("Error updating menu", e);
      })
    }} />
  )
}
