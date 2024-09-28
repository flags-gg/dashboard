"use client"

import { type Session } from "next-auth";
import { Card, CardContent } from "~/components/ui/card";
import { CSSProperties } from "react";
import { CircleX } from "lucide-react";
import ResetButton from "./resetButton";

export default function Container({session, menuId}: {session: Session, menuId: string}) {
  const styles: { [key: string]: CSSProperties } = {
    closeButton: {
      position: "absolute",
      top: "0.2rem",
      right: "0.5rem",
      color: "#F8F8F2",
      cursor: "pointer",
      background: "transparent",
      fontWeight: 900,
    },
    container: {
      position: "relative",
      backgroundColor: "#282A36",
      color: "black",
      border: "2px solid #BD93F9",
      borderRadius: "0.5rem",
      padding: "1rem",
    },
    flag: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.5rem",
      background: "#44475A",
      borderRadius: "5px",
      margin: "0.5rem 0",
      color: "#F8F8F2",
      minWidth: "20rem",
    },
    buttonEnabled: {
      background: "#BD93F9",
      padding: "0.4rem",
      borderRadius: "0.5rem",
      color: "#44475A",
      fontWeight: 500,
    },
    buttonDisabled: {
      background: "#FF79C6",
      padding: "0.4rem",
      borderRadius: "0.5rem",
      color: "#44475A",
      fontWeight: 500,
    },
    header: {
      fontWeight: 700,
      color: "#F8F8F2",
      top: "-0.6rem",
      position: "relative",
      marginRight: "1rem",
      marginLeft: "1.5rem",
    }
  };

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