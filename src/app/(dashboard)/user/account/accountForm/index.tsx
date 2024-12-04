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

const formSchema = z.object({
  knownAs: z.string().min(2, {message: "Known As requires a minimum of 2 characters"}),
  firstName: z.string().min(2, {message: "First Name is required a minimum of 2 characters"}),
  lastName: z.string().min(2, {message: "Last Name is required a minimum of 2 characters"}),
  location: z.string().min(2, {message: "Location is required a minimum of 2 characters"}),
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountForm({ session }: { session: Session }) {
  const { data: userData, isLoading } = useUserDetails(session?.user?.id ?? "");
  const [fromKeycloak, setFromKeycloak] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knownAs: "",
      firstName: "",
      lastName: "",
      location: "",
    },
  });

  // Set form values when user data loads
  useEffect(() => {
    if (userData) {
      form.reset({
        knownAs: userData.known_as,
        firstName: userData.first_name,
        lastName: userData.last_name,
        location: userData.location,
      });
      return
    }

    if (session?.user?.name) {
      const [firstName, lastName] = session.user.name.split(" ");
      form.reset({
        knownAs: session.user.name,
        firstName,
        lastName,
        location: "Unknown",
      });
      setFromKeycloak(true);
    }
  }, [userData, form, session]);

  const onSubmit = async (data: FormValues) => {
    try {
      // @ts-expect-error email doesn't exist on session.user
      data.email = session.user.email

      const res = await fetch("/api/user/details", {
        method: fromKeycloak ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      });
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to update account details",
          variant: "destructive",
        });
        return
      }

      toast({
        title: "Account Updated",
        description: "The account has been updated successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `Failed to update account details: ${error.message}`,
          variant: "destructive",
        });
        return
      }

      toast({
        title: "Error",
        description: "Failed to update account details",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className={"col-span-2"}>
        <Skeleton className="h-[20rem] w-[50rem] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="col-span-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="knownAs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wish to be known as</FormLabel>
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
              <FormItem>
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
              <FormItem>
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
}