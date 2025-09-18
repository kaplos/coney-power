import base from "@/lib/airtableBase";
export async function POST(request) {
    const { memberId } = await request.json();
    const memberInfoRequest = await base("Members").find(memberId);
    const memberInfo = memberInfoRequest.fields;
    
    // console.log("memberInfo", memberInfo);
    if (memberInfo["Subscription Status"] !== "Active") {
        return new Response(
            JSON.stringify({ message: "Member is not active." }),
            {
                status: 400,
            }
        );
    }
    if (!memberId) {
        return new Response(
            JSON.stringify({ message: "Member ID is required." }),
            {
                status: 400,
            }
        );
    }
    // Simulate a successful check-in
    return new Response(JSON.stringify({ message: "Check-in successful!" }), {
        status: 200,
    });
}
