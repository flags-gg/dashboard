import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useStyleContext } from "./context";
import { Button } from "~/components/ui/button";
import { type Session } from "next-auth";
import { Separator } from "~/components/ui/separator";
import { useStyles } from "~/hooks/use-styles";

const styleNames: Record<string, string> = {
  resetButton: "Reset Button",
  closeButton: "Close Button",
  container: "Container",
  flag: "Flag",
  buttonEnabled: "Enabled Button",
  buttonDisabled: "Disabled Button",
  header: "Header",
}

async function saveStyle({session, style, menuId, styleId}: {session: Session, style: string, menuId: string, styleId?: string}) {
  try {
    const response = await fetch(`/api/secretmenu/style`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        menuId: menuId,
        styleId: styleId,
        style: style,
      }),
      cache: "no-store",
    })
    if (!response.ok) {
      return new Error("Failed to save style")
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
  const {data, isLoading, error} = useStyles(session, menuId);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }
  if (!data) {
    throw new Error("No data returned");
  }

  const styleId = data.id;

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
              if (styleId) {
                saveStyle({session, style, menuId: menuId, styleId: styleId}).then(() => {
                  console.info("Style saved");
                }).catch((e) => {
                  console.error("Error saving style", e);
                })
              } else {
                saveStyle({ session, style, menuId: menuId}).then(() => {
                  console.info("Style saved");
                }).catch((e) => {
                  console.error("Error saving style", e);
                })
              }
            }}>Save Custom Style</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}