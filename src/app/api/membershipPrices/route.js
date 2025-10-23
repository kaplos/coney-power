
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(){
    const stripe = new Stripe(process.env.STRIPE_SECRET);
    const prices =  await stripe.prices.list({
        // limit: 10,
                lookup_keys: ['standard_monthly','ultimate_monthly','afterSchool_monthly','basic_monthly','single_class'],
        

      });
      return NextResponse.json(prices)

}