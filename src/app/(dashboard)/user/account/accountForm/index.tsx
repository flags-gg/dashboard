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
import { useEffect } from "react";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

const formSchema = z.object({
  firstName: z.string().min(2, {message: "First Name is required a minimum of 2 characters"}),
  lastName: z.string().min(2, {message: "Last Name is required a minimum of 2 characters"}),
  location: z.string().min(2, {message: "Location is required a minimum of 2 characters"}),
  timezone: z.string().min(2, {message: "Timezone is required a minimum of 2 characters"}),
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountForm({ session }: { session: Session }) {
  const { options } = useTimezoneSelect({
    labelStyle: "original",
    ...allTimezones,
  });

  const { data: userData, isLoading, isError } = useUserDetails(session?.user?.id ?? "");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      location: "",
      timezone: "UTC",
    },
  });

  // Set form values when user data loads
  useEffect(() => {
    if (userData) {
      const matchingTimezone = options.find(
        (option) => option.value === userData.timezone ||
          option.value === `UTC/${userData.timezone}` ||
          option.value === userData.timezone.replace('_', '/')
      );

      form.reset({
        firstName: userData.first_name,
        lastName: userData.last_name,
        location: userData.location,
        timezone: matchingTimezone ? matchingTimezone.value : "UTC",
      });
    }
  }, [userData, form, options]);

  const onSubmit = async (data: FormValues) => {
    try {
      console.info("submitted data", data)

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

  if (isError) {
    toast({
      title: "Error loading user details",
      description: "Please try again later.",
    });

    return (
      <div className="text-red-500">
        Error loading user details. Please try again later.
      </div>
    );
  }

  return (
    <div className="col-span-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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