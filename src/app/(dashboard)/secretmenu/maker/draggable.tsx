"use client"

import {useDraggable} from "@dnd-kit/core";
import { keyCap } from "./sortable";

// A key you can click to append, or drag into a position in the sequence.
export default function Draggable({id, icon, onAdd}: {id: string, icon: string, onAdd: (id: string) => void}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({id});

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`Add ${id}`}
      onClick={() => onAdd(id)}
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}
      className={`${keyCap} cursor-grab hover:bg-muted active:cursor-grabbing`}
    >
      {icon}
    </button>
  );
}
