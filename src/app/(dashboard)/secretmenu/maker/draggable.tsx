"use client"

import {useDraggable} from "@dnd-kit/core";

export default function Draggable({id, icon}: {id: string, icon: string}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({id});

  return (
    <div
        key={`${id}-div`}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        }}
        className={"font-bold text-2xl cursor-move"}
    >
        {icon}
    </div>
  );
}
