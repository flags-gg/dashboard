export default async function AgentPage({params}: {params: {agent_id: string}}) {
  return (
    <div>
      <h1>Agent {params.agent_id}</h1>
    </div>
  )
}
