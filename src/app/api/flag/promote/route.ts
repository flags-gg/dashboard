import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "~/env";

type PromoteFlag = {
  flag_id: string
}

export async function POST(request: Request) {
  const {flag_id}: PromoteFlag = await request.json() as PromoteFlag;
  const user = await currentUser();
  if (!user) {
    return new NextResponse('unauthorized', {status: 401});
  }

  try {
    const response = await fetch(`${env.API_SERVER}/flag/${flag_id}/promote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'x-user-subject': user.id,
      },
      body: JSON.stringify({
        flagId: flag_id,
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      return NextResponse.json({message: "failed to promote flag"}, {status: 500})
    }

    return NextResponse.json({message: "successfully promoted flag"});
  } catch (error) {
    console.error(error);
    return NextResponse.json({message: "failed to promote flag"}, {status: 500});
  }
}