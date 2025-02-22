import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { env } from "~/env";
import { UserDetails } from "~/hooks/use-user-details";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/user`, {
      method: 'GET',
      headers: {
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch user details' }, { status: 404 })
    }

    const data = await response.json() as UserDetails
    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch user details', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const {firstName, lastName, knownAs, email} = await request.json();

  try {
    const response = await fetch(`${env.API_SERVER}/user`, {
      method: 'PUT',
      headers: {
        'x-user-subject': user.id,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        "emailAddress": email,
        "firstName": firstName,
        "lastName": lastName,
        "knownAs": knownAs,
      }),
    })
    if (!response.ok) {
      console.error('Failed to update user details', response)
      return NextResponse.json({ message: 'Failed to update user details' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User details updated' })
  } catch (e) {
    console.error('Failed to update user details', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const {firstName, lastName, knownAs, email} = await request.json();

  try {
    const response = await fetch(`${env.API_SERVER}/user`, {
      method: 'POST',
      headers: {
        'x-user-subject': user.id,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        "emailAddress": email,
        "firstName": firstName,
        "lastName": lastName,
        "knownAs": knownAs,
      }),
    })
    if (!response.ok) {
      console.error('Failed to update user details', response)
      return NextResponse.json({ message: 'Failed to update user details' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User details updated' })
  } catch (e) {
    console.error('Failed to update user details', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}