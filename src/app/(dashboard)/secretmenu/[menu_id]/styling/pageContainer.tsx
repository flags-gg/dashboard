"use client"

import { type Session } from "next-auth";
import { Card, CardContent } from "~/components/ui/card";
import { useStyleContext } from "./context";
import ResetButton from "./resetButton";
import MenuHeader from "./menuHeader";
import CloseButton from "./closeButton";
import ContainerElement from "./containerElement";

export default function PageContainer({session, menuId}: {session: Session, menuId: string}) {
  const {styles} = useStyleContext();

  return (
    <div className="col-span-2 gap-3">
      <Card className={"mb-3"}>
        <CardContent className={"p-6 text-sm"}>
          <ContainerElement session={session} menuId={menuId}>
            <ResetButton session={session} menuId={menuId} />
            <CloseButton session={session} menuId={menuId} />
            <MenuHeader session={session} menuId={menuId} />
            <div key={`sm_item_enabled_example`} style={styles.flag}>
              <span>Enabled Example Flag</span>
              <button style={styles.buttonEnabled}>Enabled</button>
            </div>
            <div key={`sm_item_disabled_example`} style={styles.flag}>
              <span>Disabled Example Flag</span>
              <button style={styles.buttonDisabled}>Disabled</button>
            </div>
          </ContainerElement>
        </CardContent>
      </Card>
    </div>
  )
}