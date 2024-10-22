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
import { useToast } from "~/hooks/use-toast";
import { useUserDetails } from "~/hooks/use-user-account";

export function UserNav({session}: {session: Session}) {
  const user = session?.user;
  const userName = user?.name ?? "";
  const shortName = userName.split(" ").map((n) => n[0]).join("");
  const {is} = useFlags();
  const {toast} = useToast();

  const { data: userData, isError } = useUserDetails(user?.id ?? "");

  if (isError) {
    toast({
      title: "Error loading user details",
      description: "Please try again later.",
    });
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
        {is("user account")?.enabled() && <DropdownMenuItem>
          <Link href={"/user/account"}>Account</Link>
        </DropdownMenuItem>
        }
        {is("user settings")?.enabled() && <DropdownMenuItem>
          <Link href={"/user/settings"}>Settings</Link>
        </DropdownMenuItem>
        }
        {is("show company")?.enabled() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Company</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={"/company"}>Settings</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/api/auth/signout"}>Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
