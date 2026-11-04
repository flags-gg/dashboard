"use client"

import {DndContext, type DragEndEvent, PointerSensor, rectIntersection, useSensor, useSensors} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { SettingsSection } from "~/components/settings";
import {DirectionMap, LetterMap, NumberMap} from "./keymap";
import Draggable from "./draggable";
import DropTarget from "./droptarget";
import {useEffect, useState} from "react";
import {arrayMove} from "@dnd-kit/sortable";
import {Button} from "~/components/ui/button";
import { toast } from "sonner";
import { logError } from "~/lib/logger";

interface SecretMenuData {
  menu_id: string,
  enabled: boolean,
  sequence: string[]
}

async function createMenuId(envId: string, sequence: string[]): Promise<SecretMenuData | Error> {
  try {
    const response = await fetch('/api/secretmenu/sequence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sequence: sequence,
        environmentId: envId,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      logError("createMenuId response", response);
      return new Error('Failed to create secret menu ID')
    }
    return await response.json()
  } catch (e) {
    logError("createMenuId", 'Error creating secret menu:', e)
    throw new Error('Failed to create secret menu')
  }
}

async function getSequence(menuId: string): Promise<SecretMenuData | Error> {
  try {
    const response = await fetch('/api/secretmenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuId: menuId,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      return new Error('Failed to get secret menu')
    }
    return await response.json()
  } catch (e) {
    logError("getMenu", 'Error getting secret menu:', e)
    throw new Error('Failed to get secret menu')
  }
}

async function saveSequence(menu_id: string, sequence: string[]) {
  try {
    const response = await fetch('/api/secretmenu/sequence', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuId: menu_id,
        sequence: sequence,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      return new Error('Failed to save secret menu sequence')
    }
    return await response.json()
  } catch (e) {
    logError('Error saving secret menu sequence:', e)
    throw new Error('Failed to save secret menu sequence')
  }
}

export default function Maker({menuId, environmentId}: {menuId: string; environmentId?: string}) {
  const [code, setCode] = useState<{id: string, icon: string, keyCode: string}[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    getSequence(menuId).then(resp => {
      if ("sequence" in resp && resp?.sequence) {
        setCodeSequence(resp.sequence)
      }
    }).catch((e) => {
      logError("Error retrieving menu", e);
      setError("Error retrieving menu")
    })
  }, [menuId])

  const setCodeSequence = (sequence: string[]) => {
    const newSequence = sequence?.map((keyId) => {
      const direction = DirectionMap.find((k) => k.id === keyId)
      const letter = LetterMap.find((k) => k.id === keyId)
      const number = NumberMap.find((k) => k.id === keyId)
      const key = (direction ?? letter) ?? number

      return key ? {id: `${key.id}-${Math.random()}`, icon: key.icon, keyCode: key.id} : {id: keyId, icon: keyId, keyCode: keyId}
    })
    setCode(newSequence)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event
    if (!over) {
      const index = code.findIndex((item) => item.id === active.id)
      if (index === -1) {
        setCode(code.filter((_, i) => i !== index))
      }
      return
    }
    if (active.id === over.id) {
      return
    }
    const oldIndex = code.findIndex((item) => item.id === active.id)
    const newIndex = code.findIndex((item) => item.id === over.id)
    if (oldIndex === -1 || newIndex === -1) {
      const direction = DirectionMap.find((item) => item.id === active.id)
      const letter = LetterMap.find((item) => item.id === active.id)
      const number = NumberMap.find((item) => item.id === active.id)
      const key = (direction ?? letter) ?? number

      if (key) {
        const updatedCode = [...code]
        const insertIndex = newIndex === -1 ? updatedCode.length : newIndex
        updatedCode.splice(insertIndex, 0, {id: `${active.id}-${Math.random()}`, icon: key.icon, keyCode: key.id})
        setCode(updatedCode)
      }
    } else {
      setCode(arrayMove(code, oldIndex, newIndex))
    }
  }

  const handleRemove = (id: number) => {
    setCode(code.filter((_, i) => i !== id))
  }

  const handleAdd = (keyId: string) => {
    const key = [...DirectionMap, ...LetterMap, ...NumberMap].find((k) => k.id === keyId)
    if (key) {
      setCode([...code, {id: `${key.id}-${Math.random()}`, icon: key.icon, keyCode: key.id}])
    }
  }

  const save = () => {
    setError(null)
    const sequence = code.map((key) => key.keyCode)

    if (menuId === "") {
      if (!environmentId) {
        setError("No environment selected, open the secret menu from an environment page")
        return
      }
      createMenuId(environmentId, sequence).then((resp) => {
        if (resp instanceof Error) throw resp
        toast("Secret menu created")
        router.push(`/secretmenu/${resp.menu_id}`)
      }).catch((e) => {
        logError("Error creating menu", e);
        setError("Error creating menu")
      })
      return
    }

    saveSequence(menuId, sequence).then((resp) => {
      if (resp instanceof Error) throw resp
      toast("Secret menu saved")
    }).catch((e) => {
      logError("Error saving menu", e);
      setError("Error saving menu")
    })
  }

  const keyRow = (label: string, keys: {id: string, icon: string}[]) => (
    <div className={"space-y-2"}>
      <p className={"text-xs font-medium uppercase tracking-wide text-muted-foreground"}>{label}</p>
      <div className={"flex flex-wrap gap-1.5"}>
        {keys.map((key) => <Draggable key={`${key.id}-draggable`} id={key.id} icon={key.icon} onAdd={handleAdd} />)}
      </div>
    </div>
  )

  return (
    // pointer drags start after a small move, so a plain click (or Enter) adds the key instead
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={rectIntersection}>
      <div className={"space-y-6"}>
        <SettingsSection title={"Sequence"} description={"What testers type, in order."}
          action={<div className={"flex gap-2"}>
            <Button variant={"ghost"} size={"sm"} disabled={code.length === 0} onClick={() => setCode([])}>Clear</Button>
            <Button size={"sm"} disabled={code.length === 0} onClick={save}>Save</Button>
          </div>}>
          <div className={"space-y-2 p-4"}>
            <DropTarget sequence={code} onRemove={handleRemove} />
            {error && <p role={"alert"} className={"text-sm text-destructive"}>{error}</p>}
          </div>
        </SettingsSection>
        <SettingsSection title={"Keys"}>
          <div className={"space-y-4 p-4"}>
            {keyRow("Arrows", DirectionMap)}
            {keyRow("Letters", LetterMap)}
            {keyRow("Numbers", NumberMap)}
          </div>
        </SettingsSection>
      </div>
    </DndContext>
  )
}
