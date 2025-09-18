import Airtable from "airtable";
import Stripe from "stripe";
import fs from "fs";
import path from "path";
import { withRetry } from "@/lib/withRetry.js";


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
  // if(isDev){
  //   await storeWebhookEvent(event);
  // }
  
  try {
    console.log('Received event:', event.type, 'Event ID:', event.id);
    
    if (event.type === "checkout.session.completed" || event.type === "customer.subscription.created") {
      return await addToAirtable(event);
    } else if (event.type === "customer.subscription.deleted") {
      return await editAirtable(event);
    } else {
      console.log('Unhandled event type:', event.type);
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
      // Determine which credit to add based on metadata.product
      // These IDs should match your checkout route's metaData for each class type
      const singleKidsClassId = "recguITtonVGfoAfn";
      const singleAdultClassId = "recfs32A6UrFiAOCY";

      let creditField = null;

      if (metadata.product === singleKidsClassId) {
        creditField = "KidsClassCredit";
      } else if (metadata.product === singleAdultClassId) {
        creditField = "AdultClassCredit";
      }

      if (creditField) {
        // Find the user record
        const userRecords = await base('tblEuSd8AfoXS8rau').select({
          filterByFormula: `{Member Id} = "${metadata.userId}"`,
          maxRecords: 1,
        }).firstPage();

        if (userRecords.length === 0) {
          console.log('No member found with ID:', metadata.userId);
          return new Response("Member not found", { status: 404 });
        }

        const userRecord = userRecords[0];
        const currentCredits = userRecord.fields[creditField] || 0;

        // Increment the appropriate credit
        await base("tblEuSd8AfoXS8rau").update([
          {
            id: userRecord.id,
            fields: {
              [creditField]: currentCredits + 1,
              'Class Category': metadata.category
            },
          },
        ]);
        console.log(`Added 1 credit to ${creditField} for user ${metadata.userId}`);
      }

      // Optionally, store the payment record as before
      // const record = await base("tblefuz5SkZIDP0sl").create({
      //   "Members": [metadata.userId],
      //   fldKgeZdfw9HPYXG0: payment_intent,
      // });
      console.log("Payment record created:", record.getId());
    } catch (err) {
      console.error("Error creating payment record or updating credits:", err);
      throw err;
    }
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
          // 'Subscription End Date': "",
          'Subscription Id': subscription,
          'Class Category': metadata.category
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
        "Membership Type": [],
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