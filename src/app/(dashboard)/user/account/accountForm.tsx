"use client"

import { type Session } from "next-auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useUserDetails } from "~/hooks/use-user-details";
import { Skeleton } from "~/components/ui/skeleton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export default function AccountForm({session}: {session: Session}) {
  const {options, parseTimezone} = useTimezoneSelect({
    labelStyle: "original",
    ...allTimezones,
  });
  const {data: userData, isLoading, isError} = useUserDetails(session?.user?.id ?? "");
  const {toast} = useToast();

  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [, setTimezone] = useState<string>();

  useEffect(() => {
    setFirstName(userData?.first_name);
    setLastName(userData?.last_name);
    setLocation(userData?.location);
    setTimezone(parseTimezone(userData?.timezone ?? "UTC").value);
  }, [userData, parseTimezone]);

  if (isError) {
    toast({
      title: "Error loading user details",
      description: "Please try again later.",
    });
  }

  const formSchema = z.object({
    firstName: z.string().min(2, {message: "First Name is required a minimum of 2 characters"}),
    lastName: z.string().min(2, {message: "Last Name is required a minimum of 2 characters"}),
    location: z.string().min(2, {message: "Location is required a minimum of 2 characters"}),
    timezone: z.string().min(2, {message: "Timezone is required a minimum of 2 characters"}),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      location: "",
      timezone: "UTC",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setTimezone(parseTimezone(data.timezone).value);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setLocation(data.location);

    toast({
      title: "Account Updated",
      description: "The account has been updated",
    });
    form.reset();
  };

  if (isLoading) {
    return <Skeleton className="h-[20rem] w-[50rem] rounded-xl" />
  }

  return (
    <div className={"col-span-2"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
          <FormField control={form.control} name={"firstName"} render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder={"First Name"} {...field} defaultValue={firstName} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name={"lastName"} render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder={"Last Name"} {...field} defaultValue={lastName} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name={"location"} render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder={"Location"} {...field} defaultValue={location} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name={"timezone"} render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={(value) => {
                  setTimezone(parseTimezone(value).value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type={"submit"}>Save</Button>
        </form>
      </Form>
    </div>
    )
}