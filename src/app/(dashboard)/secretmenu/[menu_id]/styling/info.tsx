import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useStyleContext } from "./context";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useStyles } from "~/hooks/use-styles";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";

const styleNames: Record<string, string> = {
  resetButton: "Reset Button",
  closeButton: "Close Button",
  container: "Container",
  flag: "Flag",
  buttonEnabled: "Enabled Button",
  buttonDisabled: "Disabled Button",
  header: "Header",
}

async function saveStyle({style, menuId, styleId}: {style: string, menuId: string, styleId?: string}) {
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

export default function Info({menuId}: {menuId: string}) {
  const {resetStyle, modifiedStyles, styles} = useStyleContext();
  const {data, isLoading, error} = useStyles(menuId);

  if (isLoading) {
    return <Skeleton className="h-[125px] w-[250px] rounded-xl" />
  }

  if (error) {
    return <div key={"styling-info-error"}>Error: {error.message}</div>
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
              {Array.from(modifiedStyles)?.map((styleKey) => (
                <div key={`${styleKey}-container`}>
                  <Button key={`${styleKey}-button`} onClick={() => resetStyle(styleKey)}>
                    {styleNames[styleKey]}
                  </Button>
                </div>
              ))}
            </div>
            <Separator />
            <Button onClick={() => {
              const style = JSON.stringify(styles)
              if (styleId) {
                saveStyle({style, menuId: menuId, styleId: styleId}).then(() => {
                  toast("Style Saved", {
                    description: "The style has been saved",
                  })
                }).catch((e) => {
                  toast("Error Saving Style", {
                    description: `There was an error saving the style: ${e}`,
                  })
                })
              } else {
                saveStyle({style, menuId: menuId}).then(() => {
                  toast( "Style Saved", {
                    description: "The style has been saved",
                  })
                }).catch((e) => {
                  toast("Error Saving Style", {
                    description: `There was an error saving the style: ${e}`,
                  })
                })
              }
            }}>Save Custom Style</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}