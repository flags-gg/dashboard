"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import Link from "next/link";
import {useAtom} from "jotai";
import { Fragment, useEffect } from "react";
import { commitHashAtom, secretMenuAtom } from "~/lib/statemanager";
import { useEnvironment } from "~/hooks/use-environment";
import { useAgent } from "~/hooks/use-agent";
import { useProject } from "~/hooks/use-project";
import {usePathname} from "next/navigation";

function useBreadcrumbs() {
  const [secretMenu] = useAtom(secretMenuAtom)
  const pathname = usePathname()

  const pathSegments = pathname.split("/").filter(Boolean) ?? []
  const [section = "", id = ""] = pathSegments

  // ids come from the route and the fetched data, never from persisted atoms, which hold whatever was visited last
  // ponytail: secretMenuAtom is only trusted when it's for this route's menu, it's set from server data on that page
  const menu = section === "secretmenu" && secretMenu?.menu_id === id ? secretMenu : undefined
  const environmentId = section === "environment" ? id : (menu?.environment_details?.environment_id ?? "")
  const { data: environment } = useEnvironment(environmentId)
  const agentId = section === "agent" ? id : (environment?.agent_id ?? "")
  const { data: agent } = useAgent(agentId)
  const projectId = section === "project" ? id : (agent?.project_info?.project_id ?? "")
  const { data: project } = useProject(projectId)

  const breadcrumbs = [{
    title: "Home",
    url: "/",
  }]

  if (section === "company") {
    breadcrumbs.push({ title: "Company", url: "/company" });
    return breadcrumbs
  }

  if (["projects", "project", "agent", "environment", "secretmenu"].includes(section)) {
    breadcrumbs.push({ title: "Projects", url: "/projects" });
  }

  if (projectId) {
    breadcrumbs.push({
      title: project?.name || agent?.project_info?.name || `Project ${projectId}`,
      url: `/project/${projectId}`,
    });
  }

  if (agentId) {
    breadcrumbs.push({
      title: agent?.name || environment?.agent_name || `Agent ${agentId}`,
      url: `/agent/${agentId}`,
    });
  }

  if (environmentId) {
    breadcrumbs.push({
      title: `${environment?.name || menu?.environment_details?.name || `Environment ${environmentId}`} - Flags`,
      url: `/environment/${environmentId}`,
    });
  }

  if (menu) {
    breadcrumbs.push({
      title: "Secret Menu",
      url: `/secretmenu/${menu.menu_id}`,
    });

    if (pathSegments.includes("styling")) {
      breadcrumbs.push({
        title: "Styling",
        url: `/secretmenu/${menu.menu_id}/styling`,
      });
    }
  }

  return breadcrumbs
}

export default function BreadCrumbs({commitHash}: {commitHash: string}) {
  const breadcrumbs = useBreadcrumbs()
  const [, setCommitHash] = useAtom(commitHashAtom)
  const pathname = usePathname()
  useEffect(() => {
    setCommitHash(commitHash)
  }, [commitHash])

  return (
    <Breadcrumb className={"md:flex"} key={"breadcrumbs-root"}>
      <BreadcrumbList key={"breadcrumbs-list"}>
        {breadcrumbs?.map((crumb, index) => (
          <Fragment key={`${crumb.url}-container`}>
            {index > 0 && <BreadcrumbSeparator key={`${crumb.url}-separator`} />}
            <BreadcrumbItem key={`${crumb.url}-item`}>
              {pathname === crumb.url ? (
                <BreadcrumbPage className={"cursor-default"}>{crumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink key={`${crumb.url}-link-parent`} asChild>
                  <Link href={crumb.url} key={`${crumb.url}-link`}>{crumb.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
