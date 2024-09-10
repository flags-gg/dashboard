import {type Stripe, loadStripe} from '@stripe/stripe-js';
1
let stripePromise: Promise<Stripe | null>;
export default function getStripe(): Promise<Stripe | null> {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}
