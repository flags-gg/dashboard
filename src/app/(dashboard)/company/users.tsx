"use client"

import {Card} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useFlags } from "@flags-gg/react-library";
import { Skeleton } from "~/components/ui/skeleton";
import { useCompanyUsers } from "~/hooks/use-company-users";

export default function Users() {
  const {is} = useFlags();
  const {data: users, isLoading} = useCompanyUsers();

  if (isLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  console.info("users", users)

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user?.subject}>
              <TableCell>{user?.known_as}</TableCell>
              <TableCell>{user?.first_name}</TableCell>
              <TableCell>{user?.last_name}</TableCell>
              {is("group permissions")?.enabled() && (<TableCell>{user?.group.name}</TableCell>)}
              <TableCell className={"text-right"}>
                {is("alter user")?.enabled() && (
                  <Button variant="outline" color="primary">
                    <PencilIcon />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
