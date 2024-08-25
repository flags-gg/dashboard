import {Table, TableBody, TableCell, TableHeader, TableRow} from "~/components/ui/table";
import {type ProjectsData} from "~/lib/statemanager";
import {Separator} from "~/components/ui/separator";
import {Card} from "~/components/ui/card";
import {type Session} from "next-auth";
import {getProjects} from "~/app/api/project/project";
import Link from "next/link";

export default async function ProjectList({ session }: { session: Session }) {
  let projects: ProjectsData;
  try {
    projects = await getProjects(session);
  } catch (e) {
    console.error(e);
    return <div>Error loading projects. Please try again later</div>
  }

  return (
    <div className="gap-3 col-span-2">
      <Card className={"mb-3"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Project ID</TableCell>
              <TableCell>Agent Limit</TableCell>
              <TableCell>Agents Used</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.projects.map(project => (
              <TableRow key={project.id}>
                <TableCell className={"place-content-center justify-center"} style={{paddingLeft: "3%"}}>
                  <Link href={`/project/${project.project_id}`}>
                    <img src={project.logo} alt={project.name} width={"50px"} height={"50px"} />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/project/${project.project_id}`}>{project.name}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/project/${project.project_id}`}>{project.project_id}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/project/${project.project_id}`}>{project.agent_limit}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/project/${project.project_id}`}>{project.agents_used}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Separator />
      </Card>
    </div>
  )
}
