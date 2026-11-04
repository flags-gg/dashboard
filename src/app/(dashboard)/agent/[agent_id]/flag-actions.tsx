"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Archive } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { logError } from "~/lib/logger";

// run sends one request, toasts on failure and refreshes the server-rendered data on success
function useAction() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const run = async (what: string, url: string, method: string, body: unknown) => {
    setBusy(true);
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
      if (!res.ok) {
        throw new Error(`${what} failed (${res.status})`);
      }
      router.refresh();
    } catch (e) {
      logError(what, e);
      toast(`${what} failed`, { description: e instanceof Error ? e.message : undefined });
    } finally {
      setBusy(false);
    }
  };
  return { busy, run };
}

// Copies the flag from the environment it is in to the next one; it arrives off.
export function PromoteButton({ flagId, to }: { flagId: string, to: string }) {
  const { busy, run } = useAction();
  return (
    <Button size={"sm"} variant={"ghost"} disabled={busy} aria-label={`Promote to ${to}`}
      className={"h-7 gap-1 rounded-full border border-dashed px-2.5 text-xs text-muted-foreground hover:text-foreground"}
      onClick={() => run("Promote", "/api/flag/promote", "POST", { flag_id: flagId })}>
      {busy ? <Spinner /> : <ArrowRight className={"size-3.5"} />}
      Promote
    </Button>
  );
}

export function RemoveFlag({ agentId, name, ticket }: { agentId: string, name: string, ticket?: string }) {
  const { busy, run } = useAction();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"} disabled={busy} aria-label={`Remove ${name}`}
          className={"size-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive"}>
          {busy ? <Spinner /> : <Archive className={"size-4"} />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            It is removed from every environment and archived. Code must no longer check this flag.
            {ticket && ` It belongs to ${ticket}; removing it here is the same as removing it from the ticket.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => run("Remove flag", "/api/flag/archive", "DELETE", { agent_id: agentId, name })}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
