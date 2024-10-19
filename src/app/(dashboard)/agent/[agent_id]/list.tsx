import {Card} from "~/components/ui/card";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "~/components/ui/table";
import Link from "next/link";
import {getEnvironments} from "~/app/api/environment/environment";

export default async function EnvironmentsList({ agent_id }: { agent_id: string }) {
  const { data: environments, error } = await getEnvironments(agent_id);

  if (error ?? !environments) {
    console.error(error);
    return (
      <div className={"gap-3 col-span-2"}>
        <Card className={"mb-3 p-3"}>
          Error loading environments
        </Card>
      </div>
    )
  }

  return (
    <div className={"gap-3 col-span-2 min-w-[50rem]"}>
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
                  <Link
                    href={`/environment/${environment.environment_id}`}>{environment.enabled ? "True" : "False"}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}