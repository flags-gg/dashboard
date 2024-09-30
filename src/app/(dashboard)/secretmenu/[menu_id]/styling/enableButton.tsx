import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import {useStyleContext} from "./context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

const FormSchema = z.object({
  background: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
  padding: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  borderRadius: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
});
type FormValues = z.infer<typeof FormSchema>;

export default function EnableButton() {
  const [open, setOpen] = useState(false);
  const {styles, updateStyle, resetStyle, resetTimestamps, modifiedStyles} = useStyleContext();
  const lastResetTimestamp = useRef(0);

  const getDefaultValues = (): FormValues => {
    const elementStyle = styles.buttonEnabled;
    return {
      background: (elementStyle.background as string) || '#FF79C6',
      padding: (elementStyle.padding as string) || '0.4rem',
      borderRadius: (elementStyle.borderRadius as string) || '0.5rem',
      color: (elementStyle.color as string) || '#44475A',
    };
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    const currentResetTimestamp = resetTimestamps.buttonEnabled || 0;
    if (currentResetTimestamp > lastResetTimestamp.current) {
      form.reset(getDefaultValues());
      lastResetTimestamp.current = currentResetTimestamp;
    }
  }, [resetTimestamps.buttonEnabled, form]);

  const onSubmit = (data: FormValues) => {
    updateStyle('buttonDisabled', data);
    setOpen(false);
  };

  const onReset = () => {
    resetStyle('buttonDisabled');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button style={styles.buttonEnabled} aria-label="Reset">
          Enabled
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enabled Button Style</DialogTitle>
          <DialogDescription>Change the style of the enabled button.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input type="color" {...field} className="w-12 h-12 p-1 mr-2" />
                      <Input {...field} placeholder="#RRGGBB" className="flex-grow" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="padding"
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>Padding</FormLabel>
                  <FormControl>
                    <Input placeholder={`e.g., 10px, 2rem, 1.5em`} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="borderRadius"
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>Border Radius</FormLabel>
                  <FormControl>
                    <Input placeholder={`e.g., 10px, 2rem, 1.5em`} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
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
              )} />
            <Button type="submit">Preview</Button>
            {modifiedStyles.has('buttonDisabled') && (
              <Button type="button" onClick={onReset} className={"absolute right-6"}>Reset</Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}