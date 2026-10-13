import Stripe from "stripe"
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env"
import { authHeader } from "~/server/api";
import { logError } from "~/lib/logger";

type PricingPlan = {
  title: string
  stripe?: { price_id?: string, dev_price_id?: string }
}

export async function POST(request: Request) {
  const {plan}: {plan?: string} = await request.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only prices from the API's plan list are allowed; the key mode (not the client) picks test vs live price.
  let plans: PricingPlan[]
  try {
    const response = await fetch(`${env.API_SERVER}/company/pricing`, {
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
    }
    plans = ((await response.json()) as { prices?: PricingPlan[] }).prices ?? []
  } catch (e) {
    logError('Failed to fetch plans', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  const choice = plans.find((p) => p.title === plan)
  const priceId = /^[sr]k_live_/.test(env.STRIPE_SECRET) ? choice?.stripe?.price_id : choice?.stripe?.dev_price_id
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const stripe = new Stripe(env.STRIPE_SECRET, {
    apiVersion: "2026-08-26.dahlia",
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
      // Back to the dashboard page that confirms the upgrade (PUT below).
      return_url: `${new URL(request.url).origin}/company/upgrade?session_id={CHECKOUT_SESSION_ID}`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        priceId: priceId,
      },
      ui_mode: 'embedded_page',
      redirect_on_completion: 'always',
    });

    return NextResponse.json({clientSecret: stripeSession.client_secret})
  } catch (e) {
    logError('Failed to upgrade plan', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const {sessionId}: {sessionId: string} = await request.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // The API verifies the session (owner, price, paid, single use); only reject obvious junk here.
  if (typeof sessionId !== 'string' || !/^cs_\w+$/.test(sessionId)) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company/upgrade`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      body: JSON.stringify({
        sessionId: sessionId,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      logError("Failed to upgrade plan", await response.json())
      return NextResponse.json({ error: 'Failed to upgrade plan' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Plan upgraded successfully' })
  } catch (e) {
    logError('Failed to upgrade plan', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
