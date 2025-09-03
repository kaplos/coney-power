import base from "@/lib/airtableBase";
export  async function POST(request){
    const {email} = await request.json();

    const records = await base('Members').select({
        filterByFormula: `{Email} = '${email}'`,
        maxRecords: 1,
      }).firstPage();
        if (records.length > 0) {
            return new Response(JSON.stringify({ exists: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
                });
            } else {
                return new Response(JSON.stringify({ exists: false }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                    });
            }

}