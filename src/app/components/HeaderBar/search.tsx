"use client"

import {Search} from "lucide-react";
import {Input} from "~/components/ui/input";
import { useFlags } from "@flags-gg/react-library";

export function SearchBox() {
  const {is} = useFlags();

  return (
    <div className={"relative ml-auto flex-1 md:grow-0"}>
      <Search className={"absolute left-2.5 top-3 h-4 w-5 text-muted-foreground"} />
      <Input type="search" placeholder="Search" className={"w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"} disabled={!is("search")?.enabled()}/>
    </div>
  )
}
