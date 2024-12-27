import { useCompanyDetails } from "~/hooks/use-company-details";
import { useCallback, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { NewLoader } from "~/components/ui/new-loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useUpgradeChoices } from "~/hooks/use-upgrade-choices";
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { useFlags } from "@flags-gg/react-library";
import { UpgradeChoice } from "~/lib/interfaces";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

interface IError {
  message: string
  title: string
}

export default function Plan() {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

  const {data: companyInfo, isLoading: detailsLoading} = useCompanyDetails();
  const {data: upgradeChoices, isLoading: choicesLoading} = useUpgradeChoices();
  const [choicesOpen, setChoicesOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeChoice, setUpgradeChoice] = useState<UpgradeChoice | null>(null)

  const {toast} = useToast();
  const [errorInfo] = useState({} as IError);
  const [showError] = useState(false);
  const {is} = useFlags();

  const fetchClientSecret = useCallback(async () => {
    let priceId: string | undefined

    if (is("dev prices")?.enabled()) {
      priceId = upgradeChoice?.stripe?.dev_price_id
    } else {
      priceId = upgradeChoice?.stripe?.price_id
    }

    const res = await fetch(`/api/company/upgrade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: priceId,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return ""
    }

    const resp = await res.json() as { clientSecret: string }

    return resp.clientSecret
  }, [upgradeChoice])
  const stripeOptions = { fetchClientSecret }

  if (detailsLoading || choicesLoading) {
    return <NewLoader />
  }

  if (showError) {
    toast({
      title: errorInfo.title,
      description: errorInfo.message,
      duration: 5000,
    })
  }

  return (
    <>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span>Plan</span>
          <span>{companyInfo?.payment_plan?.custom ? <span className={"text-sm text-gray-500"}>Custom</span> : (
            <Button className={"cursor-pointer capitalize"} onClick={() => setChoicesOpen(true)}>{companyInfo?.payment_plan?.name}</Button>
          )}</span>
        </li>
      </ul>
      <Dialog open={choicesOpen} onOpenChange={setChoicesOpen}>
        <DialogContent className={"grid gap-3 grid-cols-3 min-w-[90rem]"}>
          <DialogHeader className={"col-span-4"}>
            <DialogTitle>Upgrade your plan</DialogTitle>
            <DialogDescription>&nbsp;</DialogDescription>
          </DialogHeader>
          {upgradeChoices?.prices?.map((choice) => (
            <Card key={`upgrade-card-${choice.title}`} className={"mb-3"}>
              <CardHeader key={`upgrade-cardheader-${choice.title}`} className={"flex flex-row items-start bg-muted/50"}>
                <CardTitle key={`upgrade-cardtitle-${choice.title}`} className={"group flex items-center gap-2 text-lg"}>
                  {choice.title}
                </CardTitle>
              </CardHeader>
              <CardContent key={`upgrade-cardcontent-${choice.title}`} className={"p-6 text-sm"}>
                <table key={`upgrade-card-table-${choice.title}`} className={"table-auto min-w-full"}>
                  <tbody>
                    <tr key={`upgrade-card-table-row1-${choice.title}`}>
                      <td key={`upgrade-card-table-cell1-${choice.title}`}>Agents</td>
                      <td key={`upgrade-card-table-cell2-${choice.title}`}>{choice.agents}</td>
                    </tr>
                    <tr key={`upgrade-card-table-row2-${choice.title}`}>
                      <td key={`upgrade-card-table-cell3-${choice.title}`}>Environments</td>
                      <td key={`upgrade-card-table-cell4-${choice.title}`}>{choice.environments}</td>
                    </tr>
                    <tr key={`upgrade-card-table-row3-${choice.title}`}>
                      <td key={`upgrade-card-table-cell5-${choice.title}`}>Team Members</td>
                      <td key={`upgrade-card-table-cell6-${choice.title}`}>{choice.team_members}</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
              <CardFooter  key={`upgrade-cardfooter-${choice.title}`} className={"p-3 border-t-2 items-center justify-center"}>
                <Button  key={`upgrade-card-button-${choice.title}`} onClick={() => {
                  setUpgradeChoice(choice)
                  setChoicesOpen(false)
                  setUpgradeOpen(true)
                }}>{choice.price ? `$${choice.price} Upgrade` : "Custom"}</Button>
              </CardFooter>
            </Card>
          ))}
        </DialogContent>
      </Dialog>

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade your plan</DialogTitle>
            <DialogDescription>&nbsp;</DialogDescription>
          </DialogHeader>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={stripeOptions}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}
