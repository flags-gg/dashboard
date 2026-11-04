import {useDroppable} from "@dnd-kit/core";
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import Sortable from "./sortable";
import { cn } from "~/lib/utils";

interface DropTargetProps {
  sequence: {id: string, icon: string}[];
  onRemove: (id: number) => void;
}

export default function DropTarget({sequence, onRemove}: DropTargetProps) {
  const {setNodeRef, isOver} = useDroppable({
    id: 'drop-target',
  })

  return (
    <div ref={setNodeRef} aria-label="Secret menu sequence"
      className={cn("flex min-h-16 flex-wrap items-center gap-2 rounded-lg border-2 border-dashed p-3 transition-colors", isOver && "border-primary bg-muted/40")}>
      {sequence.length === 0 && <p className="px-1 text-sm text-muted-foreground">Click keys below, or drag them here.</p>}
      <SortableContext items={sequence} strategy={horizontalListSortingStrategy}>
        {sequence.map((key, index) => (
          <Sortable key={key.id} item={key} index={index} onRemove={onRemove} />
        ))}
      </SortableContext>
    </div>
  );
}
