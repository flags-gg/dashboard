"use client"

import {Switch} from "~/components/ui/switch";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logError } from "~/lib/logger";

async function enableDisableMenu(menu_id: string) {
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
      logError('Failed to enable/disable menu', e)
    }
  }
}

export function MenuSwitch({menu_id, enabled}: { menu_id: string; enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const queryClient = useQueryClient()

  return (
    <Switch checked={isEnabled} name={"menu"} onCheckedChange={() => {
      enableDisableMenu(menu_id).then((result) => {
        if (result instanceof Error) throw result
        setIsEnabled(!isEnabled)
        void queryClient.invalidateQueries({ queryKey: ["environment"] })
        toast("Menu Updated", {
          description: "The menu has been updated",
        })
      }).catch((e) => {
        toast("Error Updating Menu", {
          description: `There was an error updating the menu: ${e}`,
        })
      })
    }} />
  )
}
