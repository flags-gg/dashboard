export default async function EnvironmentPage({params}: {params: {environment_id: string}}) {
  return (
    <div>
      <h1>Environment {params.environment_id}</h1>
    </div>
  )
}
