"use client"

import {Switch} from "~/components/ui/switch";
import { environmentAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { toast } from "sonner";

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
      console.error('Failed to enable/disable menu', e)
    }
  }
}

export function MenuSwitch({menu_id}: { menu_id: string }) {
  const [selectedEnvironment, setSelectedEnvironment] = useAtom(environmentAtom)

  return (
    <Switch checked={selectedEnvironment?.secret_menu?.enabled} name={"menu"} onCheckedChange={() => {
      enableDisableMenu(menu_id).then(() => {
        toast("Menu Updated", {
          description: "The menu has been updated",
        })
        setSelectedEnvironment({
          ...selectedEnvironment,
          secret_menu: {
            ...selectedEnvironment.secret_menu,
            enabled: !selectedEnvironment.secret_menu.enabled,
          }
        })
      }).catch((e) => {
        toast("Error Updating Menu", {
          description: `There was an error updating the menu: ${e}`,
        })
      })
    }} />
  )
}
