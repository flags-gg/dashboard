import { env } from "~/env";
import { NextResponse } from "next/server";
import { StyleState } from "~/app/(dashboard)/secretmenu/[menu_id]/styling/context";

type StyleParams = {
  sessionToken: string
  userId: string
  menuId: string
  style: string
}

export async function POST(request: Request): Promise<StyleState | Error> {
  const { sessionToken, userId, menuId }: StyleParams = await request.json() as StyleParams

  const apiUrl = `${env.API_SERVER}/secret-menu/${menuId}/style`
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-user-access-token': sessionToken,
      'x-user-subject': userId,
    },
    cache: 'no-store',
  })
  if (!response.ok) {
    return new Error('Failed to get style')
  }

  return await response.json() as StyleState
}

export async function PUT(request: Request) {
  const { sessionToken, userId, menuId, style }: StyleParams = await request.json() as StyleParams

  const styleJson = JSON.parse(style)

  try {
    const apiUrl = `${env.API_SERVER}/secret-menu/${menuId}/style`
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
      },
      body: JSON.stringify({
        menu_id: menuId,
        custom_style: {
          reset_button: styleJson.resetButton,
          close_button: styleJson.closeButton,
          container: styleJson.container,
          flag: styleJson.flag,
          button_enabled: styleJson.buttonEnabled,
          button_disabled: styleJson.buttonDisabled,
          header: styleJson.header,
        },
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: "Failed to update style" }, { status: 500 })
    }

    return NextResponse.json({ message: 'Style updated successfully' })
  } catch (e) {
    console.error('Failed to update style', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}