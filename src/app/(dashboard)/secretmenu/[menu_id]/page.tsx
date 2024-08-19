export default async function SecretMenuPage({params}: {params: {menu_id: string}}) {
  return (
    <div>
      <h1>SecretMenu {params.menu_id}</h1>
    </div>
  )
}
