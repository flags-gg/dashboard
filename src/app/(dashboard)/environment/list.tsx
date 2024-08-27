import {type Session} from "next-auth";
import {type EnvironmentsData} from "~/lib/statemanager";
import {Card} from "~/components/ui/card";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "~/components/ui/table";
import Link from "next/link";
import {getEnvironments} from "~/app/api/environment/environment";

export default async function EnvironmentsList({ session, agent_id }: { session: Session, agent_id: string }) {
  let environments: EnvironmentsData;
  try {
    environments = await getEnvironments(session, agent_id);
  } catch (e) {
    console.error(e);
    return <div>Error loading environments. Please try again later</div>
  }

  return (
    <div className="gap-3 col-span-2">
      <Card className={"mb-3"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Environment ID</TableCell>
              <TableCell>Enabled</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {environments.environments.map(environment => (
              <TableRow key={environment.id}>
                <TableCell>
                  <Link href={`/environment/${environment.environment_id}`}>{environment.name}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/environment/${environment.environment_id}`}>{environment.environment_id}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/environment/${environment.environment_id}`}>{environment.enabled ? "True" : "False"}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
