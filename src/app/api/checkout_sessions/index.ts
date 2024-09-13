import stripe from "~/lib/stripe";

const params: Stripe.Checkout.SessionCreateParams = {
  submit_type: 'pay',
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Startup',
        },
        unit_amount: 15,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Pro',
        },
        unit_amount: 50,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Enterprise',
        },
        unit_amount: 200,
      },
      quantity: 1,
    },
  ],
  success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
  cancel: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
}
const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);
