'use client'

import { useState } from 'react'
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table";

type Project = {
  id: number
  name: string
  project_id: string
  agent_limit: number
  logo: string
}

type ProjectsData = {
  projects: Project[]
}

export default function ProjectList({ projects }: { projects: ProjectsData }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

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
          <TableRow key={project.id} onClick={() => setSelectedProject(project)}>
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
