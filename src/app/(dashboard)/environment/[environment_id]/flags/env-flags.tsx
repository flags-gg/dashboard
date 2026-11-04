"use client"

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { tableFrame } from "~/components/page-intro";
import type { FlagState } from "~/lib/interfaces";
import { StateCell } from "~/app/(dashboard)/agent/[agent_id]/state-cell";
import { PromoteButton } from "~/app/(dashboard)/agent/[agent_id]/flag-actions";
import { EditFlag } from "./edit";
import { DeleteFlag } from "./delete";

export type EnvFlag = { name: string, ticket?: string, state: FlagState, inNext: boolean };

// One environment's flags, styled like the agent's flag table.
export function EnvFlagTable({ env, next, agentId, flags }: {
  env: string, next?: string, agentId: string, flags: EnvFlag[],
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = flags.filter(f => !q || f.name.toLowerCase().includes(q) || f.ticket?.toLowerCase().includes(q));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" aria-label="Search flags" placeholder="Search flags or tickets" value={query}
            onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
        <Link href={`/agent/${agentId}`} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          See every environment →
        </Link>
      </div>
      <div className={tableFrame}>
        <Table className="table-fixed" style={{ minWidth: "36rem" }}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-2/5">Flag</TableHead>
              <TableHead className="text-center">{env}</TableHead>
              {next && <TableHead className="text-center">{next}</TableHead>}
              <TableHead className="w-24"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={next ? 4 : 3} className="py-10 text-center text-muted-foreground">
                  {flags.length ? "No flags match." : "No flags in this environment yet."}
                </TableCell>
              </TableRow>
            )}
            {shown.map(f => (
              <TableRow key={f.name} className="group">
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-0 truncate font-mono text-sm" title={f.name}>{f.name}</span>
                    {f.ticket && <Badge variant="outline" className="font-mono text-[11px]">{f.ticket}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-center"><StateCell name={f.name} env={env} state={f.state} /></TableCell>
                {next && (
                  <TableCell className="text-center">
                    {f.inNext ? <span className="text-xs text-muted-foreground">Promoted</span> : <PromoteButton flagId={f.state.flag_id} to={next} />}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <EditFlag flag={{ enabled: f.state.enabled, details: { id: f.state.flag_id, name: f.name, lastChanged: "", promoted: f.inNext } }} />
                    <DeleteFlag flag={{ enabled: f.state.enabled, details: { id: f.state.flag_id, name: f.name, lastChanged: "", promoted: f.inNext } }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
