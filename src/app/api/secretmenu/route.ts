import {NextResponse} from 'next/server';
import {env} from "~/env";
import { getServerAuthSession } from "~/server/auth";

type SecretMenuParams = {
  menuId: string,
  sequence?: string[],
}

export async function POST(request: Request) {
  const {menuId}: SecretMenuParams = await request.json();
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!menuId) {
    return NextResponse.json({message: "No Menu to retrieve"}, { status: 404 });
  }

  try {
    const response = await fetch(`${env.API_SERVER}/secret-menu/${menuId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to get secret menu"}, { status: 500 });
    }
    return response
  } catch (error) {
    console.error('Error getting secret menu:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const {menu_id} = await request.json();
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/secret-menu/${menu_id}/state`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to update secret menu"}, { status: 500 });
    }

    return NextResponse.json({message: 'Secret menu updated successfully'})
  } catch (error) {
    console.error('Error updating secret menu:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
