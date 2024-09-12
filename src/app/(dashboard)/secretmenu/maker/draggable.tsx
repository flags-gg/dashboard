"use client"

import {useDraggable} from "@dnd-kit/core";
import {Tooltip, TooltipContent} from "~/components/ui/tooltip";

export default function Draggable({id, icon}: {id: string, icon: string}) {
  const {attributes, listeners, setNodeRef} = useDraggable({id});

  return (
    <Tooltip key={`${id}-tooltip`}>
      <TooltipContent key={`${id}-tooltip-content`}>
        <div
          key={`${id}-div`}
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={"font-bold text-2xl cursor-move"}
        >
          {icon}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
