"use client"

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import type { TargetingRule } from "~/lib/interfaces";

const OPERATORS: [TargetingRule["operator"], string][] = [
  ["in", "is one of"],
  ["not_in", "is not one of"],
  ["contains", "contains"],
  ["starts_with", "starts with"],
  ["ends_with", "ends with"],
];
const ATTRIBUTES = ["key", "email", "plan", "groups", "country"];

// Values are edited as text, so typing a comma doesn't fight the input.
type Draft = Omit<TargetingRule, "values"> & { values: string };
const toDraft = (r: TargetingRule): Draft => ({ ...r, values: r.values.join(", ") });
const fromDraft = (d: Draft): TargetingRule => ({
  ...d, attribute: d.attribute.trim(), values: d.values.split(",").map(v => v.trim()).filter(Boolean),
});

// Visual editor for one flag's rules in one environment. Each rule reads as a sentence:
// "Serve On when email ends with @acme.com".
export function RulesEditor({ open, onOpenChange, title, rules, onSave }: {
  open: boolean, onOpenChange: (open: boolean) => void, title: string,
  rules: TargetingRule[], onSave: (rules: TargetingRule[]) => Promise<string | null>,
}) {
  const [drafts, setDrafts] = useState<Draft[]>(rules.map(toDraft));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const update = (i: number, change: Partial<Draft>) => setDrafts(ds => ds.map((d, j) => (j === i ? { ...d, ...change } : d)));
  const move = (i: number, by: number) => setDrafts(ds => {
    const next = [...ds];
    const [d] = next.splice(i, 1);
    next.splice(i + by, 0, d!);
    return next;
  });

  const save = async () => {
    const out = drafts.map(fromDraft);
    const bad = out.findIndex(r => !r.attribute || r.values.length === 0);
    if (bad >= 0) {
      setError(`Rule ${bad + 1} needs an attribute and at least one value.`);
      return;
    }
    setBusy(true);
    setError(await onSave(out));
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (o) { setDrafts(rules.map(toDraft)); setError(null); } onOpenChange(o); }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Targeting rules · {title}</DialogTitle>
          <DialogDescription>
            Checked top to bottom against what your app tells the SDK about the user (its <code>context</code>).
            The first match decides; if none match, the rollout applies. Matching ignores case. Lists like <code>groups</code> match on any item.
          </DialogDescription>
        </DialogHeader>

        <datalist id="rule-attributes">{ATTRIBUTES.map(a => <option key={a} value={a} />)}</datalist>
        <ol className="space-y-2">
          {drafts.length === 0 && <li className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">No rules: everyone gets the flag&apos;s on/off and rollout.</li>}
          {drafts.map((d, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg border p-2 text-sm">
              <span className="w-5 text-right tabular-nums text-muted-foreground">{i + 1}.</span>
              <span>Serve</span>
              <Select value={d.serve ? "on" : "off"} onValueChange={v => update(i, { serve: v === "on" })}>
                <SelectTrigger className="h-8 w-20" aria-label={`Rule ${i + 1} serves`}><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="on">On</SelectItem><SelectItem value="off">Off</SelectItem></SelectContent>
              </Select>
              <span>when</span>
              <Input list="rule-attributes" className="h-8 w-28" aria-label={`Rule ${i + 1} attribute`} placeholder="attribute"
                value={d.attribute} onChange={e => update(i, { attribute: e.target.value })} />
              <Select value={d.operator} onValueChange={v => update(i, { operator: v as TargetingRule["operator"] })}>
                <SelectTrigger className="h-8 w-36" aria-label={`Rule ${i + 1} operator`}><SelectValue /></SelectTrigger>
                <SelectContent>{OPERATORS.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
              </Select>
              <Input className="h-8 min-w-40 flex-1" aria-label={`Rule ${i + 1} values`} placeholder="values, comma separated"
                value={d.values} onChange={e => update(i, { values: e.target.value })} />
              <div className="flex">
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move rule ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="size-4" /></Button>
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move rule ${i + 1} down`} disabled={i === drafts.length - 1} onClick={() => move(i, 1)}><ArrowDown className="size-4" /></Button>
                <Button type="button" variant="ghost" size="icon" className="size-8 hover:text-destructive" aria-label={`Remove rule ${i + 1}`} onClick={() => setDrafts(ds => ds.filter((_, j) => j !== i))}><Trash2 className="size-4" /></Button>
              </div>
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" size="sm" className="w-fit"
          onClick={() => setDrafts(ds => [...ds, { attribute: "email", operator: "ends_with", values: "", serve: true }])}>
          <Plus className="size-4" />Add rule
        </Button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" disabled={busy} onClick={save}>Save rules</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
