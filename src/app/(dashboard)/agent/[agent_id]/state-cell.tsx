"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Switch } from "~/components/ui/switch";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import type { FlagState } from "~/lib/interfaces";
import { logError } from "~/lib/logger";

const PRESETS = [1, 5, 25, 50, 100];

async function send(url: string, method: string, body: unknown) {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
}

// The pill reads at a glance (On / 25% / Off); clicking opens the on/off switch and the rollout slider.
export function StateCell({ name, env, state }: { name: string, env: string, state: FlagState }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(state.enabled);
  const [rollout, setRollout] = useState(state.rollout);
  const [draft, setDraft] = useState(state.rollout);
  const [busy, setBusy] = useState(false);

  const run = async (what: string, fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
      router.refresh();
    } catch (e) {
      logError(what, e);
      toast(`${what} failed`, { description: `${name} in ${env}` });
    } finally {
      setBusy(false);
    }
  };

  const toggle = () => run("Update flag", async () => {
    // /api/flag flips the state it is given
    await send("/api/flag", "POST", { flag: { enabled, details: { id: state.flag_id, name, lastChanged: "", promoted: false } } });
    setEnabled(!enabled);
  });
  const saveRollout = (value: number) => run("Set rollout", async () => {
    await send("/api/flag/rollout", "PATCH", { flag_id: state.flag_id, rollout: value });
    setRollout(value);
    setDraft(value);
  });

  const partial = enabled && rollout < 100;
  const label = !enabled ? "Off" : partial ? `${rollout}%` : "On";

  return (
    <Popover onOpenChange={open => open && setDraft(rollout)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${name} in ${env}: ${label}. Edit`}
          className={cn(
            "inline-flex min-w-16 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            !enabled && "border-border text-muted-foreground hover:bg-muted",
            enabled && !partial && "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-300",
            partial && "border-amber-500/40 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-300",
            busy && "opacity-60",
          )}
        >
          <span aria-hidden className={cn("size-1.5 rounded-full", !enabled ? "border border-current" : "bg-current")} />
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-4" align="start">
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{env}</p>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor={`on-${state.flag_id}`}>Enabled</Label>
          <Switch id={`on-${state.flag_id}`} checked={enabled} disabled={busy} onCheckedChange={toggle} />
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Label htmlFor={`rollout-${state.flag_id}`}>Rollout</Label>
            <span className="text-sm tabular-nums">{draft}% of visitors</span>
          </div>
          <Slider id={`rollout-${state.flag_id}`} aria-label="Rollout percentage" min={0} max={100} step={1}
            value={[draft]} onValueChange={v => setDraft(v[0] ?? 0)} disabled={busy} />
          <div className="flex gap-1">
            {PRESETS.map(p => (
              <Button key={p} type="button" size="sm" variant={draft === p ? "secondary" : "ghost"} className="h-7 flex-1 px-0 text-xs"
                onClick={() => setDraft(p)} disabled={busy}>{p}%</Button>
            ))}
          </div>
          <Button type="button" size="sm" className="w-full" disabled={busy || draft === rollout} onClick={() => saveRollout(draft)}>
            Save rollout
          </Button>
          {!enabled && draft < 100 && (
            <p className="text-xs text-muted-foreground">The rollout applies once the flag is enabled.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
