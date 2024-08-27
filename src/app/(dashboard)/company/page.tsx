import Info from "~/app/(dashboard)/company/info";
import Settings from "~/app/(dashboard)/company/settings";
import {Separator} from "~/components/ui/separator";
import Users from "~/app/(dashboard)/company/users";
// import {breadCrumbAtom} from "~/lib/statemanager/breadcrumbs";
// import {useSetAtom} from "jotai";

export default function Company() {
  // const setBreadcrumbs = useSetAtom(breadCrumbAtom);
  // setBreadcrumbs([
  //   {
  //     name: "Company",
  //     url: "/company",
  //     order: 1,
  //   },
  // ]);

  return (
    <div className="grid auto-rows-max items-start gap-4 col-span-3">
      <div className="grid gap-4 grid-cols-3">
        <header className={"col-span-3"}>
          <h1 className={"text-2xl font-semibold"}>Company</h1>
        </header>
        <Info />
        <Settings />
      </div>
      <Separator />
      <Users />
    </div>
  );
}
