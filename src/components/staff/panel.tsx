"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";

export type StaffTab = "stats" | "companies" | "users" | "operations";
type Count = { total: number; day: number; week: number };
type Stats = Record<"companies" | "users" | "projects" | "agents" | "environments" | "flags" | "integration_tokens", Count> & { enabled_flags: number; plans: Record<string, number> };
type Company = { company_id: string; name: string; domain: string; plan: string; projects: number; users: number; created_at: string };
type User = { subject: string; name: string; email: string; onboarded: boolean; companies: string[]; created_at: string };
type Operations = { database_bytes: number; database_time: string; connections: number; migration: number; migration_dirty: boolean; archived_flags: number; webhook_endpoints: number; webhook_pending: number; webhook_failed: number };
type Data = Stats | Operations | { total: number; items: (Company | User)[] };
const tabs: { id: StaffTab; label: string }[] = [{ id: "stats", label: "Stats" }, { id: "companies", label: "Companies" }, { id: "users", label: "Users" }, { id: "operations", label: "Operations" }];
const n = (value: number) => new Intl.NumberFormat("en-GB").format(value);
const date = (value: string) => new Date(value).toLocaleDateString("en-GB", { timeZone: "UTC" });

export function StaffPanel({ tab }: { tab: StaffTab }) {
  const { userId } = useAuth();
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const query = useQuery({ queryKey: ["staff", userId, tab, q, page], enabled: !!userId, retry: false, queryFn: async (): Promise<Data> => {
    const response = await fetch(`/api/staff/${tab}?${new URLSearchParams({ q, page: String(page) })}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load staff data");
    return response.json() as Promise<Data>;
  }});
  const directory = tab === "companies" || tab === "users";
  return <section className="mx-auto max-w-6xl px-2 py-6 sm:px-6 sm:py-10">
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-bold tracking-tight">Admin panel</h1><p className="mt-1 text-sm text-muted-foreground">For Flags.gg staff: the whole platform, across all companies.</p></div>
      <Button variant="outline" size="sm" disabled={query.isFetching} onClick={() => void query.refetch()}>{query.isFetching ? "Refreshing…" : "Refresh"}</Button>
    </header>
    <nav aria-label="Admin panel" className="mb-6 inline-flex max-w-full items-center overflow-x-auto rounded-lg bg-muted p-[3px] text-muted-foreground">
      {tabs.map(t => <Link key={t.id} href={`/staff/${t.id}`} aria-current={t.id === tab ? "page" : undefined} className={cn("rounded-md px-3 py-1 text-sm font-medium transition-colors hover:text-foreground", t.id === tab && "bg-background text-foreground shadow-sm")}>{t.label}</Link>)}
    </nav>
    {directory && <form className="mb-4 flex max-w-lg gap-2" onSubmit={e => { e.preventDefault(); setQ(search.trim()); setPage(1); }}><Input aria-label={`Search ${tab}`} placeholder={tab === "companies" ? "Search name, domain, or company ID" : "Search name, email, or user ID"} value={search} onChange={e => setSearch(e.target.value)} /><Button type="submit" variant="outline">Search</Button></form>}
    {query.isError ? <div role="alert" className="flex items-center gap-3 text-sm"><p className="text-destructive">Couldn’t load this page.</p><Button size="sm" variant="outline" onClick={() => void query.refetch()}>Try again</Button></div> : query.isPending ? <p role="status" className="text-sm text-muted-foreground">Loading…</p> : query.data && <>
      {tab === "stats" && <StatsView data={query.data as Stats} />}
      {tab === "operations" && <OperationsView data={query.data as Operations} />}
      {directory && <Directory tab={tab} data={query.data as { total: number; items: (Company | User)[] }} page={page} setPage={setPage} />}
    </>}
  </section>;
}
function Tile({ title, value, detail, count }: { title: string; value?: string; detail?: string; count?: Count }) {
  return <Card className="gap-3"><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle></CardHeader><CardContent className="grid gap-1"><p className="text-3xl font-semibold tabular-nums">{count ? n(count.total) : value}</p>{count && <p className="text-xs text-muted-foreground">+{n(count.day)} in 24 hours · +{n(count.week)} in 7 days</p>}{detail && <p className="text-xs text-muted-foreground">{detail}</p>}</CardContent></Card>;
}
function StatsView({ data }: { data: Stats }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Tile title="Companies" count={data.companies} detail={Object.entries(data.plans).sort().map(([plan, total]) => `${plan} ${n(total)}`).join(" · ")} />
    <Tile title="Users" count={data.users} /><Tile title="Projects" count={data.projects} /><Tile title="Agents" count={data.agents} /><Tile title="Environments" count={data.environments} /><Tile title="Flags" count={data.flags} detail={`${n(data.enabled_flags)} enabled`} /><Tile title="Integration tokens" count={data.integration_tokens} />
  </div>;
}
function OperationsView({ data }: { data: Operations }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Tile title="Database" value={`${(data.database_bytes / 1_000_000).toFixed(1)} MB`} /><Tile title="Connections" value={n(data.connections)} detail="Current database connections" /><Tile title="Schema migration" value={String(data.migration)} detail={data.migration_dirty ? "Migration needs attention" : "Up to date · no dirty migration"} /><Tile title="Webhook endpoints" value={n(data.webhook_endpoints)} detail={`${n(data.webhook_pending)} pending · ${n(data.webhook_failed)} failed deliveries`} /><Tile title="Archived flags" value={n(data.archived_flags)} /><Tile title="Database clock" value={date(data.database_time)} detail={new Date(data.database_time).toLocaleTimeString("en-GB", { timeZone: "UTC" }) + " UTC"} /></div>;
}
function Directory({ tab, data, page, setPage }: { tab: "companies" | "users"; data: { total: number; items: (Company | User)[] }; page: number; setPage: (page: number) => void }) {
  const companies = tab === "companies";
  return <><p className="mb-3 text-sm text-muted-foreground">{n(data.total)} {tab}</p><div className="overflow-x-auto rounded-lg border"><Table><TableHeader><TableRow>{(companies ? ["Company", "Plan", "Projects", "Users", "Created"] : ["User", "Companies", "Onboarding", "Created"]).map(x => <TableHead key={x}>{x}</TableHead>)}</TableRow></TableHeader><TableBody>
    {data.items.length === 0 && <TableRow><TableCell colSpan={companies ? 5 : 4} className="py-10 text-center text-muted-foreground">No {tab} found.</TableCell></TableRow>}
    {data.items.map(item => "company_id" in item ? <TableRow key={item.company_id}><TableCell><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.domain || item.company_id}</p></TableCell><TableCell><Badge variant="secondary">{item.plan}</Badge></TableCell><TableCell>{n(item.projects)}</TableCell><TableCell>{n(item.users)}</TableCell><TableCell>{date(item.created_at)}</TableCell></TableRow> : <TableRow key={item.subject}><TableCell><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.email || item.subject}</p></TableCell><TableCell>{item.companies.join(", ") || "None"}</TableCell><TableCell><Badge variant={item.onboarded ? "secondary" : "outline"}>{item.onboarded ? "Complete" : "Pending"}</Badge></TableCell><TableCell>{date(item.created_at)}</TableCell></TableRow>)}
  </TableBody></Table></div><div className="mt-4 flex items-center justify-end gap-3"><Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button><span className="text-sm text-muted-foreground">Page {page} of {Math.max(1, Math.ceil(data.total / 25))}</span><Button size="sm" variant="outline" disabled={page * 25 >= data.total} onClick={() => setPage(page + 1)}>Next</Button></div></>;
}
