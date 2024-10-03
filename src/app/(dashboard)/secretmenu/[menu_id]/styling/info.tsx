import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useStyleContext } from "./context";
import { Button } from "~/components/ui/button";
import { type Session } from "next-auth";
import { Separator } from "~/components/ui/separator";

const styleNames: Record<string, string> = {
  resetButton: "Reset Button",
  closeButton: "Close Button",
  container: "Container",
  flag: "Flag",
  buttonEnabled: "Enabled Button",
  buttonDisabled: "Disabled Button",
  header: "Header",
}

async function saveStyle(session: Session, menuId: string, style: string) {
  try {
    const response = await fetch(`/api/secretmenu/style`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionToken: session.user.access_token,
        userId: session.user.id,
        menuId: menuId,
        style: style,
      }),
      cache: "no-store",
    })
    if (!response.ok) {
      return new Error("Failed to save style")
    }

    return await response.json()
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to save style: ${e.message}`)
    } else {
      console.error("saveStyle", e)
    }
  }

  return null
}

export default function Info({session, menuId}: {session: Session, menuId: string}) {
  const {resetStyle, modifiedStyles, styles} = useStyleContext();
  console.info("session", session, "menuId", menuId)

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>
          Styling Help
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <div className={"mb-5"}>
          <span>Click on any element to edit it.</span>
        </div>
        {modifiedStyles.size > 0 && (
          <div className="mt-4 space-y-2">
            <span>Reset modified styles:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from(modifiedStyles).map((styleKey) => (
                <>
                  <Button key={styleKey} onClick={() => resetStyle(styleKey)}>
                    {styleNames[styleKey]}
                  </Button>
                </>
              ))}
            </div>
            <Separator />
            <Button onClick={() => {
              const style = JSON.stringify(styles)
              saveStyle(session, menuId, style).then(r => {
                console.info("Style saved", r);
              }).catch((e) => {
                console.error("Error saving style", e);
              })
            }}>Save Custom Style</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}