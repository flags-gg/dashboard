"use client"

import {Switch} from "~/components/ui/switch"
import {useState} from "react";
import { Flag } from "~/lib/interfaces";
import { logError } from "~/lib/logger";
import { toast } from "sonner";

async function updateFlag(flag: Flag) {
  const response = await fetch('/api/flag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      flag: flag,
    }),
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error('Failed to update flag')
  }
}

export function FlagSwitch({flag}: { flag: Flag }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [flagData, setFlagData] = useState(flag);

  const handleChange = async () => {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateFlag(flagData);
      setFlagData({...flagData, enabled: !flagData.enabled}); // only flip once the API accepted it
    } catch (e) {
      logError('Error updating flag:', e);
      toast('Failed to update flag');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Switch
      checked={flagData.enabled}
      name={flagData.details.id}
      onCheckedChange={handleChange}
      disabled={isUpdating} />
  )
}
