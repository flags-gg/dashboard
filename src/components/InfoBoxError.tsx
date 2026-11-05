import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import Link from "next/link";

export async function InfoBoxError({ name, blurb }: { name: string, blurb: string }) {
  return (
    <Card>
        <CardHeader className={"flex flex-row items-start bg-muted/50"}>
          <CardTitle className={"group flex items-center gap-2 text-lg capitalize"}>Error Loading {name}</CardTitle>
        </CardHeader>
        <CardContent className={"p-6 text-sm"}>
          <p>There was an error loading the {name} information. Please try again later.</p>
          <p>If this error persists, please <Link href="/support" className="underline underline-offset-4">contact support</Link>.</p>
          <p>Error: {blurb}</p>
        </CardContent>
      </Card>
  );
}
