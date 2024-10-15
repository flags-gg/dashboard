"use client"

import { useFlags } from "@flags-gg/react-library";
import { environmentAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

export default function Clone({environment_id}: {environment_id: string}) {
  const [environmentInfo] = useAtom(environmentAtom)
  const [openClone, setOpenClone] = useState(false);
  const {is} = useFlags();

  console.info("clone environmentInfo", environmentInfo, environment_id)

  if (!is("clone env")?.enabled()) {
    return <></>
  }

  return (
    <Popover open={openClone} onOpenChange={setOpenClone}>
      <PopoverTrigger asChild>
        <Tooltip>
          <TooltipTrigger>
            <Button variant={"outline"} className={"bg-muted/10 border-0"} size={"icon"}>
              <Copy className={"h-5 w-5"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={4}>Clone Environment</TooltipContent>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>
      </PopoverContent>
    </Popover>
  )
}