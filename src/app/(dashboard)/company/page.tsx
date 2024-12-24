import {Separator} from "~/components/ui/separator";

import Info from "./info";
import Settings from "./settings";
import Users from "./users";
import Header from "./header";

export default function Company() {
  return (
    <div className="grid auto-rows-max items-start gap-4 col-span-3">
      <div className="grid gap-4 grid-cols-3">
        <Header />
        <Info />
        <div>&nbsp;</div>
        <Settings />
      </div>
      <Separator />
      <Users />
    </div>
  );
}
