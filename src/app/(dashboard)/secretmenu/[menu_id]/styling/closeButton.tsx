import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { CircleX } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { isValidPosition, positionOptions, useStyleContext } from "./context";

const FormSchema = z.object({
  position: z.enum(positionOptions),
  top: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  right: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
});
type FormValues = z.infer<typeof FormSchema>;

export default function CloseButton() {
  const [open, setOpen] = useState(false);
  const {styles, updateStyle, resetStyle, resetTimestamps, modifiedStyles} = useStyleContext();
  const lastResetTimestamp = useRef(0);

  const getDefaultValues = useCallback((): FormValues => {
    const elementStyle = styles.closeButton;
    return {
      position: isValidPosition(elementStyle.position) ? elementStyle.position : 'absolute',
      top: (elementStyle.top as string) ?? '0.3rem',
      right: (elementStyle.right as string) ?? '0.5rem',
      color: (elementStyle.color as string) ?? '#F8F8F2',
    };
  }, [styles.closeButton]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    const currentResetTimestamp = resetTimestamps.closeButton ?? 0;
    if (currentResetTimestamp > lastResetTimestamp.current) {
      form.reset(getDefaultValues());
      lastResetTimestamp.current = currentResetTimestamp;
    }
  }, [resetTimestamps.closeButton, form, getDefaultValues]);

  const onSubmit = (data: FormValues) => {
    updateStyle('closeButton', data);
    setOpen(false);
  };

  const onReset = () => {
    resetStyle('closeButton');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button style={styles.closeButton} aria-label="Reset">
          <CircleX />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Close Button Style</DialogTitle>
          <DialogDescription>Change the style of the close button.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField control={form.control} name="position" render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positionOptions?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>)} />
            {["top", "right"]?.map((field) => (
              <FormField key={field} control={form.control} name={field as "top" | "right"} render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                  <FormControl>
                    <Input placeholder={`e.g., 10px, 2rem, 1.5em`} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>)} />
            ))}
            <FormField control={form.control} name="color" render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Color</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input type="color" {...field} className="size-12 p-1 mr-2" />
                    <Input {...field} placeholder="#RRGGBB" className="grow" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>)} />
            <Button type="submit">Preview</Button>
            {modifiedStyles.has('closeButton') && (
              <Button type="button" onClick={onReset} className={"absolute right-6"}>Reset</Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}