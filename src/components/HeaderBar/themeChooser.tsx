"use client"

import {useTheme} from "next-themes";
import { useFlags } from "@flags-gg/react-library";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { MonitorCogIcon, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";

export function ThemeChooser() {
  const {setTheme} = useTheme();
  const {is} = useFlags();

  if (!is("theme chooser")?.enabled()) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SunMoonIcon className={"cursor-pointer"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"end"}>
        <DropdownMenuItem className={"cursor-pointer"} onClick={() => setTheme("light")}>
          <SunIcon />&nbsp; Light
        </DropdownMenuItem>
        <DropdownMenuItem className={"cursor-pointer"} onClick={() => setTheme("dark")}>
          <MoonIcon />&nbsp; Dark
        </DropdownMenuItem>
        <DropdownMenuItem className={"cursor-pointer"} onClick={() => setTheme("system")}>
          <MonitorCogIcon />&nbsp; System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}