import Link from "next/link";
import Image from "next/image";
import { ShieldPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { tableFrame } from "~/components/page-intro";
import { fetchProjects } from "~/app/api/project/project";
import { logError } from "~/lib/logger";

export default async function ProjectList() {
  let projects;
  try {
    projects = (await fetchProjects()).projects ?? [];
  } catch (e) {
    logError(e);
    return <p className="rounded-lg border p-4 text-sm">Error loading projects.</p>;
  }

  return (
    <div className={tableFrame}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-full">Project</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="text-right">Agents</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">No projects yet. Create one to get started.</TableCell>
            </TableRow>
          )}
          {projects.map(project => (
            // the name link covers the whole row
            <TableRow key={`project-${project.id}`} className="relative">
              <TableCell>
                <Link href={`/project/${project.project_id}`} className="flex items-center gap-3 font-medium after:absolute after:inset-0">
                  {project.logo
                    ? <Image src={project.logo} alt="" width={28} height={28} className="size-7 rounded object-cover" />
                    : <ShieldPlus aria-hidden className="size-5 text-muted-foreground" />}
                  {project.name}
                </Link>
              </TableCell>
              <TableCell><code className="text-xs text-muted-foreground">{project.project_id}</code></TableCell>
              <TableCell className="text-right tabular-nums">{project.agents_used} / {project.agent_limit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
