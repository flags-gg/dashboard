import {Button} from "~/components/ui/button";
import {type Session} from "next-auth";
import {getCompanyLimits} from "~/app/api/company/company";

export default async function CreateProject({ session }: { session: Session }) {
  let projectsLeft = 0;
  try {
    const companyLimits = await getCompanyLimits(session);
    projectsLeft = companyLimits.projects.allowed - companyLimits.projects.used;
  } catch (e) {
    console.error("companyLimits", e);
    return <div>Error loading projects. Please try again later.</div>
  }

  if (projectsLeft <= 0) {
    return (
      <div className={"col-span-3"}>
        <p>You have reached the limit of projects you can create. Please upgrade your plan to create more projects.</p>
      </div>
    )
  }

  return (
    <div className={"col-span-3"}>
      <Button>Create Project</Button>
    </div>
  )
}
