"use client"

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { SettingsSkeleton } from "~/components/settings";
import { tableFrame } from "~/components/page-intro";
import type { AgentMetrics } from "~/lib/interfaces";

// One hue per measure, same in both themes; validated (dataviz validator) against the card surface:
// light #2a78d6/#009689 on #fff, dark #5b82f0/#00a575 on #0f172b.
const config = {
  users: { label: "Users", theme: { light: "#2a78d6", dark: "#5b82f0" } },
  requests: { label: "Requests", theme: { light: "#009689", dark: "#00a575" } },
  pct: { label: "% served on", theme: { light: "#2a78d6", dark: "#5b82f0" } },
} satisfies ChartConfig;

// Recharts passes its own `content` along; drop it so it doesn't land on the tooltip's <div>.
const tooltip = (labelKey?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Content = ({ content, ...props }: TooltipContentProps<ValueType, NameType>) => <ChartTooltipContent {...props} labelKey={labelKey} />;
  Content.displayName = "MetricsTooltip";
  return Content;
};

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const fmt = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const ms = (v: number) => (v === 0 ? "—" : v > 1000 ? ">1s" : `≤${v}ms`);
const shortDay = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });

function Tile({ label, value, hint }: { label: string, value: string, hint?: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// Who got each flag, from the server's own decisions (rules, then rollout); counted once per user per day.
export function AgentMetricsView({ agentId }: { agentId: string }) {
  const [days, setDays] = useState("14");
  const [envId, setEnvId] = useState<string>();
  const { data, isLoading, error } = useQuery<AgentMetrics>({
    queryKey: ["agent-metrics", agentId, days],
    queryFn: async () => {
      const res = await fetch(`/api/agent/metrics?agent_id=${encodeURIComponent(agentId)}&days=${days}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`metrics ${res.status}`);
      return res.json() as Promise<AgentMetrics>;
    },
  });

  // default to production (the last environment)
  const env = data?.environments.find(e => e.environment_id === envId) ?? data?.environments.at(-1);
  const series = useMemo(() => (data && env)
    ? data.days.map((d, i) => ({ day: shortDay(d), users: env.users[i] ?? 0, requests: env.requests[i] ?? 0 }))
    : [], [data, env]);
  const flags = useMemo(() => (data?.flags ?? [])
    .filter(f => f.environment_id === env?.environment_id)
    .map(f => {
      const on = sum(f.served_on), off = sum(f.served_off);
      return {
        name: f.name, on, off, hits: sum(f.rule_hits), pct: on + off ? Math.round((100 * on) / (on + off)) : null,
        trend: data!.days.map((d, i) => {
          const t = (f.served_on[i] ?? 0) + (f.served_off[i] ?? 0);
          return { day: shortDay(d), pct: t ? Math.round((100 * (f.served_on[i] ?? 0)) / t) : null };
        }),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name)), [data, env]);

  if (isLoading) return <SettingsSkeleton />;
  if (error || !data) return <p className="rounded-lg border p-4 text-sm">Couldn&apos;t load metrics.</p>;
  if (!env) return <p className="rounded-lg border p-4 text-sm text-muted-foreground">Create an environment to see metrics.</p>;

  const today = env.users.at(-1) ?? 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Users are counted once a day by their targeting key, from SDKs that send one. &ldquo;Served&rdquo; is what the server decided for them, not whether the code checked the flag.
        </p>
        <div className="flex items-center gap-2">
          <Select value={env.environment_id} onValueChange={setEnvId}>
            <SelectTrigger className="h-8 w-40" aria-label="Environment"><SelectValue /></SelectTrigger>
            <SelectContent>{data.environments.map(e => <SelectItem key={e.environment_id} value={e.environment_id}>{e.name}</SelectItem>)}</SelectContent>
          </Select>
          <ToggleGroup type="single" variant="outline" size="sm" value={days} onValueChange={v => v && setDays(v)} aria-label="Time range">
            {["7", "14", "30"].map(d => <ToggleGroupItem key={d} value={d} className="flex-none px-3">{d}d</ToggleGroupItem>)}
          </ToggleGroup>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Users today" value={fmt.format(today)} hint={`${fmt.format(Math.round(sum(env.users) / env.users.length))} a day on average`} />
        <Tile label={`Requests, last ${days} days`} value={fmt.format(sum(env.requests))} />
        <Tile label="Response time p50" value={ms(env.p50_ms)} hint="flags endpoint, server side" />
        <Tile label="Response time p95" value={ms(env.p95_ms)} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {([["users", "Users per day"], ["requests", "Requests per day"]] as const).map(([key, title]) => (
          <section key={key} className="rounded-lg border p-4">
            <h3 className="mb-3 text-sm font-medium">{title}</h3>
            <ChartContainer config={config} className="aspect-auto h-48 w-full">
              {key === "users" ? (
                <LineChart data={series} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
                  <ChartTooltip content={tooltip()} />
                  <Line dataKey="users" type="monotone" stroke="var(--color-users)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              ) : (
                <BarChart data={series} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
                  <ChartTooltip content={tooltip()} />
                  <Bar dataKey="requests" fill="var(--color-requests)" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ChartContainer>
          </section>
        ))}
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Flags in {env.name}, last {days} days</h3>
        <div className={tableFrame}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Flag</TableHead>
                <TableHead className="text-right">Served on</TableHead>
                <TableHead className="text-right">Users on</TableHead>
                <TableHead className="text-right">Users off</TableHead>
                <TableHead className="text-right">Rule hits</TableHead>
                <TableHead className="w-40">Daily % on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No users seen yet. Usage appears once an SDK that sends a targeting key polls this environment.</TableCell>
                </TableRow>
              )}
              {flags.map(f => (
                <TableRow key={f.name}>
                  <TableCell className="font-mono text-sm">{f.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.pct === null ? "—" : `${f.pct}%`}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.on.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.off.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.hits.toLocaleString()}</TableCell>
                  <TableCell>
                    <ChartContainer config={config} className="aspect-auto h-8 w-36" aria-label={`Daily % served on for ${f.name}`}>
                      <LineChart data={f.trend} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
                        <YAxis hide domain={[0, 100]} />
                        <ChartTooltip cursor={false} content={tooltip("day")} />
                        <Line dataKey="pct" type="monotone" stroke="var(--color-pct)" strokeWidth={2} dot={false} connectNulls />
                      </LineChart>
                    </ChartContainer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
