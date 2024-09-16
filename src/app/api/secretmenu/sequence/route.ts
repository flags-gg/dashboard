import {env} from "~/env";
import {NextResponse} from 'next/server';

type SecretMenuParams = {
  sessionToken: string,
  userId: string,
  menuId?: string
  environmentId?: string,
  sequence?: string[],
}

export async function PUT(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {sessionToken, userId, menuId, sequence}: SecretMenuParams = await request.json();

  try {
    const apiUrl = `${env.FLAGS_SERVER}/secret-menu/${menuId}/sequence`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
      },
      body: JSON.stringify({
        "sequence": sequence
      }),
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to save secret menu sequence"}, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return response
  } catch (error) {
    console.error('Error saving secret menu sequence:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {sessionToken, userId, sequence, environmentId}: SecretMenuParams = await request.json();

  try {
    const apiUrl = `${env.FLAGS_SERVER}/secret-menu/${environmentId}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
      },
      cache: 'no-store',
      body: JSON.stringify({
        "sequence": sequence,
        "enabled": true,
      }),
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to get secret menu"}, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return response
  } catch (error) {
    console.error('Error getting secret menu:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
