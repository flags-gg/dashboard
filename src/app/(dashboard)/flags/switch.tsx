"use client"

import {Switch} from "~/components/ui/switch";
import {type Session} from "next-auth";
import {type Flag} from "~/lib/statemanager";

async function updateFlag(session: Session, flag: Flag) {
  try {
    const response = await fetch('/api/updateFlag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flag: flag,
        sessionToken: session.user.access_token,
        userId: session.user.id,
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to update flag')
    }
  } catch (e) {
    throw new Error('Failed to update flag')
  }
}

export function FlagSwitch({session, flag}: { session: Session, flag: Flag }) {
  return (
    <Switch defaultChecked={flag.enabled} name={flag.details.id} onCheckedChange={() => {
      updateFlag(session, flag)
          .then(r => {
            console.info("Flag updated", r);
          })
          .catch((e) => {
            console.error("Error updating flag", e);
          });
    }} />
  )
}
