import { CompanyWebhooks } from "~/components/webhooks/company-webhooks";
import Info from "./info";
import Settings from "./settings";
import Users from "./users";
import Header from "./header";
import Integrations from "./integrations";
import { PageTabs } from "~/components/page-tabs";

export default async function Company() {
  return (
    <div className="space-y-4">
      <Header />
      <PageTabs tabs={[
        { value: "overview", label: "Overview", content: <div className="grid items-start gap-4 lg:grid-cols-2"><Info /><Settings /></div> },
        { value: "users", label: "Users", content: <Users /> },
        { value: "integrations", label: "Integrations", content: <Integrations /> },
        { value: "webhooks", label: "Webhooks", content: <CompanyWebhooks /> },
      ]} />
    </div>
  );
}
