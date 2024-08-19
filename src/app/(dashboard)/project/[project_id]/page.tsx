export default async function ProjectPage({params}: {params: {project_id: string}}) {
  return (
    <div>
      <h1>Project {params.project_id}</h1>
    </div>
  )
}
