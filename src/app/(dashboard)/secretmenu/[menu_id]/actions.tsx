"use client"

import { useEffect } from "react";
import Link from "next/link";
import { useAtom } from "jotai";
import { useFlags } from "@flags-gg/react-library";
import { buttonVariants } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { secretMenuAtom } from "~/lib/statemanager";
import type { SecretMenu } from "~/lib/interfaces";
import { MenuSwitch } from "./switch";

// Enabled switch and styling link; also records the menu for the breadcrumbs and styling page.
export default function MenuActions({ menu }: { menu: SecretMenu }) {
  const { is } = useFlags();
  const [, setSelected] = useAtom(secretMenuAtom);
  useEffect(() => setSelected(menu), [menu, setSelected]);

  return (
    <>
      <Label className="flex items-center gap-2 text-sm font-normal">
        Enabled <MenuSwitch menu_id={menu.menu_id} enabled={menu.enabled} />
      </Label>
      {is("menu style")?.enabled() && (
        <Link className={buttonVariants({ variant: "outline" })} href={`/secretmenu/${menu.menu_id}/styling`}>Styling</Link>
      )}
    </>
  );
}
