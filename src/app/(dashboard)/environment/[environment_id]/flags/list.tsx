import {type Flag} from "~/lib/statemanager";
import {Card} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getFlags } from "~/app/api/flag/list";
import { FlagSwitch } from "./switch";
import { DeleteFlag } from "./delete";
import { EditFlag } from "./edit";

export default async function FlagsList({ environment_id, }: { environment_id: string; }) {
  let flags: Flag[] = [];
  try {
    await getFlags(environment_id).then((data) => {
      flags = data;
    }).catch((e) => {
      throw e;
    });
  } catch (e) {
    console.error("flags", e);
    return (
      <div className="col-span-2 gap-3">
        <Card className={"mb-3 p-3"}>
          Error Loading Flags
        </Card>
      </div>
    )
  }

  return (
    <div className="col-span-2 gap-3">
      <Card className={"mb-3"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell colSpan={2}>Enabled</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flags?.map((flag: Flag) => (
              <TableRow key={flag.details.id}>
                <TableCell>{flag.details.name}</TableCell>
                <TableCell colSpan={2}>
                  <FlagSwitch flag={flag} />
                </TableCell>
                <TableCell className={"gap-2 flex flex-row-reverse"}>
                  <DeleteFlag flag={flag} />
                  <EditFlag flag={flag} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
