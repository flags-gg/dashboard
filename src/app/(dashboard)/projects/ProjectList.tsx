'use client'

import {Table, TableBody, TableCell, TableHeader, TableRow} from "~/components/ui/table";
import {useRouter} from "next/navigation";
import {useAtom} from "jotai";
import {type IProject, projectAtom} from "~/lib/statemanager";

type ProjectsData = {
  projects: IProject[]
}

export default function ProjectList({ projects }: { projects: ProjectsData }) {
  const router = useRouter()
  const [, setSelectedProject] = useAtom(projectAtom);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Project ID</TableCell>
          <TableCell>Agent Limit</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.projects.map(project => (
          <TableRow key={project.id} onClick={() => {
            setSelectedProject(project)
            router.push(`/project/${project.project_id}`)}
          } style={{cursor: "pointer"}}>
            <TableCell><img src={project.logo} alt={project.name} width={"50px"} height={"50px"}/></TableCell>
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.project_id}</TableCell>
            <TableCell>{project.agent_limit}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
