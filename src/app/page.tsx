import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { APIKeyCreator, Flag } from "~/lib/interfaces";
import { logError } from "~/lib/logger";
import { getDashboardSummary } from "~/server/get-dashboard-summary";

function formatTimestamp(value?: string): string {
  if (!value) {
    return "Unknown";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function changeLabel(flag: Flag): string {
  return flag.enabled ? "On" : "Off";
}

function creatorLabel(creator?: APIKeyCreator): string {
  if (!creator) {
    return "No SDK keys yet";
  }

  if (creator.email) {
    return `${creator.name} · ${creator.email}`;
  }

  return creator.name;
}

export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <div className={"flex justify-center"}>
        <SignIn />
      </div>
    );
  }

  try {
    const {
      projects,
      agents,
      environments,
      allFlags,
      newestProject,
      newestFlag,
      recentFlagChanges,
      environmentCoverage,
      stats,
    } = await getDashboardSummary(userId);

    return (
      <div className={"grid gap-4"}>
        <header>
          <h1 className={"text-2xl font-semibold"}>Dashboard</h1>
          <p className={"text-muted-foreground text-sm"}>
            Org snapshot across projects, agents, environments, flags.
          </p>
        </header>

        <section className={"grid gap-4 md:grid-cols-2 xl:grid-cols-4"}>
          <Card>
            <CardHeader>
              <CardDescription>Projects</CardDescription>
              <CardTitle className={"text-3xl"}>{projects.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Agents</CardDescription>
              <CardTitle className={"text-3xl"}>{agents.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Environments</CardDescription>
              <CardTitle className={"text-3xl"}>{environments.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Flags</CardDescription>
              <CardTitle className={"text-3xl"}>{allFlags.length}</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className={"grid gap-4 xl:grid-cols-2"}>
          <Card>
            <CardHeader>
              <CardDescription>Newest project</CardDescription>
              <CardTitle>
                {newestProject ? (
                  <Link className={"hover:underline"} href={`/project/${newestProject.project_id}`}>
                    {newestProject.name}
                  </Link>
                ) : (
                  "No projects yet"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className={"space-y-2 text-sm"}>
              {newestProject ? (
                <>
                  <div className={"text-muted-foreground"}>{newestProject.project_id}</div>
                  <div className={"flex items-center gap-2"}>
                    <Badge variant={newestProject.enabled ? "default" : "secondary"}>
                      {newestProject.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <span>{newestProject.agents_used ?? 0} agents in use</span>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Newest flag</CardDescription>
              <CardTitle>{newestFlag ? newestFlag.flag.details.name : "No flags yet"}</CardTitle>
            </CardHeader>
            <CardContent className={"space-y-2 text-sm"}>
              {newestFlag ? (
                <>
                  <div className={"text-muted-foreground"}>
                    {newestFlag.environment.project_name} / {newestFlag.environment.agent_name} /{" "}
                    <Link
                      className={"hover:underline"}
                      href={`/environment/${newestFlag.environment.environment_id}`}
                    >
                      {newestFlag.environment.name}
                    </Link>
                  </div>
                  <div className={"flex items-center gap-2"}>
                    <Badge variant={newestFlag.flag.enabled ? "default" : "secondary"}>
                      {changeLabel(newestFlag.flag)}
                    </Badge>
                    <span>Last changed {formatTimestamp(newestFlag.flag.details.lastChanged)}</span>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <section className={"grid gap-4 xl:grid-cols-[1.4fr_1fr]"}>
          <Card>
            <CardHeader>
              <CardTitle>Recent flag changes</CardTitle>
              <CardDescription>Last 5 flags ordered by change time.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentFlagChanges.length === 0 ? (
                <p className={"text-muted-foreground text-sm"}>No flag changes yet.</p>
              ) : (
                <div className={"space-y-3"}>
                  {recentFlagChanges.map((entry) => (
                    <div
                      className={"flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"}
                      key={`${entry.environment.environment_id}-${entry.flag.details.id}`}
                    >
                      <div>
                        <div className={"font-medium"}>{entry.flag.details.name}</div>
                        <div className={"text-muted-foreground text-sm"}>
                          {entry.environment.project_name} / {entry.environment.agent_name} /{" "}
                          <Link
                            className={"hover:underline"}
                            href={`/environment/${entry.environment.environment_id}`}
                          >
                            {entry.environment.name}
                          </Link>
                        </div>
                      </div>
                      <div className={"flex items-center gap-3 text-sm"}>
                        <Badge variant={entry.flag.enabled ? "default" : "secondary"}>
                          {changeLabel(entry.flag)}
                        </Badge>
                        <span className={"text-muted-foreground"}>
                          {formatTimestamp(entry.flag.details.lastChanged)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment coverage</CardTitle>
              <CardDescription>Where most flags live right now.</CardDescription>
            </CardHeader>
            <CardContent>
              {environmentCoverage.length === 0 ? (
                <p className={"text-muted-foreground text-sm"}>No environments yet.</p>
              ) : (
                <div className={"space-y-3"}>
                  {environmentCoverage.map((environmentDetails) => (
                    <div
                      className={"flex items-center justify-between rounded-lg border p-3"}
                      key={environmentDetails.environment_id}
                    >
                      <div>
                        <div className={"font-medium"}>
                          <Link
                            className={"hover:underline"}
                            href={`/environment/${environmentDetails.environment_id}`}
                          >
                            {environmentDetails.name}
                          </Link>
                        </div>
                        <div className={"text-muted-foreground text-sm"}>
                          {environmentDetails.project_name} / {environmentDetails.agent_name}
                        </div>
                      </div>
                      <div className={"text-right text-sm"}>
                        <div>{environmentDetails.totalFlags} flags</div>
                        <div className={"text-muted-foreground"}>
                          {environmentDetails.enabledFlags} enabled
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className={"grid gap-4 xl:grid-cols-[1.4fr_1fr]"}>
          <Card>
            <CardHeader>
              <CardTitle>Environment requests</CardTitle>
              <CardDescription>
                Single-flag calls come from OFREP. All-flags calls come from OFREP bulk and flags.gg SDK fetches.
              </CardDescription>
            </CardHeader>
            <CardContent className={"space-y-4"}>
              <div className={"grid gap-3 md:grid-cols-3"}>
                <div className={"rounded-lg border p-3"}>
                  <div className={"text-muted-foreground text-sm"}>Total requests</div>
                  <div className={"text-2xl font-semibold"}>{stats.request_totals.total_requests ?? 0}</div>
                </div>
                <div className={"rounded-lg border p-3"}>
                  <div className={"text-muted-foreground text-sm"}>Single flag</div>
                  <div className={"text-2xl font-semibold"}>{stats.request_totals.single_flag_requests ?? 0}</div>
                </div>
                <div className={"rounded-lg border p-3"}>
                  <div className={"text-muted-foreground text-sm"}>All flags</div>
                  <div className={"text-2xl font-semibold"}>{stats.request_totals.all_flags_requests ?? 0}</div>
                </div>
              </div>

              {stats.environment_requests.length === 0 ? (
                <p className={"text-muted-foreground text-sm"}>No environment requests recorded yet.</p>
              ) : (
                <div className={"space-y-3"}>
                  {stats.environment_requests.slice(0, 5).map((summary) => (
                    <div className={"rounded-lg border p-3"} key={`${summary.environment_id}-${summary.agent_id}`}>
                      <div className={"flex flex-col gap-2 md:flex-row md:items-center md:justify-between"}>
                        <div>
                          <div className={"font-medium"}>
                            <Link className={"hover:underline"} href={`/environment/${summary.environment_id}`}>
                              {summary.environment_name || summary.environment_id}
                            </Link>
                          </div>
                          <div className={"text-muted-foreground text-sm"}>
                            {summary.project_name} / {summary.agent_name}
                          </div>
                        </div>
                        <div className={"text-right text-sm"}>
                          <div>{summary.total_requests} total</div>
                          <div className={"text-muted-foreground"}>
                            {summary.single_flag_requests} single, {summary.all_flags_requests} all
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Latest SDK key creator</CardTitle>
              <CardDescription>Most recent API key generated for this org.</CardDescription>
            </CardHeader>
            <CardContent className={"space-y-3 text-sm"}>
              <div className={"font-medium"}>{creatorLabel(stats.latest_api_key_creator)}</div>
              {stats.latest_api_key_creator ? (
                <>
                  <div className={"text-muted-foreground"}>
                    {stats.latest_api_key_creator.project_name} / {stats.latest_api_key_creator.agent_name}
                    {stats.latest_api_key_creator.environment_name
                      ? ` / ${stats.latest_api_key_creator.environment_name}`
                      : ""}
                  </div>
                  <div className={"text-muted-foreground"}>
                    Created {formatTimestamp(stats.latest_api_key_creator.created_at)}
                  </div>
                </>
              ) : (
                <div className={"text-muted-foreground"}>No audit rows yet.</div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    );
  } catch (error) {
    logError("failed to build dashboard home", error);

    return (
      <div className={"grid gap-4"}>
        <header>
          <h1 className={"text-2xl font-semibold"}>Dashboard</h1>
        </header>
        <Card>
          <CardContent className={"pt-6"}>
            <p>Failed to load dashboard overview.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
