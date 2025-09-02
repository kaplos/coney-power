import Airtable from "airtable";
import { add } from "date-fns";
import Stripe from "stripe";
import fs from "fs";
import path from "path";


const isDev = process.env.NODE_ENV !== 'production';
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);
const stripe = new Stripe(process.env.STRIPE_SECRET)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function storeWebhookEvent(event) {
  // console.log('Storing webhook event locally:', event);
  const webhooksDir = path.join(process.cwd(), 'stored-webhooks');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(webhooksDir)) {
    fs.mkdirSync(webhooksDir, { recursive: true });
  }
  
  const filename = `${event.type}-${event.id}-${Date.now()}.json`;
  const filepath = path.join(webhooksDir, filename);
  
  try {
    fs.writeFileSync(filepath, JSON.stringify(event, null, 2));
    console.log(`Webhook event stored: ${filename}`);
  } catch (error) {
    console.error('Error storing webhook event:', error);
  }
}

export async function POST(request) {

    console.log('🔥 WEBHOOK ENDPOINT HIT - Starting processing');

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  let event;
  try {
        console.log('🔐 Attempting to construct Stripe event...');
        if(isDev){
          event =JSON.parse(body);
        }else{
          event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
        }    
    console.log('✅ Event constructed successfully:', event.type, event.id);

  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
        console.error('Error details:', err);

    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  // Store the webhook event AFTER it's been constructed
  if(isDev){
    await storeWebhookEvent(event);
  }
  
  try {
    console.log('Received event:', event.type, 'Event ID:', event.id);
    
    if (event.type === "checkout.session.completed" || event.type === "customer.subscription.created") {
      return await addToAirtable(event);
    } else if (event.type === "customer.subscription.deleted") {
      return await editAirtable(event);
<<<<<<< Updated upstream
    }else {
      // ❗️ Catch-all response for unhandled event types
=======
    } else {
      console.log('Unhandled event type:', event.type);
>>>>>>> Stashed changes
      return new Response("Unhandled event type", { status: 200 });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook error", { status: 400 });
  }
}

async function addToAirtable(event) { 
  console.log('Processing event for Airtable:', event.type);
  console.log('Full event data:', JSON.stringify(event, null, 2));
  
  const { type, data } = event;
  
  if (type !== "checkout.session.completed" && type !== "customer.subscription.created") {
    return new Response("Webhook not handled", { status: 400 });
  }
  
  const {
    customer_details = {},
    metadata = {},
    mode = "",
    subscription = "",
    payment_intent = "",
  } = data.object;

  console.log('Mode:', mode);
  console.log('Metadata:', JSON.stringify(metadata, null, 2));
  console.log('Customer details:', JSON.stringify(customer_details, null, 2));

  if (mode === "payment") {
    console.log('Processing payment mode');
    try {
      const record = await base("tblefuz5SkZIDP0sl").create({
        "Members": [metadata.userId],
        fldKgeZdfw9HPYXG0: payment_intent,
      });
      console.log("Payment record created:", record.getId());
    } catch (err) {
      console.error("Error creating payment record:", err);
      throw err;
    }
<<<<<<< Updated upstream
    console.log(event);
    // console.log('rest' ,rest);
    const {
      customer_details = {},
      metadata = {},
      subscription = "",
      payment_intent = "",
    } = rest.data.object;
    console.log(JSON.stringify(customer_details, null, 2));

    // Example: Signature verification (optional)
    // const signature = headers.get("stripe-signature");

    // You can parse JSON if needed
    // const jsonBody = JSON.parse(body);
    base("tblefuz5SkZIDP0sl").create(
      {
        fldki6xSYyXXMvI24:customer_details.email, // Customer Email
        fld6cwjzBKEuYgD55: customer_details.name, // Customer Name
        fldygM7z866FZ1FBq: [metadata.product], // class id from airtable
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
=======
  } else if (mode === "subscription") {
    console.log("Processing subscription mode");
    try {
      const records = await base('tblEuSd8AfoXS8rau')
        .select({
          filterByFormula: `{Member ID} = "${metadata.userId}"`,
          maxRecords: 1,
        })
        .firstPage();
      
      if (records.length === 0) {
        console.log('No member found with ID:', metadata.userId);
        return new Response("Member not found", { status: 404 });
      }
      
      const updatedRecord = await base("tblEuSd8AfoXS8rau").update(
        [{
        id: records[0].id, 
        fields: {
          'Membership Type': [metadata.product],
          'Subscription Status': "Active",
          'Subscription Start Date': new Date().toISOString().split('T')[0],
          'Subscription End Date': "",
          'Subscription Id': subscription,
        }
      }]);
      
      console.log("Subscription record updated:", updatedRecord[0].getId());
    } catch (err) {
      console.error("Error updating subscription record:", err);
      throw err;
    }
  } else {
    console.log("Unhandled mode:", mode);
  }
>>>>>>> Stashed changes

  return new Response("Webhook received", { status: 200 });
}

async function editAirtable(event) {
  console.log('Processing deletion event for Airtable:', event.type);
  
  const { type, data } = event;
  
  if (type !== "customer.subscription.deleted") {
    return new Response("Webhook not handled", { status: 400 });
  }
  
  console.log('Subscription deletion event:', JSON.stringify(event, null, 2));
  
  const { id } = data.object;
  
  try {
    const records = await base('tblEuSd8AfoXS8rau')
      .select({
        filterByFormula: `{Subscription Id} = "${id}"`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      console.log('No matching subscription record found for ID:', id);
      return new Response("Subscription record not found", { status: 404 });
    }
    
    const recordId = records[0].id;
    
    const updatedRecord = await base('tblEuSd8AfoXS8rau').update([{
      id: recordId, 
      fields: { 
        "Subscription Status": 'Not Active',
        'Subscription End Date': new Date().toISOString().split('T')[0]

      }
    }]);

    console.log(`Subscription record ${recordId} updated to not active.`);
  } catch (err) {
    console.error("Error updating subscription cancellation:", err);
    throw err;
  }

  return new Response("Webhook received", { status: 200 });
}