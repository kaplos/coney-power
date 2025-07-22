import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const item = searchParams.get('item');
  const objectMap = {
    Basic: { price: 'price_1RnVqjRUl1PVsffzTJWqkHvc', mode: 'subscription' },
    Standard: { price: 'price_1RnVswRUl1PVsffzyhA5YAVH', mode: 'subscription' },
    Unlimited: { price: 'price_1RnVtdRUl1PVsffzcBCipXo9', mode: 'subscription' },
    default: { price: 2999, mode: 'payment' },
  };
  
  const { price, mode } = objectMap[item] ?? objectMap.default;
  console.log('Item:', item, 'Price:', price, 'Mode:', mode);
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        mode === 'payment'?
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item,
            },
            unit_amount: price,
          },
          quantity: 1,
        }
        :

        {
          price: price,
          quantity:1
        }
      ],
      mode,
      success_url: `${request.headers.get('origin')}/success?item=${item}`,
      cancel_url: `${request.headers.get('origin')}`,
    });
    console.log('Checkout session created:', session);
    // return new Response(JSON.stringify({ sessionId: session.id }), {
    //   status: 200,
    // });
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
    });
  } catch (err) {
    console.log('Error creating checkout session:', err);
    return new Response(JSON.stringify({ error: 'Checkout session creation failed' }), {
      status: 500,
    });
  }
}
