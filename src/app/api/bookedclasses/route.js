// ...existing code...
import { NextResponse } from "next/server";
import base from "@/lib/airtableBase.js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // uses exported authOptions
import { startOfWeek, endOfWeek } from '@/lib/getWeekInfo.js';
// GET -> return bookings for the currently authenticated user
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memberId = session.user.id || session.user.userId || "";
    const email = session.user.email || "";

    // Build a safe Airtable filter - prefer Member ID if available, fallback to email
    let filter =  '';
    if (memberId) {
      filter = `{Members} = '${memberId}'`;
    } else if (email) {
      filter = `{Email} = '${email}'`;
    } else {
      return NextResponse.json({ error: "No user identifier available" }, { status: 400 });
    }

    const records = await base("Member Bookings").select({
      filterByFormula: `AND(${filter} ,AND(IS_AFTER({Created At}, "${startOfWeek.toISOString()}"), IS_BEFORE({Created At}, "${endOfWeek.toISOString()}")))`,
    //   sort: [{ direction: "desc" }],
      maxRecords: 1000,
    }).firstPage();

    const bookings = records.map((r) => ({
      id: r.id,
      fields: r.fields,
    }));

    return NextResponse.json({ ok: true, bookings });
  } catch (err) {
    console.error("GET /api/booking error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST -> create a booking (keeps existing behaviour / compatible with current frontend)

// ...existing code...
