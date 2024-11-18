import Stripe from "stripe"
import { env } from "~/env"

export const stripe = new Stripe(env.STRIPE_KEY, {
  apiVersion: "2024-10-28.acacia",
  typescript: true,
  appInfo: {
    name: "Flags.gg",
    url: "https://flags.gg",
  }
})
