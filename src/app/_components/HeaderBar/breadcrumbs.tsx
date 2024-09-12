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
import {Fragment} from "react";

export default function BreadCrumbs() {
  const [breadcrumbs] = useAtom(breadCrumbAtom)
  if (!breadcrumbs) {
    return (
      <Breadcrumb className={"hidden md:flex"} key={"breadcrumbs-nocrumbs-root"}>
        <BreadcrumbList key={"breadcrumbs-nocrumbs-list"}>
          <BreadcrumbItem key={"breadcrumbs-nocrumbs-home"}>
            <BreadcrumbLink asChild key={"breadcrumbs-nocrumbs-home-link-parent"}>
              <Link href={"/"} key={"breadcrumbs-nocrumbs-home-link"}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb className={"hidden md:flex"} key={"breadcrumbs-root"}>
      <BreadcrumbList key={"breadcrumbs-list"}>
        <BreadcrumbItem key={"breadcrumbs-home"}>
          <BreadcrumbLink asChild key={"breadcrumbs-home-link-parent"}>
            <Link href={"/"} key={"breadcrumbs-home-link"}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb) => (
          <Fragment key={`${crumb.url}-container`}>
            <BreadcrumbSeparator key={`${crumb.url}-separator`} />
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
