import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import base from "@/lib/airtableBase.js";



export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
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
                subscriptionType: "none",
                subscriptionStatus: "inactive",
                oneTimeClassCredits: 0,
              },
            },
          ]);
        }
        return true;
      } catch (err) {
        console.error('Airtable error:', err);
        return false;
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
          session.user.oneTimeClassCredits = userFields['One Time Classes'] || 0;
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