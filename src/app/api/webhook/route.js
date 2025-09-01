import Airtable from "airtable";
import Stripe from "stripe";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);
const stripe = new Stripe(process.env.STRIPE_SECRET)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


export async function POST(request) {
   const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "customer.subscription.created") {
    return await addToAirtable(event);
    } else if (event.type === "customer.subscription.deleted") {
      return await editAirtable(event);
    } else {
      console.log('Unhandled event :', event);
      // ❗️ Catch-all response for unhandled event types
      return new Response("Unhandled event type", { status: 200 });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook error", { status: 400 });
  }


}

async function addToAirtable(event) { 
   const { type, ...rest } = event;
    if (type !== "checkout.session.completed" && type !== "customer.subscription.deleted") {
      return new Response("Webhook not handled", { status: 400 });
    }
    console.log(event);
    // console.log('rest' ,rest);
    const {
      customer_details = {},
      metadata = {},
      mode = "",
      subscription = "",
      payment_intent = "",
    } = rest.data.object;

    console.log('mode',mode)
    console.log(JSON.stringify(customer_details, null, 2));

    if(mode === "payment"){
    // Example: Signature verification (optional)
    // const signature = headers.get("stripe-signature");

    // You can parse JSON if needed
    // const jsonBody = JSON.parse(body);
    base("tblefuz5SkZIDP0sl").create(
      {
        // fldki6xSYyXXMvI24: customer_details.email, // Customer Email
        // fld6cwjzBKEuYgD55: customer_details.name, // Customer Name
        "Members": metadata.userId,
        // fldygM7z866FZ1FBq: [metadata.product], // class id from airtable
        fldKgeZdfw9HPYXG0: subscription || payment_intent, //PaymentID from stripe
      },
      function (err, record) {
        if (err) {
          console.error("Error creating record:", err);
          return;
        }
        console.log("Record created:", record.getId());
      }
    );
  } else if (mode === "subscription") {
    console.log("Handling subscription creation in Airtable");
    // Handle subscription logic
    const records = await base('tblEuSd8AfoXS8rau')
    .select({
      filterByFormula: `{Member ID} = "${metadata.userId}"`,
      maxRecords: 1,
    })
    .firstPage();
    
    base("tblEuSd8AfoXS8rau").update(
      [{id: records[0].id, fields: {
        'Membership Type' : metadata.product,
        'Subscription Status': "Active",
        'Subscription Start Date': new Date().toISOString().split('T')[0],
        'Subscription Id': subscription,

      }}]
      ,
      function (err, record) {
        if (err) {
          console.error("Error creating record:", err);
          return;
        }
        console.log("Record created:", record.getId());
      }
    );
  }else{
    console.log("Unhandled mode:", mode);
  }

    // console.log("Webhook received:", body);

    // TODO: Handle the webhook logic here

    return new Response("Webhook received", { status: 200 });
  }

async function editAirtable(event){
  const { type, ...rest } = event;
    if (type !== "checkout.session.completed" && type !== "customer.subscription.deleted") {
      return new Response("Webhook not handled", { status: 400 });
    }
    console.log(event);
    // console.log('rest' ,rest);
    const {
      id,
    } = rest.data.object;

    const records = await base('tblefuz5SkZIDP0sl')
    .select({
      filterByFormula: `{fldKgeZdfw9HPYXG0} = "${id }"`,
      maxRecords: 1,
    })
    .firstPage();

     if (records.length === 0) {
    console.log('No matching record found.');
    return;
}
    const recordId = records[0].id;

   base('tblefuz5SkZIDP0sl').update([{id: recordId, fields: { "fldpfn6GjgX6w5G7y": 'No Show/Canceled' }}]);

  console.log(`Record ${recordId} updated.`);

  

    return new Response("Webhook received", { status: 200 });
  }