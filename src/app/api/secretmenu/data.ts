import {SecretMenu} from "~/lib/interfaces";
import { currentUser } from "@clerk/nextjs/server";

import {env} from "~/env";
import { authHeader, isUuid } from "~/server/api";

export async function getSecretMenu(menu_id: string): Promise<SecretMenu> {
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  if (!isUuid(menu_id)) {
    throw new Error('Invalid secret menu id')
  }

  const res = await fetch(`${env.API_SERVER}/secret-menu/${encodeURIComponent(menu_id)}`, {
    headers: {
      ...(await authHeader()),
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch secret menu')
  }
  return res.json()
}
