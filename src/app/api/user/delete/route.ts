import { NextResponse } from "next/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

import { env } from "~/env";
import { authHeader } from "~/server/api";
import { logError } from "~/lib/logger";

export async function DELETE() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/user`, {
      method: 'DELETE',
      headers: {
        ...(await authHeader()),
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    // Only remove the Clerk identity once the API has deleted the account data.
    await (await clerkClient()).users.deleteUser(user.id)

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (e) {
    logError('Failed to delete user', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}