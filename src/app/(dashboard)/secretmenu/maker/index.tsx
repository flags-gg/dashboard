"use client"

import {Card, CardContent, CardFooter} from "~/components/ui/card";
import {DndContext, type DragEndEvent, rectIntersection} from "@dnd-kit/core";
import {DirectionMap, LetterMap, NumberMap} from "./keymap";
import Draggable from "./draggable";
import DropTarget from "./droptarget";
import {useEffect, useState} from "react";
import {arrayMove} from "@dnd-kit/sortable";
import {Separator} from "~/components/ui/separator";
import {Button} from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { useAtom } from "jotai";
import { environmentAtom } from "~/lib/statemanager";

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
      console.error("createMenuId response", response);
      return new Error('Failed to create secret menu ID')
    }
    return await response.json()
  } catch (e) {
    console.error("createMenuId", 'Error creating secret menu:', e)
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
      console.error("getMenu response", response);
      return new Error('Failed to get secret menu')
    }
    return await response.json()
  } catch (e) {
    console.error("getMenu", 'Error getting secret menu:', e)
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
    console.error('Error saving secret menu sequence:', e)
    throw new Error('Failed to save secret menu sequence')
  }
}

export default function Maker({menuId}: {menuId: string}) {
  const [code, setCode] = useState<{id: string, icon: string, keyCode: string}[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedEnvironment] = useAtom(environmentAtom)
  const {toast} = useToast()

  useEffect(() => {
    getSequence(menuId).then(resp => {
      if ("sequence" in resp && resp?.sequence) {
        setCodeSequence(resp.sequence)
      }
    }).catch((e) => {
      console.error("Error retrieving menu", e);
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

  if (error) {
    return (
      <div className="col-span-2 gap-3">
        <Card className={"mb-3"}>
          <CardContent className={"p-6 text-sm"}>
            <div className={"flex justify-center mb-5 gap-3 flex-wrap"}>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={"gap-3 col-span-2 min-w-[50rem]"}>
      <Card className={"mb-3"}>
        <CardContent className={"p-6 text-sm"}>
          <DndContext onDragEnd={handleDragEnd} collisionDetection={rectIntersection}>
            <div className={"flex justify-center mb-5 gap-3 flex-wrap"}>
              {DirectionMap?.map((key) => (
                <Draggable key={`${key.id}-draggable`} id={key.id} icon={key.icon} />
              ))}
              <Separator />
              {LetterMap?.map((key) => (
                <Draggable key={`${key.id}-draggable`} id={key.id} icon={key.icon} />
              ))}
              <Separator />
              {NumberMap?.map((key) => (
                <Draggable key={`${key.id}-draggable`} id={key.id} icon={key.icon} />
              ))}
            </div>
            <DropTarget sequence={code} onRemove={handleRemove} />
          </DndContext>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {
            const sequence = code?.map((key) => key.keyCode)

            if (menuId === "") {
              createMenuId(selectedEnvironment.environment_id, sequence).then(() => {
                toast({
                  title: "Menu Saved",
                  description: "Saved the menu"
                })
              }).catch((e) => {
                console.error("Error creating menu", e);
                setError("Error creating menu")
              })

              return
            }

            saveSequence(menuId, sequence).catch((e) => {
              console.error("Error saving menu", e);
              setError("Error saving menu")
            })
          }} className={"w-full"}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
