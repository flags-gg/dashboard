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
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { useCompanyDetails } from "~/hooks/use-company-details";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

async function sendInvite(name: string, email_address: string): Promise<null | Error> {
  try {
    const res = await fetch(`/api/company/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email_address,
      }),
    })
    if (!res.ok) {
      return new Error('Failed to send invite')
    }
    return null
  } catch (e) {
    console.error('Failed to send invite', e)
    return new Error('Internal Server Error')
  }
}

export default function Users() {
  const {is} = useFlags();
  const {data: users, isLoading: usersLoading} = useCompanyUsers();
  const {data: companyInfo, isLoading: infoLoading} = useCompanyDetails()
  const [inviteOpen, setInviteOpen] = useState(false)

  const FormSchema = z.object({
    name: z.string().min(2, { message: "Name of the person needs to be at least 2 characters long" }),
    email_address: z.string().email({ message: "Invalid email address" }),
  })
  const form  = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email_address: "",
    },
  })
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setInviteOpen(false)
    sendInvite(data.name, data.email_address).then(() => {
      toast("Invite Sent", {
        description: "Invite Sent",
      })
    }).catch((e) => {
      throw new Error(`Failed to send invite: ${e}`)
    })
    form.reset()
  }

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
              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger>
                  <PlusSquareIcon className={"cursor-pointer"} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Invite someone to your company
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
                      <FormField control={form.control} name={"name"} render={({field}) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder={"Name of the person"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={"email_address"} render={({field}) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder={"Email Address"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type={"submit"}>Send Invite</Button>
                    </form>
                  </Form>
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
