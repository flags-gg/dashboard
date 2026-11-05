"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { SettingsSection } from "~/components/settings";
import { Button, buttonVariants } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { connectionGuides } from "~/lib/connection-guides";

export default function ConnectApp({ projectId, agentId, environmentId }: {
  projectId?: string;
  agentId: string;
  environmentId: string;
}) {
  const ready = Boolean(projectId);
  const credentials = { projectId: projectId ?? "YOUR_PROJECT_ID", agentId, environmentId };

  return (
    <SettingsSection title="Connect your app" description="Choose your SDK or connect directly to the API to read this environment's flags.">
      <Tabs defaultValue="react" className="min-w-0 p-4">
        <div className="min-w-0 overflow-x-auto pb-1">
          <TabsList aria-label="Connection method">
            {connectionGuides.map((guide) => (
              <TabsTrigger key={guide.id} value={guide.id}>{guide.label}</TabsTrigger>
            ))}
          </TabsList>
        </div>
        {!ready && <p className="text-sm text-muted-foreground">Project details are loading. Replace YOUR_PROJECT_ID if you copy an example now.</p>}
        {connectionGuides.map((guide) => {
          const snippet = guide.snippet(credentials);
          return (
            <TabsContent key={guide.id} value={guide.id} className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">{guide.description}</p>
                <a href={`https://docs.flags.gg/${guide.docs}`} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "link", size: "sm" })}>
                  {guide.label} documentation
                </a>
              </div>
              {guide.install && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Install</p>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs"><code>{guide.install}</code></pre>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{guide.id === "api" ? "Request" : "Configure"}</p>
                  <Button type="button" variant="outline" size="sm" aria-label={`Copy ${guide.label} example`}
                    onClick={() => void navigator.clipboard.writeText(snippet)
                      .then(() => toast("Configuration copied"))
                      .catch(() => toast.error("Could not copy configuration. Select and copy the example below."))}>
                    <Copy className="size-4" />Copy
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs"><code>{snippet}</code></pre>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </SettingsSection>
  );
}
