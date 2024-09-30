import {
  borderStyleOptions,
  displayOptions,
  isValidBorder,
  isValidDisplay, isValidJustifyContent,
  justifyContentOptions,
  useStyleContext
} from "./context";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const FormSchema = z.object({
  display: z.enum(displayOptions),
  justifyContent: z.enum(justifyContentOptions),
  backgroundColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
  borderColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
  borderStyle: z.enum(borderStyleOptions),
  borderRadius: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  borderWidth: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
  padding: z.string().regex(/^-?\d+(\.\d+)?(px|rem|em)$/, "Must be a number followed by px, rem, or em"),
});
type FormValues = z.infer<typeof FormSchema>;

export default function Flag({children}: {children: ReactNode}) {
  const { styles, updateStyle, resetStyle, resetTimestamps, modifiedStyles } = useStyleContext();
  const [open, setOpen] = useState(false);
  const lastResetTimestamp = useRef(0);

  const getDefaultValues = (): FormValues => {
    const elementStyle = styles.container;
    return {
      display: isValidDisplay(elementStyle.display) ? elementStyle.display : 'flex',
      justifyContent: isValidJustifyContent(elementStyle.justifyContent) ? elementStyle.justifyContent : 'center',
      backgroundColor: (elementStyle.backgroundColor as string) || '#282A36',
      color: (elementStyle.color as string) || '#F8F8F2',
      borderColor: (elementStyle.borderColor as string) || '#F8F8F2',
      borderStyle: isValidBorder(elementStyle.borderStyle) ? elementStyle.borderStyle : 'solid',
      borderWidth: (elementStyle.borderWidth as string) || '2px',
      borderRadius: (elementStyle.borderRadius as string) || '0.5rem',
      padding: (elementStyle.padding as string) || '1rem',
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    const currentResetTimestamp = resetTimestamps.flag || 0;
    if (currentResetTimestamp > lastResetTimestamp.current) {
      form.reset(getDefaultValues());
      lastResetTimestamp.current = currentResetTimestamp;
    }
  }, [resetTimestamps.flag, form]);

  const onSubmit = (data: FormValues) => {
    updateStyle('container', data);
    setOpen(false);
  };

  const onReset = () => {
    resetStyle('container');
  }

  return (
    <>
      <div style={styles.flag} onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpen(true);
        }}}>
        {children}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Secret Menu Flag</DialogTitle>
              <DialogDescription>Change the style of the flag.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField control={form.control} name={"display"} render={({field}) => (
                  <FormItem>
                    <FormLabel>Display</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {displayOptions.map((option) => (
                          <SelectItem key={`${field}-${option}`} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>)} />
                <FormField control={form.control} name={"justifyContent"} render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Justify Content</FormLabel>
                    <Select onValueChange={fieldProps.onChange} defaultValue={fieldProps.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a justify content" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {justifyContentOptions.map((option) => (
                          <SelectItem key={`${fieldProps}-${option}`} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>)} />
                <Separator />
                <h2 className={"text-md font-medium"}>Border</h2>
                <FormField control={form.control} name="borderColor" render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="color" {...fieldProps} className="w-12 h-12 p-1 mr-2" />
                        <Input {...fieldProps} placeholder="#RRGGBB" className="flex-grow" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem> )} />
                <FormField control={form.control} name="borderStyle" render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Style</FormLabel>
                    <Select onValueChange={fieldProps.onChange} defaultValue={fieldProps.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {borderStyleOptions.map((option) => (
                          <SelectItem key={`${fieldProps}-${option}`} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem> )} />
                <FormField control={form.control} name={"borderWidth"} render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input placeholder={`e.g., 10px, 2rem, 1.5em`} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem> )} />
                <FormField control={form.control} name={"borderRadius"} render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Radius</FormLabel>
                    <FormControl>
                      <Input placeholder={`e.g., 10px, 2rem, 1.5em`} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem> )} />
                <Separator />
                <FormField control={form.control} name={"backgroundColor"} render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Background Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="color" {...fieldProps} className="w-12 h-12 p-1 mr-2" />
                        <Input {...fieldProps} placeholder="#RRGGBB" className="flex-grow" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem> )} />
                <FormField control={form.control} name={"color"} render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Text Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="color" {...fieldProps} className="w-12 h-12 p-1 mr-2" />
                        <Input {...fieldProps} placeholder="#RRGGBB" className="flex-grow" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem> )} />
                <Button type={"submit"}>Preview</Button>
                {modifiedStyles.has('header') && (
                  <Button type="button" onClick={onReset} className={"absolute right-6"}>Reset</Button>
                )}
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}