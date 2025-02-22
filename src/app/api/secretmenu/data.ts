import {SecretMenu} from "~/lib/interfaces";
import { currentUser } from "@clerk/nextjs/server";

import {env} from "~/env";

export async function getSecretMenu(menu_id: string): Promise<SecretMenu> {
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  const res = await fetch(`${env.API_SERVER}/secret-menu/${menu_id}`, {
    headers: {
      'x-user-subject': user.id,
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch secret menu')
  }
  return res.json()
}
