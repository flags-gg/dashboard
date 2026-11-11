"use client";
import { useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

const events = ["flag.created", "flag.state_changed", "flag.archived"];
type Endpoint = { id: string; name: string; url: string; enabled: boolean; event_types: string[]; created_at: string };
type Delivery = { id: string; event_id: string; endpoint_name: string; event_type: string; status: "pending" | "delivering" | "delivered" | "failed"; attempts: number; response_status: number | null; last_error: string | null; next_attempt_at: string; created_at: string; payload: unknown };
const API = "/api/company/webhooks";
async function send<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(API + path, { method, headers: { "Content-Type": "application/json" }, cache: "no-store", body: body === undefined ? undefined : JSON.stringify(body) });
  if (response.status === 204) return undefined as T;
  const data: unknown = await response.json();
  if (!response.ok) throw new Error(typeof data === "object" && data && "error" in data ? String(data.error) : "Webhook request failed");
  return data as T;
}
const when = (date: string) => new Date(date).toLocaleString("en-GB", { timeZone: "UTC" }) + " UTC";

export function CompanyWebhooks() {
  const { userId } = useAuth();
  const client = useQueryClient();
  const key = ["webhooks", userId];
  const endpoints = useQuery({ queryKey: [...key, "endpoints"], enabled: !!userId, queryFn: () => send<{ endpoints: Endpoint[] }>("") });
  const [name, setName] = useState("");
  const [url, setURL] = useState("");
  const [selected, setSelected] = useState(events);
  const [created, setCreated] = useState<{ secret: string; name: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");
  const [cursors, setCursors] = useState<string[]>([]);
  const before = cursors[cursors.length - 1] ?? "";
  const deliveries = useQuery({ queryKey: [...key, "deliveries", filter, before], enabled: !!userId, refetchInterval: 10_000,
    queryFn: () => send<{ deliveries: Delivery[] }>(`/deliveries?${new URLSearchParams({ endpoint: filter, before })}`) });
  async function act(fn: () => Promise<void>) {
    setBusy(true);
    try { await fn(); await client.invalidateQueries({ queryKey: key }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Webhook request failed"); }
    finally { setBusy(false); }
  }
  function create(e: FormEvent) {
    e.preventDefault();
    void act(async () => {
      const data = await send<{ secret: string }>("", "POST", { name, url, event_types: selected });
      setCreated({ secret: data.secret, name }); setName(""); setURL(""); toast.success("Webhook created");
    });
  }
  return <div className="space-y-6">
    <Card><CardHeader><CardTitle>Outbound webhooks</CardTitle><CardDescription>Notify TrackLines and other services when this company’s flags change. Deliveries are signed and retried automatically.</CardDescription></CardHeader><CardContent className="space-y-5">
      <form onSubmit={create} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="webhook-name">Name</Label><Input id="webhook-name" required maxLength={100} placeholder="TrackLines" value={name} onChange={e => setName(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="webhook-url">Endpoint URL</Label><Input id="webhook-url" required type="url" maxLength={2048} placeholder="https://example.com/webhooks/flags" value={url} onChange={e => setURL(e.target.value)} /><p className="text-xs text-muted-foreground">Public HTTPS endpoint on port 443.</p></div></div>
        <fieldset><legend className="mb-2 text-sm font-medium">Events</legend><div className="flex flex-wrap gap-4">{events.map(event => <label key={event} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(event)} onChange={e => setSelected(current => e.target.checked ? [...current, event] : current.filter(x => x !== event))} />{event}</label>)}</div></fieldset>
        <Button type="submit" disabled={busy || !name.trim() || !url.trim() || selected.length === 0 || created !== null}>Create endpoint</Button>
      </form>
      {created && <div role="status" className="space-y-3 rounded-lg border p-4"><p className="text-sm font-medium">Save the signing secret for {created.name}. It is shown only once.</p><div className="flex gap-2"><Input readOnly aria-label="Signing secret" className="font-mono" value={created.secret} onFocus={e => e.target.select()} /><Button variant="outline" onClick={() => void navigator.clipboard.writeText(created.secret).then(() => toast.success("Copied"), () => toast.error("Copy failed. Select and copy the secret."))}>Copy</Button></div><Button size="sm" variant="ghost" onClick={() => setCreated(null)}>I’ve saved it</Button></div>}
      <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">Verify <code>X-Flags-Signature</code> using HMAC-SHA256 over <code>timestamp + &quot;.&quot; + raw request body</code> with the signing secret. Reject timestamps older than 5 minutes and deduplicate by <code>X-Flags-Event-ID</code>. Return a 2xx response to acknowledge delivery.</div>
      {endpoints.isPending ? <p role="status" className="text-sm text-muted-foreground">Loading endpoints…</p> : endpoints.isError ? <LoadError retry={() => void endpoints.refetch()} /> : !endpoints.data?.endpoints.length ? <p className="text-sm text-muted-foreground">No endpoints yet.</p> : <div className="space-y-3">{endpoints.data.endpoints.map(endpoint => <EndpointRow key={endpoint.id} endpoint={endpoint} busy={busy} onSave={(body) => void act(async () => { await send(`/${endpoint.id}`, "PATCH", body); })} onDelete={() => { if (confirm(`Delete “${endpoint.name}” and its delivery history? Pending deliveries will be canceled.`)) void act(async () => { await send(`/${endpoint.id}`, "DELETE"); if (filter === endpoint.id) { setFilter(""); setCursors([]); } }); }} />)}</div>}
    </CardContent></Card>
    <Card><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>Delivery log</CardTitle><CardDescription className="mt-2">Retained for 30 days. Up to 8 attempts with backoff; receivers may see the same event more than once.</CardDescription></div><Button size="sm" variant="outline" disabled={deliveries.isFetching} onClick={() => void deliveries.refetch()}>Refresh</Button></div></CardHeader><CardContent className="space-y-4">
      <div className="flex items-center gap-3"><Label htmlFor="webhook-filter">Endpoint</Label><select id="webhook-filter" className="max-w-full rounded-md border bg-background p-2 text-sm" value={filter} onChange={e => { setFilter(e.target.value); setCursors([]); }}><option value="">All endpoints</option>{endpoints.data?.endpoints.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
      {deliveries.isPending ? <p role="status" className="text-sm text-muted-foreground">Loading deliveries…</p> : deliveries.isError ? <LoadError retry={() => void deliveries.refetch()} /> : <><div className="overflow-x-auto rounded-lg border"><Table><TableHeader><TableRow>{["Event", "Endpoint", "Status", "Attempts", "Response", "Created", "Details"].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>
        {!deliveries.data?.deliveries.length && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No deliveries yet. Change a subscribed flag to send an event.</TableCell></TableRow>}
        {deliveries.data?.deliveries.map(d => <TableRow key={d.id}><TableCell><p className="font-medium">{d.event_type}</p><p className="text-xs text-muted-foreground">{d.event_id}</p></TableCell><TableCell>{d.endpoint_name}</TableCell><TableCell><Badge variant={d.status === "failed" ? "destructive" : "secondary"}>{d.status}</Badge>{d.status === "pending" && d.attempts > 0 && <p className="mt-1 text-xs text-muted-foreground">Next: {when(d.next_attempt_at)}</p>}</TableCell><TableCell>{d.attempts}/8</TableCell><TableCell>{d.response_status ? `HTTP ${d.response_status}` : "—"}{d.last_error && <p className="mt-1 text-xs text-destructive">{d.last_error}</p>}</TableCell><TableCell className="whitespace-nowrap">{when(d.created_at)}</TableCell><TableCell><details><summary className="cursor-pointer text-sm">Payload</summary><pre className="mt-2 max-h-64 max-w-md overflow-auto rounded bg-muted p-3 text-xs">{JSON.stringify(d.payload, null, 2)}</pre></details>{d.status === "failed" && <Button size="sm" variant="outline" className="mt-2" disabled={busy} onClick={() => void act(async () => { await send(`/deliveries/${d.id}/retry`, "POST"); toast.success("Delivery queued"); })}>Retry</Button>}</TableCell></TableRow>)}
      </TableBody></Table></div><div className="flex justify-end gap-3"><Button size="sm" variant="outline" disabled={!cursors.length} onClick={() => setCursors(current => current.slice(0, -1))}>Newer</Button><Button size="sm" variant="outline" disabled={(deliveries.data?.deliveries.length ?? 0) < 50} onClick={() => { const last = deliveries.data?.deliveries.at(-1); if (last) setCursors(current => [...current, last.id]); }}>Older</Button></div></>}
    </CardContent></Card>
  </div>;
}
function LoadError({ retry }: { retry: () => void }) { return <div role="alert" className="flex items-center gap-3 text-sm"><span className="text-destructive">Couldn’t load webhooks.</span><Button size="sm" variant="outline" onClick={retry}>Try again</Button></div>; }
function EndpointRow({ endpoint, busy, onSave, onDelete }: { endpoint: Endpoint; busy: boolean; onSave: (body: { enabled?: boolean; event_types?: string[] }) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(endpoint.event_types);
  return <div className="space-y-3 rounded-lg border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2"><p className="font-medium">{endpoint.name}</p><Badge variant={endpoint.enabled ? "secondary" : "outline"}>{endpoint.enabled ? "Enabled" : "Paused"}</Badge></div><p className="mt-1 break-all text-sm text-muted-foreground">{endpoint.url}</p><p className="mt-1 text-xs text-muted-foreground">{endpoint.event_types.join(" · ")}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={() => onSave({ enabled: !endpoint.enabled })}>{endpoint.enabled ? "Pause" : "Resume"}</Button><Button size="sm" variant="outline" disabled={busy} onClick={() => { setSelected(endpoint.event_types); setEditing(!editing); }}>Events</Button><Button size="sm" variant="destructive" disabled={busy} onClick={onDelete}>Delete</Button></div></div>{editing && <div className="space-y-3"><fieldset><legend className="sr-only">Subscribed events for {endpoint.name}</legend><div className="flex flex-wrap gap-4">{events.map(event => <label key={event} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(event)} onChange={e => setSelected(current => e.target.checked ? [...current, event] : current.filter(x => x !== event))} />{event}</label>)}</div></fieldset><Button size="sm" disabled={busy || !selected.length} onClick={() => onSave({ event_types: selected })}>Save events</Button></div>}</div>;
}
