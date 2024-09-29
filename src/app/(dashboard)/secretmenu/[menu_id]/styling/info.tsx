import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useStyleContext } from "./context";
import { Button } from "~/components/ui/button";

const styleNames: {[key: string]: string} = {
  resetButton: "Reset Button",
  closeButton: "Close Button",
  container: "Container",
  flag: "Flag",
  buttonEnabled: "Enabled Button",
  buttonDisabled: "Disabled Button",
  header: "Header",
}
type StyleKey = keyof typeof styleNames;
function isStyleKey(key: string | number): key is StyleKey {
  return typeof key === 'string' && key in styleNames;
}

export default function Info() {
  const {resetStyle, modifiedStyles} = useStyleContext();

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
                <Button key={styleKey} onClick={() => resetStyle(styleKey)}>
                  {styleNames[styleKey]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}