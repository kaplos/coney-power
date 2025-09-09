import base from "@/lib/airtableBase";

export async function POST(request) {
  const { imageUrls } = await request.json();
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return new Response(JSON.stringify({ error: "No image URLs" }), { status: 400 });
  }
  // Create a new record for each image, or store all in one record as an array
//   for (const url of imageUrls) {
    await base("Gallery").create( imageUrls);
//   }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
export async function GET(request){
    const records = await base('Gallery').select({ maxRecords: 100}).firstPage();
    const images = records.map(record => ({
        id: record.fields['Record Id'],
        url: record.fields['Url'],
    }));
    return new Response(JSON.stringify(images), { status: 200, headers: { 'Content-Type': 'application/json' } });
}