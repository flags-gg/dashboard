"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getUserDetails } from "~/hooks/use-user-details";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function StepOne() {
  const {user} = useUser();

  const firstName = user?.firstName ?? ""
  const lastName = user?.lastName ?? ""
  const email = user?.emailAddresses?.[0]?.emailAddress ?? ""
  const {toast} = useToast()
  const router = useRouter()

  if (!user?.id) {
    router.push("/api/auth/signin")
  }
  // they have done the first step, but haven't completed the second step
  useEffect(() => {
    getUserDetails().then(userData => {
      if (userData?.created) {
        router.push("/onboarding/steptwo")
      }
    }).catch(err => {
      console.error("User not setup yet", err)
    })
  }, [])

  const formSchema = z.object({
    knownAs: z.string().min(2, {message: "Known as is required a minimum of 2 characters"}),
    firstName: z.string().min(2, {message: "First name is required a minimum of 2 characters"}).default(firstName),
    lastName: z.string().min(2, {message: "Last name is required a minimum of 2 characters"}).default(lastName),
    email: z.string().email({message: "Email is not valid"}).default(email),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knownAs: "",
      firstName: firstName,
      lastName: lastName,
      email: email ? email : "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const userValues = {
        knownAs: data.knownAs,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      }

      const res = await fetch("/api/user/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userValues),
        cache: "no-store",
      })
      if (!res.ok) {
        new Error("Failed to create account")
      }

      toast({
        title: "Account Created",
        description: "First step of onboarding has been completed",
      })
      router.push("/onboarding/steptwo")
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "Error",
          description: `Failed to complete first step of onboarding: ${e.message}`,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Error",
        description: "Failed to complete first step of onboarding for unknown reason",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card className={"gap-3 col-span-2 min-w-[40rem] p-3"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>
          Step One
        </CardTitle>
        <CardContent className={"p-6 text-sm"}>
          <p>Welcome to Flags.gg, the first step is to create a Flags.gg account.</p>
          <p>This will allow you to create projects, agents, and environments.</p>
          <br />
          <Separator />
          <br />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
              <FormField
                control={form.control}
                name="knownAs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you wish to be known as</FormLabel>
                    <FormControl>
                      <Input placeholder="Known As" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className={"hidden"}>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className={"hidden"}>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className={"hidden"}>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Continue</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={"flex flex-row items-start bg-muted/50"}>
          <div className={"grid gap-0.5"}>
            <CardTitle className={"group flex items-center gap-2 text-lg"}>
              Onboarding Progress
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className={"p-6 text-sm"}>
          <Progress className={"h-4 w-full"} value={25} />
        </CardContent>
      </Card>
    </>
  )
}