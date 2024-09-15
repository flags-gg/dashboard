"use client"

import {useDroppable} from "@dnd-kit/core";
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import Sortable from "./sortable";

interface DropTargetProps {
  sequence: {id: string, icon: string}[];
  onRemove: (id: number) => void;
}

export default function DropTarget({sequence, onRemove}: DropTargetProps) {
  const {setNodeRef} = useDraggable({
    id: 'drop-target',
  })

  return (
    <div ref={setNodeRef} className="min-h-12 border-dashed p-3 flex gap-3 flex-wrap bg-secondary">
      <SortableContext items={sequence} strategy={rectSortingStrategy}>
        {sequence.map((key, index) => (
          <Sortable key={key.id} item={key} index={index} onRemove={onRemove} />
        ))}
      </SortableContext>
    </div>
  );
}
