"use client"

import {Card} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useFlags } from "@flags-gg/react-library";

export default function Users() {
  const {is} = useFlags();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Group</TableHead>
            <TableHead className={"text-right"}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
            <TableCell>Tester</TableCell>
            <TableCell>User</TableCell>
            <TableCell className={"text-right"}>
              {is("alter user")?.enabled() && (
                <Button variant="outline" color="primary">
                  <PencilIcon />
                </Button>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  )
}
