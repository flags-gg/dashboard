"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import Link from "next/link";
import {useAtom} from "jotai";
import {Fragment} from "react";
import {agentAtom, environmentAtom, projectAtom, secretMenuAtom} from "~/lib/statemanager";
import {usePathname} from "next/navigation";
import { useFlags } from "@flags-gg/react-library";

function useBreadcrumbs() {
  const [project] = useAtom(projectAtom)
  const [agent] = useAtom(agentAtom)
  const [environment] = useAtom(environmentAtom)
  const [secretMenu] = useAtom(secretMenuAtom)
  const pathname = usePathname()

  const pathSegments = pathname.split("/").filter(Boolean) ?? []

  const breadcrumbs = [{
    title: "Home",
    url: "/",
  }]

  if (pathSegments[0] === "projects") {
    breadcrumbs.push({ title: "Projects", url: "/projects" });
    return breadcrumbs
  }

  // Add "Projects" breadcrumb if necessary
  if (
    pathSegments.includes("project") ||
    pathSegments.includes("agent") ||
    pathSegments.includes("environment") ||
    pathSegments.includes("secretmenu")
  ) {
    breadcrumbs.push({ title: "Projects", url: "/projects" });
  }

  // Add Project breadcrumb
  if (
    (pathSegments.includes("project") ||
      pathSegments.includes("agent") ||
      pathSegments.includes("environment") ||
      pathSegments.includes("secretmenu")) &&
    project?.project_id
  ) {
    breadcrumbs.push({
      title: project.name || `Project ${project.project_id}`,
      url: `/project/${project.project_id}`,
    });
  }

  // Add Agent breadcrumb
  if (
    (pathSegments.includes("agent") ||
      pathSegments.includes("environment") ||
      pathSegments.includes("secretmenu")) &&
    agent?.agent_id
  ) {
    breadcrumbs.push({
      title: agent.name || `Agent ${agent.agent_id}`,
      url: `/agent/${agent.agent_id}`,
    });
  }

  // Add Environment breadcrumb
  if (
    (pathSegments.includes("environment") || pathSegments.includes("secretmenu")) &&
    environment?.environment_id
  ) {
    let title = environment.name || `Environment ${environment.environment_id}`;
    title += " - Flags"

    breadcrumbs.push({
      title: title,
      url: `/environment/${environment.environment_id}`,
    });
  }

  // Add Secret Menu breadcrumb
  if (pathSegments.includes("secretmenu") && secretMenu?.menu_id) {
    breadcrumbs.push({
      title: "Secret Menu",
      url: `/secretmenu/${secretMenu.menu_id}`,
    });
  }

  if (pathSegments.includes("secretmenu") && pathSegments.includes("styling") && secretMenu?.menu_id) {
    breadcrumbs.push({
      title: "Styling",
      url: `/secretmenu/${secretMenu.menu_id}/styling`,
    });
  }

  return breadcrumbs
}

export default function BreadCrumbs() {
  const breadcrumbs = useBreadcrumbs()
  const {is} = useFlags()

  if (!is("breadcrumbs")?.enabled()) {
    return <></>
  }

  return (
    <Breadcrumb className={"hidden md:flex"} key={"breadcrumbs-root"}>
      <BreadcrumbList key={"breadcrumbs-list"}>
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={`${crumb.url}-container`}>
            {index > 0 && <BreadcrumbSeparator key={`${crumb.url}-separator`} />}
            <BreadcrumbItem key={`${crumb.url}-item`}>
              <BreadcrumbLink key={`${crumb.url}-link-parent`} asChild>
                <Link href={crumb.url} key={`${crumb.url}-link`}>{crumb.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
