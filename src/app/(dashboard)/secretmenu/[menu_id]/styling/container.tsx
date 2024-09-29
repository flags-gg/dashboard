"use client"

import { type Session } from "next-auth";
import { Card, CardContent } from "~/components/ui/card";
import { CircleX } from "lucide-react";
import ResetButton from "./resetButton";
import { useStyleContext } from "./context";

export default function Container({session, menuId}: {session: Session, menuId: string}) {
  const {styles} = useStyleContext();

  return (
    <div className="col-span-2 gap-3">
      <Card className={"mb-3"}>
        <CardContent className={"p-6 text-sm"}>
          <div style={styles.container}>
            <ResetButton session={session} menuId={menuId} />
            <button style={styles.closeButton}><CircleX /></button>
            <h1 style={styles.header}>Secret Menu</h1>
            <div key={`sm_item_enabled_example`} style={styles.flag}>
              <span>Enabled Example Flag</span>
              <button style={styles.buttonEnabled}>Enabled</button>
            </div>
            <div key={`sm_item_disabled_example`} style={styles.flag}>
              <span>Disabled Example Flag</span>
              <button style={styles.buttonDisabled}>Disabled</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}