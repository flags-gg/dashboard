import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "~/components/ui/breadcrumb";
import Link from "next/link";
// import {useAtomValue} from "jotai";
// import {breadCrumbAtom} from "~/lib/statemanager/breadcrumbs";

export default function BreadCrumbs() {
  // const breadcrumbs = useAtomValue(breadCrumbAtom).sort((a, b) => a.order - b.order);

  // return (
  //   <Breadcrumb className={"hidden md:flex"}>
  //     <BreadcrumbList>
  //       <BreadcrumbItem>
  //         <BreadcrumbLink asChild>
  //           <Link href={"/"}>Home</Link>
  //         </BreadcrumbLink>
  //       </BreadcrumbItem>
  //       {breadcrumbs.map((crumb) => (
  //         <BreadcrumbItem key={crumb.order}>
  //           <BreadcrumbLink asChild>
  //             <Link href={crumb.url}>{crumb.name}</Link>
  //           </BreadcrumbLink>
  //         </BreadcrumbItem>
  //       ))}
  //     </BreadcrumbList>
  //   </Breadcrumb>
  // )

  return (
    <Breadcrumb className={"hidden md:flex"}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/"}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
