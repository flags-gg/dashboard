'use client'

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "~/app/api/projects/projects";
import ProjectList from './ProjectList'
import { Progress } from "@radix-ui/react-progress";
import { Session } from "next-auth";

export default function ProjectListContainer({ session }: { session: Session }) {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(session),
  })

  if (isLoading) return <div><Progress /></div>
  if (isError) return <div>Error loading projects. Please try again later.</div>

  return <ProjectList projects={projects} />
}
