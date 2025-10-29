import base from "@/lib/airtableBase";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(request) {
  const { email } = await request.json();
  if (!email) return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });

  // Find user
  const records = await base('Members').select({
    filterByFormula: `{Email} = '${email}'`,
    maxRecords: 1,
  }).firstPage();
  if (records.length === 0) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 1000 * 60 * 30; // 30 minutes
  console.log(expires)
  // Store token and expiry in Airtable
  await base('Members').update(records[0].id, {
    "ResetToken": token,
    "ResetTokenExpires": expires,
  });

  // Send email
  console.log( process.env.FROM_EMAIL, process.env.EMAIL_PASSWORD)
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD
  }
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Password Reset",
    text: `Reset your password: ${resetUrl}`,
  });

  return new Response(JSON.stringify({ ok: true }));
}