"use client"

import type { ReactNode } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

// Settings pages are stacked sections of label | control rows.
export function SettingsSection({ title, description, action, danger, children }: {
  title: string, description?: ReactNode, action?: ReactNode, danger?: boolean, children: ReactNode,
}) {
  return (
    <section className={cn("rounded-lg border", danger && "border-destructive/40")}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h2 className={cn("text-sm font-semibold", danger && "text-destructive")}>{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      <div className="divide-y">{children}</div>
    </section>
  );
}

export function SettingRow({ label, description, children }: { label: string, description?: ReactNode, children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex min-w-0 items-center gap-2">{children}</div>
    </div>
  );
}

export function CopyValue({ value, what }: { value: string, what: string }) {
  return (
    <>
      <code className="truncate text-xs text-muted-foreground select-all">{value}</code>
      <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0" aria-label={`Copy ${what}`}
        onClick={() => void navigator.clipboard.writeText(value).then(() => toast(`${what} copied`))}>
        <Copy className="size-4" />
      </Button>
    </>
  );
}

export function SettingsSkeleton() {
  return <div className="h-40 animate-pulse rounded-lg border bg-muted/30" />;
}
