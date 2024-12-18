import { useCompanyDetails } from "~/hooks/use-company-details";
import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { NewLoader } from "~/components/ui/new-loader";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface IError {
  message: string
  title: string
}

export default function Plan() {
  const {data: companyInfo, isLoading} = useCompanyDetails();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const {toast} = useToast();
  const [errorInfo] = useState({} as IError);
  const [showError] = useState(false);

  if (isLoading) {
    return <NewLoader />
  }

  if (showError) {
    toast({
      title: errorInfo.title,
      description: errorInfo.message,
      duration: 5000,
    })
  }

  console.info("companyInfo", companyInfo)

  return (
    <ul className={"grid gap-3"}>
      <li className={"flex items-center justify-between"}>
        <span>Plan</span>
        <span>{companyInfo?.payment_plan?.custom ? <span className={"text-sm text-gray-500"}>Custom</span> : (
          <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
            <DialogTrigger asChild>
              <Button className={"cursor-pointer capitalize"}>{companyInfo?.payment_plan?.name}</Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-[425px]"}>
              <DialogHeader>
                <DialogTitle>Upgrade your plan</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Upgrade your plan to increase your allowances.
              </DialogDescription>
              <DialogFooter className={"justify-between"}>
                <Button onClick={() => setUpgradeOpen(false)}>Cancel</Button>
                <Button onClick={() => setUpgradeOpen(false)}>Upgrade</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}</span>
      </li>
    </ul>
  )
}
