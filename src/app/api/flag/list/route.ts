import { env } from "~/env";
import { NextResponse } from "next/server";

type GetFlags = {
    sessionToken: string
    userId: string
    environment_id: string
}

export async function POST(request: Request) {
    const { environment_id, sessionToken, userId }: GetFlags = await request.json() as GetFlags
    const apiUrl = `${env.API_SERVER}/environment/${environment_id}/flags`

    try {
        const res = await fetch(apiUrl, {
            headers: {
                'x-user-access-token': sessionToken,
                'x-user-subject': userId,
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