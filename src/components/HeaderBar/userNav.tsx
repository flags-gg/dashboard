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
import { type Session } from "next-auth";
import { useFlags } from "@flags-gg/react-library";
import { useUserDetails } from "~/hooks/use-user-details";
import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";

export function UserNav({session}: {session: Session}) {
  const [hasCompletedOnboarding] = useAtom(hasCompletedOnboardingAtom);

  const user = session?.user;
  const userName = user?.name ?? "";
  let shortName = userName.split(" ")?.map((n) => n[0]).join("");
  const {is} = useFlags();

  const { data: userData } = useUserDetails(user?.id ?? "");
  if (userData?.known_as) {
    shortName = userData?.known_as.split(" ")?.map((n) => n[0]).join("");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"} className={"overflow-hidden rounded-full"}>
          <Avatar className={"h-8 w-8"}>
            <AvatarImage src={userData?.avatar} alt={userName} />
            <AvatarFallback>{shortName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"end"}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        {is("user account")?.enabled() && <DropdownMenuItem asChild className={"cursor-pointer"}>
          <Link href={"/user/account"}>Account</Link>
        </DropdownMenuItem>
        }
        {is("show company")?.enabled() && (
          hasCompletedOnboarding && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Company</DropdownMenuLabel>
              <DropdownMenuItem asChild className={"cursor-pointer"}>
                <Link href={"/company"}>Settings</Link>
              </DropdownMenuItem>
            </>
          )
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className={"cursor-pointer"}>
          <Link href={"/api/auth/signout"}>Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
