"use client"

import { useFlags } from "@flags-gg/react-library";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput, CommandItem,
  CommandList,
  CommandSeparator
} from "~/components/ui/command";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";

export function SearchBox() {
  const {is} = useFlags();
  const [isOpen, setIsOpen] = useState(false);

  if (!is("search")?.enabled()) {
    return <div className={"relative ml-auto flex-1 md:grow-0"}>
    </div>
  }

  return (
    <div className={"relative ml-auto flex-1 md:grow-0"}>
      <div onClick={() => setIsOpen(true)}>
        <Search className={"absolute left-2.5 top-3 h-4 w-5 text-muted-foreground"} />
        <Input type="search" placeholder="Search" className={"w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"} />
      </div>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search" className={"w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"} />
        <CommandList>
          <CommandEmpty>No Results</CommandEmpty>
          <CommandGroup heading="Projects">
            <CommandItem>Project 1</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Agents">
            <CommandItem>Agent 1</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Environments">
            <CommandItem>Environment 1</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Secret Menus">
            <CommandItem>Secret Menu 1</CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </div>
  )
}
