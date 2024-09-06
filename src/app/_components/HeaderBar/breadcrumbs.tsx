"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import Link from "next/link";
import {breadCrumbAtom} from "~/lib/statemanager";
import {useAtom} from "jotai";

export default function BreadCrumbs() {
  const [breadcrumbs] = useAtom(breadCrumbAtom)
  if (!breadcrumbs) {
    return null
  }

  return (
    <Breadcrumb className={"hidden md:flex"}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/"}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem key={crumb.url}>
              <BreadcrumbLink asChild>
                <Link href={crumb.url}>{crumb.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
