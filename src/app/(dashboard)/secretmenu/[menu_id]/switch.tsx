"use client"

import {type Session} from "next-auth";
import {Switch} from "~/components/ui/switch";

async function enableDisableMenu(session: Session, menu_id: string) {
  try {
    const response = await fetch('/api/enableDisableMenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menu_id: menu_id,
        sessionToken: session.user.access_token,
        userId: session.user.id,
      }),
    })
    if (!response.ok) {
      return new Error('Failed to enable/disable menu')
    }
  } catch (e) {
    throw new Error('Failed to enable/disable menu')
  }
}

export function MenuSwitch({session, menu_id}: { session: Session, menu_id: string }) {
  return (
    <Switch defaultChecked={true} name={"menu"} onCheckedChange={() => {
      enableDisableMenu(session, menu_id).then(r => {
        console.info("Menu updated", r);
      }).catch((e) => {
        console.error("Error updating menu", e);
      })
    }} />
  )
}
