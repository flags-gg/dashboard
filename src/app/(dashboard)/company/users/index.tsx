"use client"

import {Card} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PencilIcon, PlusSquareIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useFlags } from "@flags-gg/react-library";
import { Skeleton } from "~/components/ui/skeleton";
import { useCompanyUsers } from "~/hooks/use-company-users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { useCompanyDetails } from "~/hooks/use-company-details";

async function sendInvite(name: string, email_address: string): Promise<null | Error> {
  
}

export default function Users() {
  const {is} = useFlags();
  const {data: users, isLoading: usersLoading} = useCompanyUsers();
  const {data: companyInfo, isLoading: infoLoading} = useCompanyDetails()

  if (usersLoading || infoLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  let addUserAllowed = false
  if (companyInfo?.payment_plan !== undefined && users !== undefined && companyInfo?.payment_plan?.team_members > users?.length) {
    addUserAllowed = true
  }

  let colspan = 1
  if (is("company invite")?.enabled() && addUserAllowed) {
    colspan++
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Known As</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            {is("group permissions")?.enabled() && (<TableHead>Group</TableHead>)}
            {is("alter user")?.enabled() && (<TableHead className={"text-right"}>Actions</TableHead>)}
            {is("company invite")?.enabled() && addUserAllowed && (<TableHead className={"text-right align-middle pt-3 absolute inset-y-0 right-0"}>
              <Dialog>
                <DialogTrigger>
                  <PlusSquareIcon className={"cursor-pointer"} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Invite Header
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Invite Form Here
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user?.subject}>
              <TableCell>{user?.known_as}</TableCell>
              <TableCell>{user?.first_name}</TableCell>
              <TableCell colSpan={colspan}>{user?.last_name}</TableCell>
              {is("group permissions")?.enabled() && (<TableCell>{user?.group.name}</TableCell>)}
              {is("alter user")?.enabled() && (
              <TableCell className={"text-right"}>
                <Button variant="outline" color="primary">
                  <PencilIcon />
                </Button>
              </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
