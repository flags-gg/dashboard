import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { isValidPosition, positionOptions, useStyleContext } from "./context";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const FormSchema = z.object({
  position: z.enum(positionOptions),
  top: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
  fontWeight: z.number().min(100).max(900),
  marginRight: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  marginLeft: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function MenuHeader() {
  const {styles, updateStyle, resetStyle, resetTimestamps, modifiedStyles} = useStyleContext();
  const [open, setOpen] = useState(false);
  const lastResetTimestamp = useRef(0);

  const getDefaultValues = useCallback((): FormValues => {
    const elementStyle = styles.header;
    return {
      position: isValidPosition(elementStyle.position) ? elementStyle.position : 'relative',
      top: (elementStyle.top as string) ?? '-0.6rem',
      color: (elementStyle.color as string) ?? '#F8F8F2',
      fontWeight: (elementStyle.fontWeight as number) ?? 700,
      marginRight: (elementStyle.marginRight as string) ?? '1rem',
      marginLeft: (elementStyle.marginLeft as string) ?? '1.5rem',
    }
  }, [styles.header]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    const currentResetTimestamp = resetTimestamps.header ?? 0;
    if (currentResetTimestamp > lastResetTimestamp.current) {
      form.reset(getDefaultValues());
      lastResetTimestamp.current = currentResetTimestamp;
    }
  }, [resetTimestamps.header, form, getDefaultValues]);

  const onSubmit = (data: FormValues) => {
    updateStyle('header', data);
    setOpen(false);
  };

  const onReset = () => {
    resetStyle('header');
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <h3 style={styles.header} className={"cursor-pointer"}>Secret Menu</h3>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Secret Menu Header</DialogTitle>
          <DialogDescription>Change the style of the header.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField control={form.control} name={"position"} render={({field}) => (
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
                      <SelectItem key={`${field.name} - ${option}`} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name={"top"} render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>Top</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g., 10px, 2rem, 1.5em`} {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Separator />
            <h2 className={"text-md font-medium"}>Margin</h2>
            <FormField control={form.control} name={"marginRight"} render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>Right</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g., 10px, 2rem, 1.5em`} {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name={"marginLeft"} render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>Left</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g., 10px, 2rem, 1.5em`} {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Separator />
            <FormField control={form.control} name={"fontWeight"} render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>Font Weight</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g., 100, 200, 700`} {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="color" render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input type="color" {...field} className="size-12 p-1 mr-2" />
                    <Input {...field} placeholder="#RRGGBB" className="grow" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>)} />
            <Button type={"submit"}>Preview</Button>
            {modifiedStyles.has('header') && (
              <Button type="button" onClick={onReset} className={"absolute right-6"}>Reset</Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}