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
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { getUserDetails } from "~/hooks/use-user-details";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function StepTwo() {
  const router = useRouter()
  const [, setOnboardingComplete] = useAtom(hasCompletedOnboardingAtom)
  const {user} = useUser()
  if (!user) {
    router.push("/")
  }

  // they have somehow got to the second step without completing the first step
  useEffect(() => {
    getUserDetails().then(userData => {
      if (userData?.onboarded) {
        setOnboardingComplete(true)
        router.push("/")
      }

      if (!userData?.created) {
        router.push("/onboarding")
      }
    }).catch(err => {
      console.error("User not setup yet", err)
      router.push("/onboarding")
    })
  }, [])

  const companyCodeSchema = z.object({
    companyCode: z.string().min(2, {message: "Company Invite Code is required a minimum of 2 characters"}),
  })
  const companyCodeForm = useForm<z.infer<typeof companyCodeSchema>>({
    resolver: zodResolver(companyCodeSchema),
    defaultValues: {
      companyCode: "",
    },
  })
  const companyCodeOnSubmit = async (data: z.infer<typeof companyCodeSchema>) => {
    try {
      const domain = user?.emailAddresses?.[0]?.emailAddress?.split("@")[1]

      const companyCodeValues = {
        invite_code: data.companyCode,
        domain: domain,
      }
      const res = await fetch("/api/company/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyCodeValues),
        cache: "no-store",
      })
      if (!res.ok) {
        new Error("Failed to create company")
      }

      toast("Company Created", {
        description: "Last step of onboarding has been completed",
      })
      setOnboardingComplete(true)
      router.push("/")
    } catch (e) {
      if (e instanceof Error) {
        toast("Error", {
          description: `Failed to completed last step of onboarding: ${e.message}`,
        })
        return
      }

      toast("Error", {
        description: "Failed to completed last step of onboarding for unknown reason",
      })
    }
  }

  const blockedDomains = ["gmail.com", "google.com", "yahoo.com", "hotmail.com", "outlook.com"]
  let domain = user?.emailAddresses?.[0]?.emailAddress?.split("@")[1]
  if (domain != undefined && blockedDomains.includes(domain)) {
    domain = ""
  }

  const companyFormSchema = z.object({
    companyName: z.string().min(2, {message: "Company Name is required a minimum of 2 characters"}),
    companyDomain: z.string().min(2, {message: "Company Domain is required a minimum of 2 characters"}),
  })
  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      companyDomain: domain,
    },
  })
  const companyOnSubmit = async (data: z.infer<typeof companyFormSchema>) => {
    try {
      const companyValues = {
        companyName: data.companyName,
        companyDomain: data.companyDomain,
      }

      const res = await fetch("/api/company/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyValues),
        cache: "no-store",
      })
      if (!res.ok) {
        new Error("Failed to create company")
      }

      toast("Company Created", {
        description: "Last step of onboarding has been completed",
      })
      setOnboardingComplete(true)
      router.push("/")
    } catch (e) {
      if (e instanceof Error) {
        toast("Error", {
          description: `Failed to completed last step of onboarding: ${e.message}`,
        })
        return
      }

      toast("Error", {
        description: "Failed to completed last step of onboarding for unknown reason",
      })
    }
  }

  return (
    <>
      <Card className={"gap-3 col-span-2 min-w-[40rem] p-3"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>
          Step Two
        </CardTitle>
        <CardContent className={"p-6 text-sm"}>
          <p>Welcome to Flags.gg, the last step is to create a Flags.gg company.</p>
          <p>This will allow you to create projects, agents, and environments.</p>
          <br />
          <p>Do you have a Flags.gg company invite code? If so, enter it below.</p>
          <br />
          <Separator />
          <br />

          <Accordion type={"single"} collapsible={true} className={"w-full"}>
            <AccordionItem value={"companyCode"}>
              <AccordionTrigger>Company Invite Code</AccordionTrigger>
              <AccordionContent>
                <Form {...companyCodeForm}>
                  <form onSubmit={companyCodeForm.handleSubmit(companyCodeOnSubmit)} className={"w-2/3 space-y-6"}>
                    <FormField
                      control={companyCodeForm.control}
                      name="companyCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Company Invite Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Continue</Button>
                  </form>
                </Form>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value={"companyDetails"}>
              <AccordionTrigger>Company Details</AccordionTrigger>
              <AccordionContent>
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(companyOnSubmit)} className={"w-2/3 space-y-6"}>
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What do you wish your company to be known as</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="companyDomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Domain</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Domain" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Continue</Button>
                  </form>
                </Form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
          <Progress className={"h-4 w-full"} value={75} />
        </CardContent>
      </Card>
    </>
  )
}