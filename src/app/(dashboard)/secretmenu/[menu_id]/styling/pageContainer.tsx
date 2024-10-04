import { Card, CardContent } from "~/components/ui/card";
import ResetButton from "./resetButton";
import MenuHeader from "./menuHeader";
import CloseButton from "./closeButton";
import ContainerElement from "./containerElement";
import Flag from "./flag";
import DisabledButton from "./disableButton";
import EnabledButton from "./enableButton";

export default function PageContainer() {
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