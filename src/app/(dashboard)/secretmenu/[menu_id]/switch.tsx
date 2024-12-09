"use client"

import {Switch} from "~/components/ui/switch";
import { environmentAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { useToast } from "~/hooks/use-toast";

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
  const {toast} = useToast()

  console.info("selectedEnvironment", selectedEnvironment)

  return (
    <Switch checked={selectedEnvironment?.secret_menu?.enabled} name={"menu"} onCheckedChange={() => {
      enableDisableMenu(menu_id).then(() => {
        toast({
          title: "Menu Updated",
          description: "The menu has been updated",
        })
        setSelectedEnvironment((prev) => {
          return {
            ...prev,
            secret_menu: {
              ...prev.secret_menu,
              enabled: !prev.secret_menu.enabled,
            }
          }
        })
      }).catch((e) => {
        toast({
          title: "Error Updating Menu",
          description: `There was an error updating the menu: ${e}`,
        })
      })
    }} />
  )
}
