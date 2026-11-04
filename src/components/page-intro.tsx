import type { ReactNode } from "react";

// One line saying what the page is for, with its main action on the right.
// The title is for screen readers; the breadcrumbs and tabs already show it.
export function PageIntro({ title, description, action }: { title: string, description: ReactNode, action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="sr-only">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

// Shared frame for list tables, so every list page looks the same.
export const tableFrame = "overflow-x-auto rounded-lg border";
