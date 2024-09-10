"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import Link from "next/link";
import {breadCrumbAtom} from "~/lib/statemanager";
import {useAtom} from "jotai";

export default function BreadCrumbs() {
  const [breadcrumbs] = useAtom(breadCrumbAtom)
  if (!breadcrumbs) {
    return (
      <Breadcrumb className={"hidden md:flex"}>
        <BreadcrumbList>
          <BreadcrumbItem key={"home"}>
            <BreadcrumbLink asChild key={"home-link-parent"}>
              <Link href={"/"} key={"home-link"}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb className={"hidden md:flex"}>
      <BreadcrumbList>
        <BreadcrumbItem key={"home"}>
          <BreadcrumbLink asChild key={"home-link-parent"}>
            <Link href={"/"} key={"home-link"}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb) => (
          <BreadcrumbItem key={`${crumb.url}-item`}>
            <BreadcrumbSeparator key={`${crumb.url}-separator`}/>
            <BreadcrumbLink key={`${crumb.url}-link-parent`}>
              <Link href={crumb.url} key={`${crumb.url}-link`}>{crumb.title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
