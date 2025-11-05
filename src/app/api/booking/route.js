import base from "@/lib/airtableBase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import nodemailer from "nodemailer";
import { formatInTimeZone } from "date-fns-tz";



export async function POST(request) {
  const getEmailNotificationBody = (userSession, classDetails) => {
        const time = classDetails[0]?.fields?.["Class Time NY"];
        const className = classDetails[0]?.fields?.["Class Name"];
        return `User ${userSession.user.email} has booked ${className} for ${formatInTimeZone(
            time,
            "America/New_York",
            "MMMM d h:mm a"
          )}.`;
    }
    const userSession = await getServerSession(authOptions);
    const payload = await request.json();
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
   
    const classDetails = await base("tblCLBGeluENWFA24")
        .select({
            filterByFormula: `{Class ID} = '${payload.class}'`,
            maxRecords: 1,
        })
        .firstPage();
    //   console.log('Class details:', classDetails[0]?.fields);
    const classType = classDetails[0]?.fields?.["Class Category"];
    // 1. Fetch member record to get subscription type
    const userRecords = await base("tblEuSd8AfoXS8rau")
        .select({
            filterByFormula: `{Member Id} = '${userSession.user.id}'`,
            maxRecords: 1,
        })
        .firstPage();

    if (!userRecords.length) {
        return new Response(JSON.stringify({ error: "Member not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    //   console.log('User record:', userRecords[0].fields);

    const member = userRecords[0].fields;
    const subscriptionType = member["Name (from Membership Type)"][0];
    const sub = member["Subscription Status"] === "Active";
    const kidsClassCredits = member["KidsClassCredit"] || 0;
    const adultClassCredits = member["AdultClassCredit"] || 0;
    // const oneTimeCredits = member['One Time Credits'] || 0;
    // console.log(oneTimeCredits,'One time credits available');
    // 2. Check for double booking
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const existingBookings = await base("tblefuz5SkZIDP0sl")
        .select({
            filterByFormula: `AND(
    FIND('${userSession.user.id}', ARRAYJOIN({Members}, ',')),
    FIND('${payload.class}', ARRAYJOIN({Class ID}, ',')),
    IS_AFTER({Created At}, '${today.toISOString()}'),
    IS_BEFORE({Created At}, '${tomorrow.toISOString()}')
  )`,
            maxRecords: 1,
        })
        .firstPage();

    // console.log('Existing bookings:', existingBookings[0]?.fields);

    if (existingBookings.length > 0) {
        return new Response(
            JSON.stringify({
                Message: "You have already booked this class.",
                type: "error",
            }),
            {
                status: 409,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    // 3. If Standard, check monthly booking count
    if (subscriptionType === "Standard") {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const bookings = await base("tblefuz5SkZIDP0sl")
            .select({
                filterByFormula: `AND(
        ARRAYJOIN({Members}, ",") = '${userSession.user.id}',
        IS_AFTER({Created At}, '${startOfMonth.toISOString()}')
      )`,
            })
            .firstPage();

        if (bookings.length >= 6) {
            return new Response(
                JSON.stringify({
                    Message:
                        "Monthly booking limit reached for Standard subscription.",
                    type: "error",
                }),
                {
                    status: 403,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    }
    if (!sub || sub === "Not Active") {
        const creditField =
            classType === "Adults" ? "AdultClassCredit" : "KidsClassCredit";
        const currentCredits =
            classType === "Adults" ? adultClassCredits : kidsClassCredits;
        if (currentCredits <= 0) {
            return new Response(
                JSON.stringify({
                    Message:
                        "You need an active subscription or available one-time class credits to book a class.",
                    type: "error",
                }),
                {
                    status: 403,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        // Deduct one-time class credit
        await base("tblEuSd8AfoXS8rau").update([
            {
                id: userSession.user.id,
                fields: {
                    [creditField]: currentCredits - 1,
                },
            },
        ]);
    }
    // 4. Create the booking
    await base("tblefuz5SkZIDP0sl").create({
        Members: [userSession.user.id],
        fldygM7z866FZ1FBq: [payload.class], // class id from airtable
    });
    
    
   transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: "coneypower18@gmail.com",
    // to: "candminnovators@gmail.com",
    subject: "New Class Booking",
    text: getEmailNotificationBody(userSession, classDetails),
}).catch(console.error); // Optional: log errors

    return new Response(
        JSON.stringify({
            success: true,
            Message: "Booking created successfully.",
            // test: getEmailNotificationBody(userSession,classDetails),
            type: "success",
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}
