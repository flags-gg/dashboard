import {useSortable} from "@dnd-kit/sortable";
import { X } from "lucide-react";

export const keyCap = "inline-flex h-9 min-w-9 items-center justify-center rounded-md border bg-muted/40 px-2 font-mono text-sm font-medium shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// A key in the sequence: drag to reorder, × (or double-click) to remove.
export default function Sortable({item, index, onRemove}: {item: {id: string, icon: string}, index: number, onRemove: (id: number) => void}) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: item.id,
  })

  return (
    <span
      ref={setNodeRef}
      style={{
        transition: transition ?? undefined,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      className={`${keyCap} gap-1 bg-background pr-1`}
      onDoubleClick={() => onRemove(index)}
    >
      <span {...attributes} {...listeners} className="cursor-grab px-1">{item.icon}</span>
      <button type="button" aria-label={`Remove ${item.icon} (position ${index + 1})`} onClick={() => onRemove(index)}
        className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground">
        <X className="size-3" />
      </button>
    </span>
  )
}
