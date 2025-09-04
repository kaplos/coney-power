import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";

import base from "@/lib/airtableBase.js";



export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  //   EmailProvider({
  //     server: process.env.EMAIL_SERVER,
  //     from: process.env.EMAIL_FROM,
  //     maxAge: 15 * 60, // How long email links are valid for (default 24h)
  // }),
CredentialsProvider({
  name: "Email and Password",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
 async authorize(credentials) {
  const records = await base('Members').select({
    filterByFormula: `{Email} = '${credentials.email}'`,
    maxRecords: 1,
  }).firstPage();

  if (records.length === 0) {
    // console.log("No user found for email:", credentials.email);
    return null;
  }

  const user = records[0].fields;
  // console.log("User found:", user);

  if (!user.HashedPassword) {
    // console.log("No hashed password for user:", user.Email);
    return null;
  }

  const isValid = await bcrypt.compare(credentials.password, user.HashedPassword);
  // console.log("Password valid:", isValid);
  if (!isValid) {
    // console.log("Invalid password for user:", user.Email);
    return null;
  }
//   console.log("Returning user object:", {
//   id: user['Member ID'] || user.Email,
//   email: user['Email'],
//   name: user['Name'],
// });

  return {
    id: user['Member ID'] ,
    email: user['Email'],
    name: user['Name'],
  };
}
    }),
    
  ],
  adapter: undefined,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user,account,email}) {
      if(account.provider === "google"){

      try {
        const email = user.email;
        const records = await base('Members').select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
          await base('Members').create([
            {
              fields: {
                Email: user.email,
                Name: user.name,
                // Optionally set default subscription fields here
                ['Membership Type']: "none",
                ['Subscription Status']: ["Not Active"],
              },
            },
          ]);
        }
        return true;
      } catch (err) {
        console.error('Airtable error:', err);
        return false;
      }
      }

      if(account.provider === "email"){
        const records = await base('Members').select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        }).firstPage();
        if (records.length === 0) {
          return "/register";  //if the email does not exist in the User collection, do not send a magic login link
        } else {
          return true;   //if the email exists in the User collection, email them a magic login link
        }
      }
      if(account.provider === 'credentials'){
        return true;
      }
    },
    async session({ session }) {
      try {
        const email = session.user.email;
        const records = await base('Members').select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        }).firstPage();

        if (records.length > 0) {
          const userFields = records[0].fields;
          // console.log('User fields from Airtable:', userFields);
          // Attach subscription info to the session
          session.user.subscriptionType = userFields['Membership Type'] || null;
          session.user.subscriptionStatus = userFields['Subscription Status'] || null;
          session.user.adultClassCredit = userFields['AdultClassCredit'] || 0;
          session.user.kidsClassCredit = userFields['KidsClassCredit'] || 0;
          session.user.membershipName = userFields['Name (from Membership Type)'] ? userFields['Name (from Membership Type)'][0] : 'Not Subscribed';
          session.user.id = userFields['Member ID'] || 0;

        }
      } catch (err) {
        console.error('Airtable error (session):', err);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };