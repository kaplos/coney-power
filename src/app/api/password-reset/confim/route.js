import base from "@/lib/airtableBase";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { email, token, password } = await request.json();
  if (!email || !token || !password) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  // Find user
  const records = await base('Members').select({
    filterByFormula: `{Email} = '${email}'`,
    maxRecords: 1,
  }).firstPage();
  if (records.length === 0) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  const user = records[0].fields;
  if (
    user.ResetToken !== token ||
    !user.ResetTokenExpires ||
    Date.now() > user.ResetTokenExpires
  ) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
  }

  // Hash new password
  const hashed = await bcrypt.hash(password, 10);

  // Update password and clear token
  await base('Members').update(records[0].id, {
    "HashedPassword": hashed,
    "ResetToken": "",
    "ResetTokenExpires": 0,
  });

  return new Response(JSON.stringify({ ok: true }));
}