import {useSortable} from "@dnd-kit/sortable";

export default function Sortable({item, index, onRemove}: {item: {id: string, icon: string}, index: number, onRemove: (id: number) => void}) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: item.id,
  })

  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 bg-black rounded-md cursor-pointer"
      style={{
        transition: transition ?? undefined,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      onDoubleClick={() => onRemove(index)}
    >
      {item.icon}
    </span>
  )
}
