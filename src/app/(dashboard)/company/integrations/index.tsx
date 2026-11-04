"use client"

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import type { IntegrationToken } from "~/lib/interfaces";
import { logError } from "~/lib/logger";

const API = "/api/company/integration-token";

async function send(method: string, body?: unknown) {
  const res = await fetch(API, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json() as Promise<unknown>;
}

// Tokens for Tracklines and the MCP server; the raw token is shown once, right after creation.
export default function Integrations() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["integration-tokens"],
    queryFn: async () => (await send("GET") as { tokens: IntegrationToken[] | null }).tokens ?? [],
  });
  const [name, setName] = useState("");
  const [created, setCreated] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const act = async (what: string, fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
      await queryClient.invalidateQueries({ queryKey: ["integration-tokens"] });
    } catch (e) {
      logError(what, e);
      toast(`${what} failed`);
    } finally {
      setBusy(false);
    }
  };

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    void act("Create token", async () => {
      const res = await send("POST", { name }) as { token: string };
      setCreated(res.token);
      setName("");
    });
  };

  return (
    <Card className={"col-span-3"}>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Tokens let Tracklines and AI agents (MCP at <code>/mcp</code>) create, promote and remove flags for this company.
        </CardDescription>
      </CardHeader>
      <CardContent className={"space-y-4"}>
        <form onSubmit={create} className={"flex gap-2"}>
          <Input aria-label={"Token name"} placeholder={"e.g. Tracklines"} value={name} maxLength={255}
            onChange={e => setName(e.target.value)} />
          <Button type={"submit"} disabled={busy || !name.trim()}>Create token</Button>
        </form>

        {created && (
          <div className={"rounded-md border p-3 space-y-2"} role={"status"}>
            <p className={"text-sm font-medium"}>Copy this token now; it won&apos;t be shown again.</p>
            <div className={"flex gap-2"}>
              <Input readOnly value={created} className={"font-mono"} aria-label={"New token"} onFocus={e => e.target.select()} />
              <Button type={"button"} variant={"outline"} size={"icon"} aria-label={"Copy token"}
                onClick={() => void navigator.clipboard.writeText(created).then(() => toast("Copied"))}>
                <Copy className={"size-4"} />
              </Button>
            </div>
            <Button type={"button"} variant={"ghost"} size={"sm"} onClick={() => setCreated(null)}>Done</Button>
          </div>
        )}

        {isLoading ? <p className={"text-sm text-muted-foreground"}>Loading…</p>
          : error ? <p className={"text-sm text-destructive"}>Error loading tokens</p>
          : data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className={"w-0"}><span className={"sr-only"}>Revoke</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant={"ghost"} size={"icon"} disabled={busy} aria-label={`Revoke ${t.name}`}
                        onClick={() => { if (confirm(`Revoke "${t.name}"? Anything using it stops working.`)) void act("Revoke token", async () => { await send("DELETE", { id: t.id }); }); }}>
                        <Trash2 className={"size-4"} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : <p className={"text-sm text-muted-foreground"}>No tokens yet.</p>}
      </CardContent>
    </Card>
  );
}
