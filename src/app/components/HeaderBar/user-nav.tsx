"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import {Button} from "~/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import Link from "next/link";
import { Session } from "next-auth";
import { useFlags } from "@flags-gg/react-library";

export function UserNav({session}: {session: Session}) {
  const user = session?.user;
  const userImage = user?.image ?? "";
  const userName = user?.name ?? "";
  const shortName = userName.split(" ").map((n) => n[0]).join("");
  const {is} = useFlags();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"} className={"overflow-hidden rounded-full"}>
          <Avatar className={"h-8 w-8"}>
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{shortName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"end"}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {is("user account")?.enabled() && <DropdownMenuItem>
          <Link href={"/user/account"}>Account</Link>
        </DropdownMenuItem>
        }
        {is("user settings")?.enabled() && <DropdownMenuItem>
          <Link href={"/user/settings"}>Settings</Link>
        </DropdownMenuItem>
        }
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/api/auth/signout"}>Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
