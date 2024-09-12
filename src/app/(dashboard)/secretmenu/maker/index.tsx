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
        menu_id: menu_id,
        sessionToken: session.user.access_token,
        userId: session.user.id,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      return new Error('Failed to get secret menu')
    }
  } catch (e) {
    throw new Error('Failed to get secret menu')
  }
}

export default function Maker({session}: {session: Session}) {
  const [selectedSecretMenu] = useAtom(secretMenuAtom)
  const [code, setCode] = useState<{id: string, icon: string}[]>([])

  useEffect(() => {
    getMenu(session, selectedSecretMenu.id).then(r => {
      console.info("Menu retrieved", r);
    }).catch((e) => {
      console.error("Error retrieving menu", e);
    })
  }, [selectedSecretMenu.id, session])

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
        updatedCode.splice(newIndex, 0, {id: `${active.id}-${Math.random()}`, icon: key.icon})
        setCode(updatedCode)
      }
    } else {
      setCode(arrayMove(code, oldIndex, newIndex))
    }
  }

  const handleRemove = (id: number) => {
    setCode(code.filter((_, i) => i !== id))
  }

  console.info("selectedSecretMenu", selectedSecretMenu);

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
            <DropTarget sequence={code} onRemove={handleRemove} setCode={setCode} />
          </DndContext>
        </CardContent>
      </Card>
    </div>
  )
}
