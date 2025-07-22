export async function POST(request) {
    try {
      const body = await request.text(); // Use .text() for raw body, e.g. Stripe webhook
      const headers = request.headers;
  
      // Example: Signature verification (optional)
      // const signature = headers.get("stripe-signature");
  
      // You can parse JSON if needed
      // const jsonBody = JSON.parse(body);
  
      console.log("Webhook received:", body);
  
      // TODO: Handle the webhook logic here
  
      return new Response('Webhook received', { status: 200 });
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response('Webhook error', { status: 400 });
    }
  }
  