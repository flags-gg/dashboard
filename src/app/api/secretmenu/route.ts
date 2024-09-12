import {NextResponse} from 'next/server';
import {env} from "~/env";

type SecretMenuGet = {
  sessionToken: string,
  userId: string,
  menuId: string,
}

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {sessionToken, userId, menuId}: SecretMenuGet = await request.json();

  try {
    const apiUrl = `${env.FLAGS_SERVER}/secret-menu/${menuId}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to get secret menu"}, { status: 500 });
    }

    console.info("response", response)

    return NextResponse.json(response.json());
  } catch (error) {
    console.error('Error getting secret menu:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
