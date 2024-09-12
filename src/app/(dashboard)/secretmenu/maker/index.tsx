"use client"

import {type Session} from "next-auth";
import {Card, CardContent, CardFooter} from "~/components/ui/card";
import {closestCenter, DndContext, type DragEndEvent} from "@dnd-kit/core";
import {KeyMap} from "./keymap";
import Draggable from "./draggable";
import DropTarget from "./droptarget";
import {useEffect, useState} from "react";
import {arrayMove} from "@dnd-kit/sortable";
import {Separator} from "~/components/ui/separator";
import {Button} from "~/components/ui/button";

interface SecretMenuData {
  menu_id: string,
  enabled: boolean,
  sequence: string[]
}

async function getMenu(session: Session, menuId: string): Promise<SecretMenuData | Error> {
  try {
    const response = await fetch('/api/secretmenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuId: menuId,
        sessionToken: session.user.access_token,
        userId: session.user.id,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      console.error("getMenu", "response", response);
      return new Error('Failed to get secret menu')
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json()
  } catch (e) {
    console.error("getMenu", 'Error getting secret menu:', e)
    throw new Error('Failed to get secret menu')
  }
}

async function saveMenu(session: Session, menu_id: string, sequence: string[]) {
  try {
    const response = await fetch('/api/secretmenu/sequence', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionToken: session.user.access_token,
        userId: session.user.id,
        menuId: menu_id,
        sequence: sequence,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      return new Error('Failed to save secret menu sequence')
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json()
  } catch (e) {
    console.error('Error saving secret menu sequence:', e)
    throw new Error('Failed to save secret menu sequence')
  }
}

export default function Maker({session, menuId}: {session: Session, menuId: string}) {
  const [code, setCode] = useState<{id: string, icon: string, keyCode: string}[]>([])

  useEffect(() => {
    getMenu(session, menuId).then(resp => {
      if ("sequence" in resp && resp?.sequence) {
        setCodeSequence(resp.sequence)
      }
    }).catch((e) => {
      console.error("Error retrieving menu", e);
    })
  }, [menuId, session])

  const setCodeSequence = (sequence: string[]) => {
    const newSequence = sequence.map((keyId) => {
      const key = KeyMap.find((k) => k.id === keyId)
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
      const key = KeyMap.find((item) => item.id === active.id)
      if (key) {
        const updatedCode = [...code]
        updatedCode.splice(newIndex, 0, {id: `${active.id}-${Math.random()}`, icon: key.icon, keyCode: key.id})
        setCode(updatedCode)
      }
    } else {
      setCode(arrayMove(code, oldIndex, newIndex))
    }
  }

  const handleRemove = (id: number) => {
    setCode(code.filter((_, i) => i !== id))
  }

  return (
    <div className="col-span-2 gap-3">
      <Card className={"mb-3"}>
        <CardContent className={"p-6 text-sm"}>
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className={"flex justify-center mb-5 gap-3 flex-wrap"}>
              {KeyMap.map((key, _) => (
                <Draggable key={`${key.id}-draggable`} id={key.id} icon={key.icon} />
              ))}
            </div>
            <Separator />
            <DropTarget sequence={code} onRemove={handleRemove} />
          </DndContext>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {
            const sequence = code.map((key) => key.keyCode)

            saveMenu(session, menuId, sequence).catch((e) => {
              console.error("Error saving menu", e);
            })
          }} className={"w-full"}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
