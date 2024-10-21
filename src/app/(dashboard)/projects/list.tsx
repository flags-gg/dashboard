import {Table, TableBody, TableCell, TableHeader, TableRow} from "~/components/ui/table";
import {type ProjectsData} from "~/lib/statemanager";
import {Card} from "~/components/ui/card";
import {getProjects} from "~/app/api/project/project";
import Link from "next/link";
import Image from "next/image";
import { ShieldPlus } from "lucide-react";

export default async function ProjectList() {
  let projects: ProjectsData;
  try {
    projects = await getProjects();
  } catch (e) {
    console.error(e);
    return <div className={"gap-3 col-span-2"}>
      <Card className={"mb-3 p-3"}>
        Error loading projects
      </Card>
    </div>
  }

  return (
    <div className={"col-span-2"}>
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
                <TableCell className={"place-content-center justify-center"} style={{ paddingLeft: "3%" }}>
                  <Link href={`/project/${project.project_id}`}>
                    {project.logo ? <Image src={project.logo} alt={project.name} width={50} height={50} /> : <ShieldPlus className={"h-5 w-5"} />}
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
      </Card>
    </div>
  )
}
