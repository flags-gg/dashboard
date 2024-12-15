"use client"

import {Card} from "~/components/ui/card";
import { useFlags } from "@flags-gg/react-library";

export default function Settings() {
  const {is} = useFlags();

  if (!is("company settings")?.enabled()) {
    return <></>
  }

  return (
    <Card>
      Settings
    </Card>
  )
}
