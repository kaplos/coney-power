import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  console.log('Received checkout request with params:', Object.fromEntries(searchParams.entries()));
  const item = searchParams.get('item');
  // const metaData = searchParams.get('metaData') || ''; // Default metadata if not provided
  const objectMap = {
    // Basic: { price: 'price_1RnVqjRUl1PVsffzTJWqkHvc', mode: 'subscription' ,metaData: "recXjTTaQ0P0TIUUV" },
    Standard: { price: 'price_1Rw6zARUl1PVsffznBgfCgK1', mode: 'subscription' ,metaData: "recmhCHMBAsIVzwjf" },
    Unlimited: { price: 'price_1Rw6x9RUl1PVsffzOtg7jd5p', mode: 'subscription' ,metaData: "recvQgIdOQQIK4W46" },
    'Single Class': { price: 'price_1Rw72ARUl1PVsffzZGr4TR40', mode: 'payment' },
    // Kids: { price: 'price_1S1b3eRUl1PVsffz7qTtY2nK', mode: 'subscription' ,metaData: "recbXjTTaQ0P0TIUUV" },
    default: {  price: 'price_1Rw72ARUl1PVsffzZGr4TR40', mode: 'payment' },
  };
  
  const {
  price = null,
  mode = null,
  metaData = searchParams.get('metaData'),
} = objectMap[item] ?? objectMap.default;
  console.log('Item:', item, 'Price:', price, 'Mode:', mode);
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        mode === 'payment'?
        {
          // price_data: {
          //   currency: 'usd',
          //   product_data: {
          //     name: item,
          //   },
          //   unit_amount: price,
          // },
          price: price,
          quantity: 1,
        }
        :

        {
          price: price,
          quantity:1
        }
      ],
      metadata:{
        product: metaData
      },
      mode,
      success_url: `${request.headers.get('origin')}/success?item=${item}&metaData=${metaData}`,
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
