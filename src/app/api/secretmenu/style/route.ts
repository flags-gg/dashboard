import { env } from "~/env";
import { NextResponse } from "next/server";
import { StyleFetch } from "~/app/(dashboard)/secretmenu/[menu_id]/styling/context";

export async function POST(request: Request) {
  type StyleParams = {
    sessionToken: string
    userId: string
    menuId: string
  }

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
    console.error("Failed to get style", response)
    return NextResponse.json({ message: "Failed to get style" }, { status: 500 })
  }

  const data = await response.json() as StyleFetch
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  type StyleParams = {
    sessionToken: string
    userId: string
    menuId?: string
    styleId?: string
    style: string
  }

  const { sessionToken, userId, menuId, styleId, style }: StyleParams = await request.json() as StyleParams
  const styleJson = JSON.parse(style)
  const dataModel = {
    menu_id: menuId,
    custom_style: {
      style_id: "",
      reset_button: styleJson.resetButton,
      close_button: styleJson.closeButton,
      container: styleJson.container,
      flag: styleJson.flag,
      button_enabled: styleJson.buttonEnabled,
      button_disabled: styleJson.buttonDisabled,
      header: styleJson.header,
    }
  }

  if (styleId) {
    dataModel.custom_style.style_id = styleId
  }

  try {
    const apiUrl = `${env.API_SERVER}/secret-menu/${menuId}/style`
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
      },
      body: JSON.stringify(dataModel),
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