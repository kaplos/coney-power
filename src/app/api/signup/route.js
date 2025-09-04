import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import base from "@/lib/airtableBase.js";

export async function POST(req) {
  const { email, password, name } = await req.json();

  // Check if user already exists
  const records = await base('Members').select({
    filterByFormula: `{Email} = '${email}'`,
    maxRecords: 1,
  }).firstPage();

  if (records.length > 0) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in Airtable
  await base('Members').create([
    {
      fields: {
        Email: email,
        Name: name,
        ['HashedPassword']: hashedPassword,
        ['Membership Type']: [],
        // ['Subscription Status']: ["Not Active"],
        // Set any other default fields here
      },
    },
  ]);

  return NextResponse.json({ success: true });
}