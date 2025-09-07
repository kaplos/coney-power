import Stripe from 'stripe';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(request) {
  const userSession = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  console.log('Received checkout request with params:', Object.fromEntries(searchParams.entries()));
  const item = searchParams.get('item');
  // const metaData = searchParams.get('metaData') || ''; // Default metadata if not provided
  const objectMap = {
    // Basic: { price: 'price_1RnVqjRUl1PVsffzTJWqkHvc', mode: 'subscription' ,metaData: "recXjTTaQ0P0TIUUV" },
    Standard: { price: 'price_1Rw6zARUl1PVsffznBgfCgK1', mode: 'subscription' ,metaData: "recsnVL6w3dnG5nP9" },
    Unlimited: { price: 'price_1Rw6x9RUl1PVsffzOtg7jd5p', mode: 'subscription' ,metaData: "rec1qEpy3ruJzF1SK" },
    'Single Kids Class': { price: 'price_1S1XwGRUl1PVsffzkKnJOIRr', mode: 'payment' ,metaData: "recguITtonVGfoAfn" },
    'Single Class': { price: 'price_1Rw72ARUl1PVsffzZGr4TR40', mode: 'payment', metaData: "recfs32A6UrFiAOCY" },
    Kids: { price: 'price_1S1XzYRUl1PVsffzcSl5Td5P', mode: 'subscription' ,metaData: "recrCAxtf8uzMPXgU" },
    default: {  price: 'price_1Rw72ARUl1PVsffzZGr4TR40', mode: 'payment' },
  };
  
  const {
  price = null,
  mode = null,
  metaData = searchParams.get('metaData'),
  category = searchParams.get('category'),
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
        },

      ],
      customer_email: userSession?.user?.email || undefined,
      metadata:{
        product: metaData,
        // user: userSession?.user?.email || 'guest',
        userId: userSession?.user?.id || '0',
        category: category
        
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
