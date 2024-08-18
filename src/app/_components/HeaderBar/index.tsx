import {SearchBox} from "./search";
import {UserNav} from "./user-nav";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "~/components/ui/breadcrumb";
import Link from "next/link";

export default async function HeaderBar() {
  return (
    <header className={"sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"}>
      <Breadcrumb className={"hidden md:flex"}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={"/"}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SearchBox />
      <UserNav />
    </header>
  )
}
