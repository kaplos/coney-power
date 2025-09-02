import base from "@/lib/airtableBase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const userSession = await getServerSession(authOptions);
  const payload = await request.json();

  // 1. Fetch member record to get subscription type
  const userRecords = await base('tblEuSd8AfoXS8rau').select({
    filterByFormula: `{Member Id} = '${userSession.user.id}'`,
    maxRecords: 1,
  }).firstPage();

  if (!userRecords.length) {
    return new Response(JSON.stringify({ error: "Member not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log('User record:', userRecords[0].fields);

  const member = userRecords[0].fields;
  const subscriptionType = member['Name (from Membership Type)'][0];

  // 2. Check for double booking
 const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const existingBookings = await base('tblefuz5SkZIDP0sl').select({
  filterByFormula: `AND(
    ARRAYJOIN({Members}, ",") = '${userSession.user.id}',
    ARRAYJOIN({Class ID}, ",") = '${payload.class}',
    IS_AFTER({Created}, '${today.toISOString()}'),
    IS_BEFORE({Created}, '${tomorrow.toISOString()}')
  )`,
  maxRecords: 1,
}).firstPage();

  console.log('Existing bookings:', existingBookings[0]?.fields);

  if (existingBookings.length > 0) {
    return new Response(JSON.stringify({ Message: "You have already booked this class." }), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 3. If Standard, check monthly booking count
  if (subscriptionType === "Standard") {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const bookings = await base('tblefuz5SkZIDP0sl').select({
      filterByFormula: `AND(
        ARRAYJOIN({Members}, ",") = '${userSession.user.id}',
        IS_AFTER({Created}, '${startOfMonth.toISOString()}')
      )`
    }).firstPage();

    if (bookings.length >= 6) {
      return new Response(JSON.stringify({ error: "Monthly booking limit reached for Standard subscription." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 4. Create the booking
  await base("tblefuz5SkZIDP0sl").create({
    "Members": [userSession.user.id],
    fldygM7z866FZ1FBq: [payload.class], // class id from airtable
  });

  return new Response(JSON.stringify({ success: true , Message: "Booking created successfully." }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}