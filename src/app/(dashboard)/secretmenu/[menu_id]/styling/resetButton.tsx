"use client"

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { RefreshCcw } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

const positionOptions = ["relative", "fixed", "absolute", "static", "sticky"] as const;

const FormSchema = z.object({
  position: z.enum(positionOptions),
  top: z.string().regex(/^\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  left: z.string().regex(/^\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
});

type FormValues = z.infer<typeof FormSchema>;

const defaultStyles: FormValues = {
  position: "absolute",
  top: "0.3rem",
  left: "0.5rem",
  color: "#F8F8F2",
};

export default function ResetButton() {
  const [open, setOpen] = useState(false);
  const [styles, setStyles] = useState<FormValues>(defaultStyles);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: styles,
  });

  const buttonStyle = useMemo(() => ({
    position: styles.position,
    top: styles.top,
    left: styles.left,
    color: styles.color,
    cursor: "pointer",
    background: "transparent",
  }), [styles]);

  const onSubmit = (data: FormValues) => {
    setStyles(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button style={buttonStyle} aria-label="Reset">
          <RefreshCcw />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Button Style</DialogTitle>
          <DialogDescription>Change the style of the reset button.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {positionOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {["top", "left"].map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as "top" | "left"}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                    <FormControl>
                      <Input placeholder={`e.g., 10px, 2rem, 1.5em`} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input type="color" {...field} className="w-12 h-12 p-1 mr-2" />
                      <Input {...field} placeholder="#RRGGBB" className="flex-grow" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}