import { Card, CardContent } from "~/components/ui/card";
import ResetButton from "./resetButton";
import MenuHeader from "./menuHeader";
import CloseButton from "./closeButton";
import ContainerElement from "./containerElement";
import Flag from "./flag";
import DisabledButton from "./disableButton";
import EnabledButton from "./enableButton";
import { type Session } from "next-auth";
import { type StyleState, useStyleContext } from "./context";
import { useEffect } from "react";

async function getStyle(session: Session, menuId: string): Promise<StyleState | Error> {
  try {
    const response = await fetch(`/api/secretmenu/style`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionToken: session.user.access_token,
        userId: session.user.id,
        menuId: menuId,
      }),
      cache: "no-store",
    })
    if (!response.ok) {
      return new Error("Failed to get style")
    }

    return await response.json()
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to get style: ${e.message}`)
    } else {
      console.error("getStyle", e)
    }
  }

  return new Error("Failed to get style")
}

export default function PageContainer({session, menuId}: {session: Session, menuId: string}) {
  const {styles, updateStyle, resetStyle, resetTimestamps, modifiedStyles} = useStyleContext();
  useEffect(() => {
    getStyle(session, menuId).then(r => {
      if ("container" in r) {
        updateStyle('container', r.container);
      }
      if ("flag" in r) {
        updateStyle('flag', r.flag);
      }
      if ("buttonEnabled" in r) {
        updateStyle('buttonEnabled', r.buttonEnabled);
      }
      if ("buttonDisabled" in r) {
        updateStyle('buttonDisabled', r.buttonDisabled);
      }
      if ("header" in r) {
        updateStyle('header', r.header);
      }
      if ("resetButton" in r) {
        updateStyle('resetButton', r.resetButton);
      }
      if ("closeButton" in r) {
        updateStyle('closeButton', r.closeButton);
      }
      console.info("Styles Retrieved", r);
    }).catch((e) => {
      console.error("Error updating style", e);
    })
  }, [session, menuId, updateStyle, resetStyle, resetTimestamps, modifiedStyles])

  return (
    <div className="col-span-2 gap-3">
      <Card className={"mb-3"}>
        <CardContent className={"p-6 text-sm"}>
          <ContainerElement key={`sm_container`}>
            <ResetButton key={`sm_reset_button`} />
            <CloseButton key={`sm_close_button`} />
            <MenuHeader key={`sm_menu_header`} />
            <Flag key={`sm_enabled_button_flag`}>
              <span key={`sm_enabled_button_flag_text`}>Enabled Example Flag</span>
              <EnabledButton key={`sm_enabled_button`} />
            </Flag>
            <Flag key={`sm_disabled_button_flag`}>
              <span key={`sm_disabled_button_flag_text`}>Disabled Example Flag</span>
              <DisabledButton key={`sm_disabled_button`} />
            </Flag>
          </ContainerElement>
        </CardContent>
      </Card>
    </div>
  )
}