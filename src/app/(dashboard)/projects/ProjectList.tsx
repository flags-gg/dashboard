'use client'

import { useState } from 'react'

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

  console.info("projects", projects)

  return (
    <div>
      <ul>
        {projects.projects.map(project => (
          <li key={project.id} onClick={() => setSelectedProject(project)}>
            {project.name}
          </li>
        ))}
      </ul>
      {selectedProject && (
        <div>
          <h2>Selected Project: {selectedProject.name}</h2>
          {/* Add more project details here */}
        </div>
      )}
    </div>
  )
}
