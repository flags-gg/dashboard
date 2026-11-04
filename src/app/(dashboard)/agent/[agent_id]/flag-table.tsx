"use client"

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import type { AgentFlag, AgentFlags } from "~/lib/interfaces";
import { cn } from "~/lib/utils";
import { StateCell } from "./state-cell";
import { PromoteButton, RemoveFlag } from "./flag-actions";

type Filter = "all" | "rollout" | "pending" | "live";

export function FlagTable({ data, agentId }: { data: AgentFlags, agentId: string }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const envs = data.environments;
  const chain = envs.length > 1;
  const prod = chain ? envs.find(e => e.production) : undefined;

  const matches = useMemo(() => {
    const inProd = (f: AgentFlag) => f.states.find(s => s.environment_id === prod?.environment_id);
    const tests: Record<Filter, (f: AgentFlag) => boolean> = {
      all: () => true,
      rollout: f => f.states.some(s => s.enabled && s.rollout < 100),
      pending: f => !inProd(f),
      live: f => !!inProd(f)?.enabled,
    };
    return (f: AgentFlag, which: Filter) => tests[which](f);
  }, [prod]);

  const q = query.trim().toLowerCase();
  const searched = data.flags.filter(f => !q || f.name.toLowerCase().includes(q) || f.ticket?.toLowerCase().includes(q));
  const shown = searched.filter(f => matches(f, filter));
  const count = (which: Filter) => searched.filter(f => matches(f, which)).length;

  const filters: [Filter, string][] = [["all", "All"], ["live", "Live"], ["rollout", "Rolling out"]];
  if (chain) {
    filters.push(["pending", "Not in production"]);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" aria-label="Search flags" placeholder="Search flags or tickets" value={query}
            onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
        <ToggleGroup type="single" variant="outline" size="sm" value={filter}
          onValueChange={v => v && setFilter(v as Filter)} aria-label="Filter flags" className="max-w-full overflow-x-auto">
          {filters.map(([value, label]) => (
            <ToggleGroupItem key={value} value={value} className="flex-none gap-1.5 px-3">
              {label}<span className="tabular-nums text-muted-foreground">{count(value)}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-80 min-w-56">Flag</TableHead>
              {envs.map((env, i) => (
                <TableHead key={env.environment_id} className={cn("w-36 whitespace-nowrap", env === prod && "bg-muted/30")}>
                  {chain && <span className="text-muted-foreground tabular-nums">{i + 1}. </span>}{env.name}
                  {env === prod && <Badge variant="secondary" className="ml-1.5 align-middle text-[10px]">prod</Badge>}
                </TableHead>
              ))}
              <TableHead className="w-full p-0" aria-hidden />
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={envs.length + 3} className="py-10 text-center text-muted-foreground">
                  {data.flags.length === 0
                    ? (envs.length ? "No flags yet. Create one to get started." : "Create an environment before adding flags.")
                    : "No flags match."}
                </TableCell>
              </TableRow>
            )}
            {shown.map(flag => {
              const byEnv = new Map(flag.states.map(s => [s.environment_id, s]));
              // promote lives in the first environment after the deepest one the flag has reached
              const deepest = envs.reduce((d, env, i) => (byEnv.has(env.environment_id) ? i : d), -1);
              const from = deepest >= 0 ? byEnv.get(envs[deepest]!.environment_id) : undefined;
              return (
                <TableRow key={flag.name} className="group">
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm">{flag.name}</span>
                      {flag.ticket && <Badge variant="outline" className="font-mono text-[11px]">{flag.ticket}</Badge>}
                    </div>
                  </TableCell>
                  {envs.map((env, i) => {
                    const state = byEnv.get(env.environment_id);
                    return (
                      <TableCell key={env.environment_id} className={cn("whitespace-nowrap", env === prod && "bg-muted/30")}>
                        {state ? <StateCell name={flag.name} env={env.name} state={state} />
                          : i === deepest + 1 && from ? <PromoteButton flagId={from.flag_id} to={env.name} />
                          : <span className="pl-3 text-muted-foreground/50" aria-label="Not promoted yet">·</span>}
                      </TableCell>
                    );
                  })}
                  <TableCell className="p-0" aria-hidden />
                  <TableCell className="text-right">
                    <RemoveFlag agentId={agentId} name={flag.name} ticket={flag.ticket} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
