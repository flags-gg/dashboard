"use client"

import {Switch} from "~/components/ui/switch";
import {type Session} from "next-auth";
import {type Flag} from "~/lib/statemanager";
import {useState} from "react";

async function updateFlag(session: Session, flag: Flag) {
  try {
    const response = await fetch('/api/flag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flag: flag,
        sessionToken: session.user.access_token,
        userId: session.user.id,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      return new Error('Failed to update flag')
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to update flag: ${e.message}`)
    } else {
      console.error('Failed to update flag:', e)
    }
  }
}

export function FlagSwitch({session, flag}: { session: Session, flag: Flag }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [flagData, setFlagData] = useState(flag);

  const handleChange = async () => {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateFlag(session, flagData);
    } catch (e) {
      console.error('Error updating flag:', e);
    } finally {
      setIsUpdating(false);
      setFlagData({...flagData, enabled: !flagData.enabled});
    }
  }

  return (
    <Switch
      defaultChecked={flagData.enabled}
      name={flagData.details.id}
      onCheckedChange={handleChange}
      disabled={isUpdating} />
  )
}
