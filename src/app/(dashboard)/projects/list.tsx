import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import {ProjectsData} from "~/lib/interfaces";
import {Card} from "~/components/ui/card";
import { fetchProjects } from "~/app/api/project/project";
import Link from "next/link";
import Image from "next/image";
import { ShieldPlus } from "lucide-react";

export default async function ProjectList() {
  let projects: ProjectsData = { projects: [] };
  try {
    projects = await fetchProjects();
  } catch (e) {
    console.error(e);
    return (
      <div className={"gap-3 col-span-2"}>
        <Card className={"mb-3 p-3"}>Error loading projects</Card>
      </div>
    );
  }

  if (!projects) {
    return <div className={"gap-3 col-span-2"}>
      <Card className={"mb-3 p-3"}>
        Loading projects
      </Card>
    </div>
  }

  return (
    <div className={"col-span-2"}>
      <Card className={"mb-3"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Project ID</TableHead>
              <TableHead>Agent Limit</TableHead>
              <TableHead>Agents Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.projects?.map(project => (
              <TableRow key={`project-${project.id}`}>
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
