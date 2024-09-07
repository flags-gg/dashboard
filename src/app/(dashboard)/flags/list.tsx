import {type Session} from 'next-auth'
import { type Flag} from "~/lib/statemanager";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Link from "next/link";
import { getFlags } from "~/app/api/flag/flag";
import { FlagSwitch } from "./switch";

export default async function FlagsList({
  session,
  environment_id,
}: {
  session: Session;
  environment_id: string;
}) {
  let flags: Flag[] = [];
  try {
    flags = await getFlags(session, environment_id);
  } catch (e) {
    console.error("flags", e);
    return <div>Error loading flags. Please try again later.</div>;
  }

  return (
    <div className="col-span-2 gap-3">
      <Card className={"mb-3"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Enabled</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
            {flags.map((flag: Flag) => (
              <TableRow key={flag.details.id}>
                <TableCell>
                  <Link href={`/flag/${flag.details.id}`}>
                    {flag.details.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <FlagSwitch session={session} flag={flag} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
