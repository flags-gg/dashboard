import { env } from "~/env";
import { NextResponse } from "next/server";
import { type StyleFetch } from "~/app/(dashboard)/secretmenu/[menu_id]/styling/context";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  type StyleParams = {
    menuId: string
  }

  const { menuId }: StyleParams = await request.json() as StyleParams
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const response = await fetch(`${env.API_SERVER}/secret-menu/${menuId}/style`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-user-subject': user?.id,
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
    menuId?: string
    styleId?: string
    style: string
  }

  type ParsedStyle = {
    resetButton: string;
    closeButton: string;
    container: string;
    flag: string;
    buttonEnabled: string;
    buttonDisabled: string;
    header: string;
  }

  const { menuId, styleId, style }: StyleParams = await request.json() as StyleParams
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const styleJson = JSON.parse(style) as ParsedStyle
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
    const response = await fetch(`${env.API_SERVER}/secret-menu/${menuId}/style`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user?.id,
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