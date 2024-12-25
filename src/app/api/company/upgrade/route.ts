import Stripe from "stripe"
import { env } from "~/env"
import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {priceId}: {priceId: string} = await request.json();
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  const stripe = new Stripe(env.STRIPE_SECRET, {
    apiVersion: "2024-12-18.acacia",
    typescript: true,
    appInfo: {
      name: "Flags.gg",
      url: "https://flags.gg",
    }
  })

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      return_url: `${env.NEXTAUTH_URL}/company/upgrade/?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: session.user.id,
        priceId: priceId,
      },
      ui_mode: 'embedded',
      redirect_on_completion: 'always',
    });

    return NextResponse.json({clientSecret: stripeSession.client_secret})
  } catch (e) {
    console.error('Failed to upgrade plan', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const {sessionId}: {sessionId: string} = await request.json();
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company/upgrade`, {
      method: 'PUT',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({
        sessionId: sessionId,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      console.info("Failed to upgrade plan", await response.json())
      return NextResponse.json({ message: 'Failed to upgrade plan' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Plan upgraded successfully' })
  } catch (e) {
    console.error('Failed to upgrade plan', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}