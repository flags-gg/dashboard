import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

// Page sections as tabs; the first one is the day-to-day view and opens by default.
export function PageTabs({ tabs }: { tabs: { value: string, label: string, content: ReactNode }[] }) {
  return (
    <Tabs defaultValue={tabs[0]?.value} className="gap-6">
      <TabsList>
        {tabs.map(t => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
      </TabsList>
      {tabs.map(t => <TabsContent key={t.value} value={t.value}>{t.content}</TabsContent>)}
    </Tabs>
  );
}
