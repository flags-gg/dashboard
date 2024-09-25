"use client"

import {Switch} from "~/components/ui/switch";
import {type Session} from "next-auth";

async function enableDisableEnvironment(session: Session, environment_id: string) {
  try {
    const response = await fetch('/api/enableDisableEnvironment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        environment_id: environment_id,
        sessionToken: session.user.access_token,
        userId: session.user.id,
      }),
    })
    if (!response.ok) {
      return new Error('Failed to enable/disable environment')
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to enable/disable environment: ${e.message}`)
    } else {
      console.error('An unknown error occurred', e)
    }
  }
}

export function EnvironmentSwitch({session, environment_id}: { session: Session, environment_id: string }) {
  return (
    <Switch defaultChecked={true} name={"environment"} onCheckedChange={() => {
      enableDisableEnvironment(session, environment_id).then(r => {
        console.info("Environment updated", r);
      }).catch((e) => {
        console.error("Error updating environment", e);
      })
    }} />
  )
}
