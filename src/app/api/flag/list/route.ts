import { env } from "~/env";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";

type GetFlags = {
    environment_id: string
}

export async function POST(request: Request) {
    const { environment_id }: GetFlags = await request.json() as GetFlags
    const apiUrl = `${env.API_SERVER}/environment/${environment_id}/flags`
    const session = await getServerAuthSession();
    if (!session) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const res = await fetch(apiUrl, {
            headers: {
                'x-user-access-token': session.user.access_token,
                'x-user-subject': session.user.id,
            },
            cache: 'no-store'
        })
        if (!res.ok) {
            return NextResponse.json({ message: "Failed to fetch flags" }, { status: 500 });
        }

        return NextResponse.json(await res.json())
    } catch (e) {
        console.error('Failed to fetch flags', e)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}